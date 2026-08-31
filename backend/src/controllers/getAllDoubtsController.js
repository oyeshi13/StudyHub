import pool from "../config/db.js"

const getAllCoursesDoubts = (async (req,res)=>{
    const {student_id} = req.params
    try{
        const result = pool.query(
            `SELECT *
            FROM DOUBTS
            WHERE course_code IN (
            SELECT course_code
            FROM COURSES c
            WHERE c.dept_code IN(
            SELECT dept_code 
            FROM DEPT_GROUPS dp
            JOIN JOINED_GROUPS jg
            ON dp.group_id = jg.group_id
            WHERE jg.student_id = ${student_id}
            ))
            `
        )

        res.send(result.rows)


    }catch(err){
        console.log(err)
        res.status(500).send("couldn't get doubts")
    }
})

export default getAllCoursesDoubts