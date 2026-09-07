import pool from "../config/db.js"

const getAllCoursesDoubts = (async (req,res)=>{
    const {student_id} = req.params
    try{
        const result = await pool.query(
            `SELECT DISTINCT d.*
             FROM DOUBTS d
             JOIN COURSES c ON c.course_code = d.course_code
             JOIN DEPT_GROUPS dg ON dg.dept_code = c.dept_code
             JOIN JOINED_GROUPS jg ON jg.group_id = dg.group_id
             WHERE jg.student_id = $1
             ORDER BY d.posted_at DESC`,
            [student_id]
        )

        res.send(result.rows)


    }catch(err){
        console.log(err)
        res.status(500).send("couldn't get doubts")
    }
})

export default getAllCoursesDoubts
