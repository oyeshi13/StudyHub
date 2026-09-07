import pool from "../config/db.js";
import bcrypt from "bcrypt";

// REGISTER (Only for Students)
const register = async (req, res) => {
    try {
        const { student_id, name, email, password, department } = req.body;

        if (!student_id || !name || !email || !password || !department) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const cleanEmail = email.trim().toLowerCase();

        // checking duplicate account 
        const existingStudent = await pool.query(
            "SELECT * FROM Student WHERE LOWER(email) = $1 OR student_id = $2",
            [cleanEmail, student_id]
        );

        if (existingStudent.rows.length > 0) {
            return res.status(400).json({ message: "Student ID or Email already exists!" });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // new student reg
        const newStudent = await pool.query(
            "INSERT INTO Student (student_id, name, email, password, department, is_approved) VALUES ($1, $2, $3, $4, $5, FALSE) RETURNING student_id, name, email, department, is_approved",
            [student_id, name, cleanEmail, hashedPassword, department]
        );

        return res.status(201).json({
            message: "Registration submitted successfully! Please wait for admin approval.",
            student: newStudent.rows[0]
        });

    } catch (err) {
        console.error("Register Error:", err.message);
        res.status(500).json({ error: "Server Error: " + err.message });
    }
};

// LOGIN (Handles both Admin & Student)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required!" });
        }

        const cleanEmail = email.trim().toLowerCase();

        // ১. Admin 
        const adminResult = await pool.query(
            "SELECT * FROM Admin WHERE LOWER(email) = $1", 
            [cleanEmail]
        );
        console.log("Found Admin Data:", adminResult.rows); 
        
        if (adminResult.rows.length > 0) {
            const admin = adminResult.rows[0];
            
            // checking non-hashed admin pass
            if (password !== admin.password) {
                return res.status(400).json({ message: "Invalid email or password!" });
            }

            return res.status(200).json({
                message: "Admin login successful!",
                role: "admin",
                user: {
                    admin_id: admin.admin_id,
                    name: admin.name,
                    email: admin.email,
                    department: admin.department
                }
            });
        }

        // ২. Student pass,mail,approval check
        const studentResult = await pool.query(
            "SELECT * FROM Student WHERE LOWER(email) = $1", 
            [cleanEmail]
        );
        
        if (studentResult.rows.length > 0) {
            const student = studentResult.rows[0];
            const isMatch = await bcrypt.compare(password, student.password);
            
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid email or password!" });
            }

            if (student.is_approved !== true) {
                return res.status(403).json({ 
                    message: "Account pending approval. Please wait for admin verification." 
                });
            }

            return res.status(200).json({
                message: "Student login successful!",
                role: "student",
                user: {
                    student_id: student.student_id,
                    name: student.name,
                    email: student.email,
                    department: student.department,
                    reputation_points: student.reputation_points
                }
            });
        }

        // if cant find user
        return res.status(400).json({ message: "Invalid email or password!" });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ error: "Server Error: " + err.message });
    }
};

// GET ALL PENDING STUDENTS
const getPendingStudents = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT student_id, name, email, department FROM Student WHERE is_approved = FALSE ORDER BY student_id ASC"
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching pending students:", err.message);
        res.status(500).json({ error: "Server Error: " + err.message });
    }
};

// APPROVE STUDENT
const approveStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "UPDATE Student SET is_approved = TRUE WHERE student_id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Student not found!" });
        }

        res.status(200).json({
            message: "Student approved successfully!",
            student: result.rows[0]
        });
    } catch (err) {
        console.error("Error approving student:", err.message);
        res.status(500).json({ error: "Server Error: " + err.message });
    }
};


export { register, login, getPendingStudents, approveStudent };