import pool from "../config/db.js"

const getAllCoursesDoubts = (async (req,res)=>{
    const {student_id} = req.params
    try{
        const result = await pool.query(
            `SELECT d.doubt_id AS id, d.title, d.description,
                    d.course_code AS "courseCode", s.name AS "authorName",
                    d.posted_at AS "createdAt", d.solved,
                    0 AS "reactionCount", COUNT(DISTINCT a.answer_id)::int AS "answerCount",
                    '[]'::json AS attachments
             FROM DOUBTS d
             JOIN STUDENT s ON s.student_id = d.author
             JOIN COURSES c ON c.course_code = d.course_code
             JOIN DEPT_GROUPS dg ON dg.dept_code = c.dept_code
             JOIN JOINED_GROUPS jg ON jg.group_id = dg.group_id
             LEFT JOIN ANSWERS a ON a.doubt_id = d.doubt_id
             WHERE jg.student_id = $1
             GROUP BY d.doubt_id, s.name
             ORDER BY "createdAt" DESC`,
            [student_id]
        )

        const doubts = result.rows
        const doubtIds = doubts.map(({ id }) => id)
        const attachmentTable = await pool.query("SELECT to_regclass('public.doubt_attachments') AS table_name")

        if (attachmentTable.rows[0].table_name && doubtIds.length > 0) {
            const attachmentsResult = await pool.query(
                `SELECT attachment_id AS id, doubt_id, original_name AS "originalName",
                        file_url AS "fileUrl", file_type AS "fileType"
                 FROM DOUBT_ATTACHMENTS
                 WHERE doubt_id = ANY($1::int[])`,
                [doubtIds]
            )

            const attachmentsByDoubt = new Map()
            for (const attachment of attachmentsResult.rows) {
                const attachments = attachmentsByDoubt.get(attachment.doubt_id) ?? []
                attachments.push({
                    id: attachment.id,
                    originalName: attachment.originalName,
                    fileUrl: attachment.fileUrl,
                    fileType: attachment.fileType
                })
                attachmentsByDoubt.set(attachment.doubt_id, attachments)
            }

            for (const doubt of doubts) {
                doubt.attachments = attachmentsByDoubt.get(doubt.id) ?? []
            }
        }

        res.send(doubts)


    }catch(err){
        console.log(err)
        res.status(500).send("couldn't get doubts")
    }
})

export default getAllCoursesDoubts
