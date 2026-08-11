import pool from "../config/db.js"


const getMyGroups = (async(req,res)=>{
    try{
        const result = await pool.query(
            `SELECT * 
            FROM DEPT_GROUPS
            WHERE group_id IN (
                SELECT group_id 
                FROM JOINED_GROUPS
                WHERE student_id = 2405157
            )`
        )

        res.send(result.rows)
    }catch(err){
        console.log(err)
        res.status(500).send("Error occurred")
    }
})

export default getMyGroups