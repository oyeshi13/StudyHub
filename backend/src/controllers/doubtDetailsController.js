import pool from "../config/db.js"

const getDoubt = async (req, res) => {
    const doubtId = Number(req.params.doubtId)

    if (!Number.isInteger(doubtId)) {
        return res.status(400).json({ message: "Invalid doubt id." })
    }

    try {
        const result = await pool.query(
            `SELECT d.doubt_id AS id, d.title, d.description,
                    d.course_code AS "courseCode", c.course_title AS "courseName",
                    s.name AS "authorName", d.author AS "authorId",
                    d.posted_at AS "createdAt", d.solved,
                    0 AS "reactionCount",
                    COUNT(DISTINCT a.answer_id)::int AS "answerCount"
             FROM DOUBTS d
             JOIN STUDENT s ON s.student_id = d.author
             JOIN COURSES c ON c.course_code = d.course_code
             LEFT JOIN ANSWERS a ON a.doubt_id = d.doubt_id
             WHERE d.doubt_id = $1
             GROUP BY d.doubt_id, c.course_title, s.name`,
            [doubtId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Doubt not found." })
        }

        const doubt = result.rows[0]
        const attachmentsTable = await pool.query("SELECT to_regclass('public.doubt_attachments') AS table_name")
        doubt.attachments = []

        if (attachmentsTable.rows[0].table_name) {
            const attachments = await pool.query(
                `SELECT attachment_id AS id, original_name AS "originalName",
                        file_url AS "fileUrl", file_type AS "fileType"
                 FROM DOUBT_ATTACHMENTS
                 WHERE doubt_id = $1
                 ORDER BY attachment_id`,
                [doubtId]
            )
            doubt.attachments = attachments.rows
        }

        return res.json(doubt)
    } catch (error) {
        console.error("Get doubt error:", error.message)
        return res.status(500).json({ message: "Couldn't load doubt." })
    }
}

const getAnswers = async (req, res) => {
    const doubtId = Number(req.params.doubtId)

    if (!Number.isInteger(doubtId)) {
        return res.status(400).json({ message: "Invalid doubt id." })
    }

    try {
        const result = await pool.query(
            `SELECT a.answer_id AS id, a.doubt_id AS "doubtId",
                    a.answer_text AS content, a.author AS "authorId",
                    s.name AS "authorName", a.answered_at AS "createdAt",
                    0 AS "reactionCount", FALSE AS "isAccepted"
             FROM ANSWERS a
             JOIN STUDENT s ON s.student_id = a.author
             WHERE a.doubt_id = $1
             ORDER BY a.answered_at ASC, a.answer_id ASC`,
            [doubtId]
        )

        return res.json(result.rows)
    } catch (error) {
        console.error("Get answers error:", error.message)
        return res.status(500).json({ message: "Couldn't load answers." })
    }
}

const postAnswer = async (req, res) => {
    const doubtId = Number(req.params.doubtId)
    const { content, author } = req.body

    if (!Number.isInteger(doubtId) || !Number.isInteger(Number(author)) || !content?.trim()) {
        return res.status(400).json({ message: "Doubt, answer, and author are required." })
    }

    try {
        const result = await pool.query(
            `INSERT INTO ANSWERS (doubt_id, answer_text, author)
             SELECT $1, $2, s.student_id
             FROM STUDENT s
             JOIN DOUBTS d ON d.doubt_id = $1
             WHERE s.student_id = $3
             RETURNING answer_id AS id, doubt_id AS "doubtId", answer_text AS content,
                       author AS "authorId", answered_at AS "createdAt"`,
            [doubtId, content.trim(), Number(author)]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Doubt or student not found." })
        }

        return res.status(201).json({
            ...result.rows[0],
            authorName: "You",
            reactionCount: 0,
            isAccepted: false
        })
    } catch (error) {
        console.error("Post answer error:", error.message)
        return res.status(500).json({ message: "Couldn't post answer." })
    }
}

export { getDoubt, getAnswers, postAnswer }
