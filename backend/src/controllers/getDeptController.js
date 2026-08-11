import pool from "../config/db.js"

const getDeptFromDB = (async (req,res)=>{
    try{
        const {departmentId} = req.params
        console.log(departmentId)
        const result = await pool.query(`
            SELECT *
            FROM DEPARTMENTS
            WHERE dept_code = $1    
        `,[departmentId])
        res.send(result.rows)
    }catch(err){
        console.log(err)
        res.status(500).send("Couldn't get dept")
    }
})

export default getDeptFromDB