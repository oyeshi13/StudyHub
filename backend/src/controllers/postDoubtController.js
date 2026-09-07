import pool from "../config/db.js";

const postDoubt = async (req, res) => {
    const { course_code, title, description, author } = req.body;
    const files = req.files ?? [];

    if (!course_code || !title?.trim() || !description?.trim() || !Number.isInteger(Number(author))) {
        return res.status(400).json({ message: "Course, title, description, and author are required." });
    }

    let client;
    try {
        client = await pool.connect();
        await client.query("BEGIN");

        // A student can post only in a course belonging to one of their joined groups.
        const result = await client.query(
            `INSERT INTO DOUBTS (title, description, course_code, author, solved)
             SELECT $1, $2, c.course_code, $4, FALSE
             FROM COURSES c
             JOIN DEPT_GROUPS dg ON dg.dept_code = c.dept_code
             JOIN JOINED_GROUPS jg ON jg.group_id = dg.group_id
             WHERE c.course_code = $3 AND jg.student_id = $4
             RETURNING doubt_id, title, description, course_code, posted_at`,
            [title.trim(), description.trim(), course_code, author]
        );

        if (result.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(403).json({ message: "You can only post doubts in courses from groups you have joined." });
        }

        const doubt = result.rows[0];
        const attachments = [];
        for (const file of files) {
            const attachment = await client.query(
                `INSERT INTO DOUBT_ATTACHMENTS (doubt_id, original_name, file_url, file_type, file_size)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING attachment_id, original_name, file_url, file_type, file_size`,
                [
                    doubt.doubt_id,
                    file.originalname,
                    `/uploads/doubts/${file.filename}`,
                    file.mimetype,
                    file.size
                ]
            );
            attachments.push(attachment.rows[0]);
        }
        await client.query("COMMIT");

        return res.status(201).json({
            message: "Doubt posted successfully.",
            doubt: {
                id: doubt.doubt_id,
                title: doubt.title,
                description: doubt.description,
                courseCode: doubt.course_code,
                authorName: "You",
                createdAt: doubt.posted_at,
                tags: [],
                reactionCount: 0,
                answerCount: 0,
                attachments
            }
        });
    } catch (err) {
        if (client) await client.query("ROLLBACK").catch(() => {});
        console.error("Post doubt error:", err.message);
        return res.status(500).json({ message: "Couldn't post doubt." });
    } finally {
        client?.release();
    }
};

export default postDoubt;
