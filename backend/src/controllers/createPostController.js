import pool from "../config/db.js";

const createPostController = async (req, res) => {
    console.log("=== REQUEST HIT ===");
    console.log("Headers Content-Type:", req.headers['content-type']);
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    try {
        console.log("Body:", req.body);
    console.log("File:", req.file);
        const { departmentId } = req.params;
        const { title, description, student_id } = req.body;

        // Multer ফাইল আপলোড করলে req.file এ ডাটা থাকবে
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
        console.error(err);
        res.status(500).send("Error occurred while creating post");
    }
};

export default createPostController;