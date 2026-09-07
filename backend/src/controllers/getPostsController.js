import pool from "../config/db.js";

const getPostsController = async (req, res) => {
    try {
        const { departmentId } = req.params;
        console.log(departmentId);

        const result = await pool.query(
            `SELECT 
                r.resource_id AS id,
                r.title,
                r.description AS content,
                r.file_url,
                r.file_type,
                r.created_at AS "createdAt",
                COALESCE(s.name, 'Student') AS author
             FROM RESOURCES r
             LEFT JOIN STUDENT s ON r.uploaded_by = s.student_id
             WHERE r.dept_code = $1
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
