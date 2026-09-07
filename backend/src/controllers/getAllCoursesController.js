import pool from "../config/db.js"

const getAllCourses = (async (req,res)=>{
    const {student_id} = req.params
    try{
        const result = await pool.query(
            `SELECT DISTINCT c.course_code, c.course_title,
                    c.course_title || ' ' || c.course_code AS course
             FROM COURSES c
             JOIN DEPT_GROUPS dg ON dg.dept_code = c.dept_code
             JOIN JOINED_GROUPS jg ON jg.group_id = dg.group_id
             WHERE jg.student_id = $1
             ORDER BY c.course_code`,
            [student_id]
        )

        res.send(result.rows)
    }catch(err){
        console.log(err)
        res.status(500).send("couldn't get courses");
    }
})

export default getAllCourses
