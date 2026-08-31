import pool from "../config/db.js"

const getDepartments = (async (req,res)=>{
    try{
        const result = await pool.query(
            `SELECT *
            FROM DEPARTMENTS
            WHERE dept_code NOT IN(
            SELECT DG.dept_code
            FROM DEPT_GROUPS DG
            JOIN STUDENT S
            ON DG.GROUP_NAME = S.DEPARTMENT
            WHERE S.student_id = 2405157
            )
            `
        )
        res.send(result.rows)
    }catch(err){
        console.log(err)
        res.status(500).send("Error occurred")
    }
})

export default getDepartments