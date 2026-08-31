import pool from "../config/db.js"


const getMyGroups = (async(req,res)=>{
    const {student_id} = req.params
    try{
        const result = await pool.query(
            `SELECT *
            FROM DEPT_GROUPS DG JOIN STUDENT S
            ON DG.GROUP_NAME = S.DEPARTMENT
            WHERE S.STUDENT_ID = ${student_id}
            `
        )

        res.send(result.rows)
    }catch(err){
        console.log(err)
        res.status(500).send("Error occurred")
    }
})

export default getMyGroups