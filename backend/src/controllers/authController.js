import pool from "../config/db.js"
import bcrypt from "bcrypt"

const register = async (req, res) => {
    try {
        const { name, email, password, department } = req.body

        if (!name || !email || !password || !department) {
            return res.status(400).json({ message: "All fields are required!" })
        }

        // 🟢 "Student" এর বদলে সব ছোট হাতের student দিন
        const userCheck = await pool.query("SELECT * FROM student WHERE email = $1", [email])
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: "Email already registered!" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // 🟢 এখানেও student
        const newUser = await pool.query(
            `INSERT INTO student (name, email, password, department) 
             VALUES ($1, $2, $3, $4) 
             RETURNING student_id, name, email, department, reputation_points`,
            [name, email, hashedPassword, department]
        )

        res.status(201).json({
            message: "Student registered successfully!",
            student: newUser.rows[0]
        })
    } catch (err) {
        console.error("Registration Error:", err.message)
        res.status(500).json({ error: "Server Error: " + err.message })
    }
}

export default register