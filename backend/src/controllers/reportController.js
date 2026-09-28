import pool from "../config/db.js";

// ==========================================
// COMMENT REPORTING CONTROLLERS
// ==========================================

// 1. Report a Comment
export const reportComment = async (req, res) => {
  const studentId = req.user.student_id || req.user.id;
  const { commentId } = req.params;
  const { reason } = req.body;

  if (!reason || !reason.trim()) {
    return res.status(400).json({ error: "Reason is required to submit a report." });
  }

  try {
    const existing = await pool.query(
      `SELECT * FROM COMMENT_REPORTS WHERE student_id = $1 AND comment_id = $2;`,
      [studentId, commentId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "You have already reported this comment." });
    }

    await pool.query(
      `INSERT INTO COMMENT_REPORTS (comment_id, student_id, reason) VALUES ($1, $2, $3);`,
      [commentId, studentId, reason.trim()]
    );

    return res.status(200).json({ message: "Comment reported successfully." });
  } catch (error) {
    console.error("Report comment error:", error);
    return res.status(500).json({ error: "Database error while reporting comment." });
  }
};

// 2. Admin: Get all reported comments
export const getReportedComments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        cr.report_id,
        cr.comment_id,
        cr.reason,
        cr.reported_at,
        c.content AS comment_text,
        s.name AS reporter_name
      FROM COMMENT_REPORTS cr
      JOIN resource_comments c ON cr.comment_id = c.comment_id
      JOIN student s ON cr.student_id = s.student_id
      ORDER BY cr.reported_at DESC;
    `);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get reported comments error:", error);
    return res.status(500).json({ error: "Database error fetching reports." });
  }
};

// 3. Admin: Delete comment and cascade delete reports
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    await pool.query(`DELETE FROM resource_comments WHERE comment_id = $1;`, [commentId]);
    return res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({ error: "Failed to delete comment." });
  }
};


// ==========================================
// RESOURCE REPORTING CONTROLLERS
// ==========================================

// 4. Report a Resource (Post)
export const reportResource = async (req, res) => {
  const studentId = req.user.student_id || req.user.id;
  const { resourceId } = req.params;
  const { reason } = req.body;

  if (!reason || !reason.trim()) {
    return res.status(400).json({ error: "Reason is required to submit a report." });
  }

  try {
    // Check if user already reported this resource
    const existing = await pool.query(
      `SELECT * FROM RESOURCE_REPORTS WHERE student_id = $1 AND resource_id = $2;`,
      [studentId, resourceId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "You have already reported this post/resource." });
    }

    await pool.query(
      `INSERT INTO RESOURCE_REPORTS (resource_id, student_id, reason) VALUES ($1, $2, $3);`,
      [resourceId, studentId, reason.trim()]
    );

    return res.status(200).json({ message: "Resource reported successfully." });
  } catch (error) {
    console.error("Report resource error:", error);
    return res.status(500).json({ error: "Database error while reporting resource." });
  }
};

// 5. Admin: Get all reported resources
export const getReportedResources = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        rr.report_id,
        rr.resource_id,
        rr.reason,
        rr.reported_at,
        r.title AS resource_title,
        r.description AS resource_description,
        s.name AS reporter_name
      FROM RESOURCE_REPORTS rr
      JOIN resources r ON rr.resource_id = r.resource_id
      JOIN student s ON rr.student_id = s.student_id
      ORDER BY rr.reported_at DESC;
    `);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get reported resources error:", error);
    return res.status(500).json({ error: "Database error fetching reported resources." });
  }
};

// 6. Admin: Delete resource (Post)
export const deleteResource = async (req, res) => {
  const { resourceId } = req.params;

  try {
    await pool.query(`DELETE FROM resources WHERE resource_id = $1;`, [resourceId]);
    return res.status(200).json({ message: "Resource deleted successfully." });
  } catch (error) {
    console.error("Delete resource error:", error);
    return res.status(500).json({ error: "Failed to delete resource." });
  }
};