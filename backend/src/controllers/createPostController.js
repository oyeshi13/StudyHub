import pool from "../config/db.js";

const createPostController = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const { title, description } = req.body;
        
        const student_id = req.user?.student_id || req.user?.id;

        const file_url = req.file ? `/uploads/${req.file.filename}` : (req.body.file_url || 'N/A');
        const file_type = req.file ? req.file.mimetype : (req.body.file_type || 'Text');

        const query = `
            INSERT INTO Resources (title, description, file_url, file_type, uploaded_by, dept_code)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [
            title,
            description,
            file_url,
            file_type,
            student_id,
            departmentId
        ];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Create Post Error:", err);
        res.status(500).send("Error occurred while creating post");
    }
};

export default createPostController;