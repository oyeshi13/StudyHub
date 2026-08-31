import pool from "../config/db.js"

const getAllCourses = (async (req,res)=>{
    try{
        const result = await pool.query(
            `SELECT course_code, course_title, course_title || ' ' || course_code AS course
            FROM COURSES c
            WHERE c.dept_code IN(
            SELECT dept_code 
            FROM DEPT_GROUPS DG
            JOIN STUDENT S
            ON DG.GROUP_NAME = S.DEPARTMENT
            WHERE S.student_id = 2405157
            )`
        )

        res.send(result.rows)
    }catch(err){
        console.log(err)
        res.status(500).send("couldn't get courses");
    }
})

export default getAllCourses