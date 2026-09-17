import pool from "../config/db.js";

const getPostsController = async (req, res) => {
    try {
        const { departmentId } = req.params;
        console.log(departmentId);

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
                COALESCE(SUM(CASE WHEN v.vote_type = 'UP' THEN 1 WHEN v.vote_type = 'DOWN' THEN -1 ELSE 0 END), 0)::INT AS "initialVotes"
             FROM RESOURCES r
             LEFT JOIN STUDENT s ON r.uploaded_by = s.student_id
             LEFT JOIN VOTES v ON r.resource_id = v.resource_id
             WHERE r.dept_code = $1
             GROUP BY r.resource_id, s.name
             ORDER BY r.created_at DESC`,
            [departmentId]
        );

        res.status(200).send(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error occurred, Posts cannot be fetched");
    }
};

export default getPostsController;