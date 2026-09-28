import pool from "../config/db.js";
import { withTransaction } from "../utils/withTransaction.js";

export const getComments = async (req, res) => {
	try {
		const { resourceId } = req.params;
		const result = await pool.query(
			`SELECT c.comment_id, c.comment_text, c.parent_comment_id, c.commented_at,
			        COALESCE(s.name, 'Student') AS author
			 FROM RESOURCE_COMMENTS c
			 LEFT JOIN STUDENT s ON s.student_id = c.author
			 WHERE c.resource_id = $1
			 ORDER BY c.commented_at ASC`,
			[resourceId]
		);

		res.json(result.rows);
	} catch (error) {
		console.error("Get comments error:", error);
		res.status(500).json({ message: "Could not load comments." });
	}
};

export const createComment = async (req, res) => {
	try {
		const { resourceId } = req.params;
		const commentText = req.body.commentText?.trim();
		const studentId = req.user.student_id;
		const parentCommentId = req.body.parentCommentId ? Number(req.body.parentCommentId) : null;

		if (!commentText) {
			return res.status(400).json({ message: "Comment cannot be empty." });
		}
		if (parentCommentId !== null && (!Number.isInteger(parentCommentId) || parentCommentId < 1)) {
			return res.status(400).json({ message: "Invalid parent comment." });
		}

		const commentResult = await withTransaction(pool, async (client) => {
			const result = await client.query(
				`INSERT INTO RESOURCE_COMMENTS (comment_text, resource_id, parent_comment_id, author)
				 SELECT $1, $2, $3, $4
				 WHERE $3::INTEGER IS NULL OR EXISTS (
				   SELECT 1 FROM RESOURCE_COMMENTS
				   WHERE comment_id = $3 AND resource_id = $2
				 )
				 RETURNING comment_id, comment_text, parent_comment_id, commented_at`,
				[commentText, resourceId, parentCommentId, studentId]
			);
			if (result.rows.length === 0) return null;
			const authorResult = await client.query(
				"SELECT COALESCE(name, 'Student') AS author FROM STUDENT WHERE student_id = $1",
				[studentId]
			);
			return { comment: result.rows[0], author: authorResult.rows[0]?.author || "Student" };
		});
		if (!commentResult) {
			return res.status(404).json({ message: "Parent comment was not found on this post." });
		}

		res.status(201).json({
			...commentResult.comment,
			author: commentResult.author
		});
	} catch (error) {
		console.error("Create comment error:", error);
		res.status(500).json({ message: "Could not add comment." });
	}
};
