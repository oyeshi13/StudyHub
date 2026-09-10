import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER (Only for Students)
const register = async (req, res) => {
    let client;
    try {
        const { student_id, name, email, password, department } = req.body;

        if (!student_id || !name || !email || !password || !department) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const cleanEmail = email.trim().toLowerCase();
        const cleanDepartment = department.trim();
        client = await pool.connect();
        await client.query("BEGIN");

        // checking duplicate account 
        const existingStudent = await pool.query(
            "SELECT * FROM Student WHERE LOWER(email) = $1 OR student_id = $2",
            [cleanEmail, student_id]
        );

        if (existingStudent.rows.length > 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({ message: "Student ID or Email already exists!" });
        }

        const departmentGroup = await client.query(
            `SELECT d.dept_name, dg.group_id
             FROM DEPARTMENTS d
             JOIN DEPT_GROUPS dg ON dg.dept_code = d.dept_code
             WHERE LOWER(TRIM(d.dept_name)) = LOWER(TRIM($1))`,
            [cleanDepartment]
        );

        if (departmentGroup.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({ message: "The selected department does not have a group." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newStudent = await client.query(
            "INSERT INTO Student (student_id, name, email, password, department, is_approved) VALUES ($1, $2, $3, $4, $5, FALSE) RETURNING student_id, name, email, department, is_approved",
            [student_id, name, cleanEmail, hashedPassword, departmentGroup.rows[0].dept_name]
        );

        await client.query(
            "INSERT INTO JOINED_GROUPS (student_id, group_id) VALUES ($1, $2)",
            [student_id, departmentGroup.rows[0].group_id]
        );
        await client.query("COMMIT");

        return res.status(201).json({
            message: "Registration submitted successfully! Please wait for admin approval.",
            student: newStudent.rows[0]
        });

    } catch (err) {
        if (client) await client.query("ROLLBACK").catch(() => {});
        console.error("Register Error:", err.message);
        res.status(500).json({ error: "Server Error: " + err.message });
    } finally {
        client?.release();
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

        // 1. Admin check (Plain-text comparison)
        const adminResult = await pool.query(
            "SELECT * FROM Admin WHERE LOWER(email) = $1", 
            [cleanEmail]
        );
        console.log("Found Admin Data:", adminResult.rows); 
        
        if (adminResult.rows.length > 0) {
            const admin = adminResult.rows[0];
            
            if (password !== admin.password) {
                return res.status(400).json({ message: "Invalid email or password!" });
            }

            // JWT token generation for Admin
            const token = jwt.sign(
                { 
                    id: admin.admin_id, 
                    role: "admin", 
                    email: admin.email 
                },
                process.env.JWT_SECRET || "studyhub_super_secret_jwt_key_2026",
                { expiresIn: "1d" }
            );

            return res.status(200).json({
                message: "Admin login successful!",
                token,
                role: "admin",
                user: {
                    admin_id: admin.admin_id,
                    name: admin.name,
                    email: admin.email,
                    department: admin.department
                }
            });
        }

        // 2. Student check (Bcrypt comparison)
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

            // JWT token generation for Student
            const token = jwt.sign(
                { 
                    student_id: student.student_id, 
                    role: "student", 
                    email: student.email 
                },
                process.env.JWT_SECRET || "studyhub_super_secret_jwt_key_2026",
                { expiresIn: "1d" }
            );

            return res.status(200).json({
                message: "Student login successful!",
                token,
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

        // User not found
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