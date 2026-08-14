import pool from "../config/db.js"
import bcrypt from "bcrypt"

// register
const register = async (req, res) => {
    try {
        const { student_id, name, email, password, department } = req.body

        if (!student_id || !name || !email || !password || !department) {
            return res.status(400).json({ message: "All fields are required!" })
        }

       
        const userCheck = await pool.query(
            "SELECT * FROM student WHERE email = $1 OR student_id = $2", 
            [email, student_id]
        )
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: "Email or Student ID already registered!" })
        }

       
        const hashedPassword = await bcrypt.hash(password, 10)

        //new user insert
        const newUser = await pool.query(
            `INSERT INTO student (student_id, name, email, password, department) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING student_id, name, email, department, reputation_points`,
            [student_id, name, email, hashedPassword, department]
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

// LOGIN 
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required!" })
        }

        const userResult = await pool.query("SELECT * FROM student WHERE email = $1", [email])
        
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: "Invalid email or password!" })
        }

        const user = userResult.rows[0]

       
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password!" })
        }

        res.status(200).json({
            message: "Login successful!",
            student: {
                student_id: user.student_id,
                name: user.name,
                email: user.email,
                department: user.department,
                reputation_points: user.reputation_points
            }
        })
    } catch (err) {
        console.error("Login Error:", err.message)
        res.status(500).json({ error: "Server Error: " + err.message })
    }
}


export { register, login }