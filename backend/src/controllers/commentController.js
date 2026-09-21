import pool from "../config/db.js";

export const getComments = async (req, res) => {
	try {
		const { resourceId } = req.params;
		const result = await pool.query(
			`SELECT c.comment_id, c.comment_text, c.commented_at, COALESCE(s.name, 'Student') AS author
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

		if (!commentText) {
			return res.status(400).json({ message: "Comment cannot be empty." });
		}

		const result = await pool.query(
			`INSERT INTO RESOURCE_COMMENTS (comment_text, resource_id, author)
			 VALUES ($1, $2, $3)
			 RETURNING comment_id, comment_text, commented_at`,
			[commentText, resourceId, studentId]
		);

		const comment = result.rows[0];
		const authorResult = await pool.query(
			"SELECT COALESCE(name, 'Student') AS author FROM STUDENT WHERE student_id = $1",
			[studentId]
		);

		res.status(201).json({
			...comment,
			author: authorResult.rows[0]?.author || "Student"
		});
	} catch (error) {
		console.error("Create comment error:", error);
		res.status(500).json({ message: "Could not add comment." });
	}
};
