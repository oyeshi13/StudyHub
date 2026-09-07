import pool from "../config/db.js"


const getMyGroups = (async(req,res)=>{
    const {student_id} = req.params
    try{
        const result = await pool.query(
            `SELECT *
             FROM DEPT_GROUPS DG
             JOIN JOINED_GROUPS JG ON JG.group_id = DG.group_id
             JOIN DEPARTMENTS D ON D.dept_code = DG.dept_code
             WHERE JG.student_id = $1`,
            [student_id]
        )

        res.send(result.rows)
    }catch(err){
        console.log(err)
        res.status(500).send("Error occurred")
    }
})

export default getMyGroups
