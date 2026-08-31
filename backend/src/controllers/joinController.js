import pool from "../config/db.js"


const joinGroup = (async (req,res)=>{
    
    try{
        const {departmentId,student_id} = req.params
        console.log(departmentId)
        const result = await pool.query(
            `INSERT INTO JOINED_GROUPS VALUES(${student_id},(
            SELECT group_id
            FROM dept_groups
            WHERE dept_code = $1))`,[departmentId]
        )
        res.send("Joined successfully")
    }catch(err){
        console.log(err)
        res.send("Couldn't join group")
    }
})

export default joinGroup