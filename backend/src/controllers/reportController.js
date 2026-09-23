import pool from "../config/db.js";

// Report a Comment
export const reportComment = async (req, res) => {
  const studentId = req.user.student_id || req.user.id;
  const { commentId } = req.params;
  const { reason } = req.body;

  if (!reason || !reason.trim()) {
    return res.status(400).json({ error: "Reason is required to submit a report." });
  }

  try {
    // Check if user already reported this comment
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

// Admin: Get all reported comments
export const getReportedComments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        cr.report_id,
        cr.comment_id,
        cr.reason,
        cr.reported_at,
        c.comment_text,
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

// Admin: Delete comment and resolve report
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