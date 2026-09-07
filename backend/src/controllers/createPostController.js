import pool from "../config/db.js";

const createPostController = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const { title, description, file_url, file_type, student_id } = req.body;

        const query = `
            INSERT INTO Resources (title, description, file_url, file_type, uploaded_by, dept_code)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [
            title,
            description,
            file_url || 'N/A',
            file_type || 'Text',
            student_id,
            departmentId
        ];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error occurred while creating post");
    }
};

export default createPostController;