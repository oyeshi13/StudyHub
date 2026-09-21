import pool from "../config/db.js";

const getPostsController = async (req, res) => {
    try {
        const { departmentId, student_id } = req.params;
        const isStudentFeed = Boolean(student_id);
        const filterValue = student_id || departmentId;

        const result = await pool.query(
            `SELECT
                r.resource_id AS id,
                r.resource_id,
                r.title,
                r.description AS content,
                r.file_url,
                r.file_type,
                r.created_at AS "createdAt",
                COALESCE(s.name, 'Student') AS author,
                     dg.group_name AS "group",
                COALESCE(SUM(CASE WHEN v.vote_type = 'UP' THEN 1 WHEN v.vote_type = 'DOWN' THEN -1 ELSE 0 END), 0)::INT AS "initialVotes",
                (SELECT COUNT(*)::INT FROM RESOURCE_COMMENTS c WHERE c.resource_id = r.resource_id) AS "commentsCount"
             FROM RESOURCES r
             LEFT JOIN STUDENT s ON r.uploaded_by = s.student_id
                 LEFT JOIN DEPT_GROUPS dg ON dg.dept_code = r.dept_code
             LEFT JOIN VOTES v ON r.resource_id = v.resource_id
                 ${isStudentFeed
                     ? "JOIN JOINED_GROUPS jg ON jg.group_id = dg.group_id WHERE jg.student_id = $1"
                     : "WHERE r.dept_code = $1"}
                 GROUP BY r.resource_id, s.name, dg.group_name
                 ORDER BY r.created_at DESC`,
                [filterValue]
        );

        res.status(200).send(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error occurred, Posts cannot be fetched");
    }
};

export default getPostsController;