import pool from "../config/db.js";
import { withTransaction } from "../utils/withTransaction.js";

export const reportComment = async (req, res) => {
  const studentId = req.user.student_id;
  const { commentId } = req.params;
  const reason = req.body.reason?.trim();
  if (!reason) return res.status(400).json({ error: "Reason is required to submit a report." });

  try {
    const result = await withTransaction(pool, (client) => client.query(
      `INSERT INTO COMMENT_REPORTS (comment_id, student_id, reason)
       VALUES ($1, $2, $3)
       ON CONFLICT (student_id, comment_id) DO NOTHING
       RETURNING report_id`,
      [commentId, studentId, reason]
    ));
    if (result.rows.length === 0) return res.status(409).json({ error: "You have already reported this comment." });
    return res.status(201).json({ message: "Comment reported successfully." });
  } catch (error) {
    console.error("Report comment error:", error.message);
    return res.status(error.code === "23503" ? 404 : 500).json({ error: "Could not report this comment." });
  }
};

export const getReportedComments = async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT cr.report_id, cr.comment_id, cr.reason, cr.reported_at,
             c.comment_text, s.name AS reporter_name
      FROM COMMENT_REPORTS cr
      JOIN RESOURCE_COMMENTS c ON cr.comment_id = c.comment_id
      JOIN STUDENT s ON cr.student_id = s.student_id
      ORDER BY cr.reported_at DESC`);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get reported comments error:", error.message);
    return res.status(500).json({ error: "Could not fetch reports." });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const result = await withTransaction(pool, (client) => client.query(
      "DELETE FROM RESOURCE_COMMENTS WHERE comment_id = $1 RETURNING comment_id",
      [req.params.commentId]
    ));
    if (result.rowCount === 0) return res.status(404).json({ message: "Comment not found." });
    return res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.error("Delete comment error:", error.message);
    return res.status(500).json({ error: "Could not delete comment." });
  }
};

export const reportResource = async (req, res) => {
  const studentId = req.user.student_id;
  const { resourceId } = req.params;
  const reason = req.body.reason?.trim();
  if (!reason) return res.status(400).json({ error: "Reason is required to submit a report." });

  try {
    const result = await withTransaction(pool, (client) => client.query(
      `INSERT INTO RESOURCE_REPORTS (resource_id, student_id, reason)
       VALUES ($1, $2, $3)
       ON CONFLICT (student_id, resource_id) DO NOTHING
       RETURNING report_id`,
      [resourceId, studentId, reason]
    ));
    if (result.rows.length === 0) return res.status(409).json({ error: "You have already reported this resource." });
    return res.status(201).json({ message: "Resource reported successfully." });
  } catch (error) {
    console.error("Report resource error:", error.message);
    return res.status(error.code === "23503" ? 404 : 500).json({ error: "Could not report this resource." });
  }
};

export const getReportedResources = async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT rr.report_id, rr.resource_id, rr.reason, rr.reported_at,
             r.title AS resource_title, r.description AS resource_description,
             s.name AS reporter_name
      FROM RESOURCE_REPORTS rr
      JOIN RESOURCES r ON rr.resource_id = r.resource_id
      JOIN STUDENT s ON rr.student_id = s.student_id
      ORDER BY rr.reported_at DESC`);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get reported resources error:", error.message);
    return res.status(500).json({ error: "Could not fetch resource reports." });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const result = await withTransaction(pool, (client) => client.query(
      "DELETE FROM RESOURCES WHERE resource_id = $1 RETURNING resource_id",
      [req.params.resourceId]
    ));
    if (result.rowCount === 0) return res.status(404).json({ message: "Resource not found." });
    return res.status(200).json({ message: "Resource deleted successfully." });
  } catch (error) {
    console.error("Delete resource error:", error.message);
    return res.status(500).json({ error: "Could not delete resource." });
  }
};