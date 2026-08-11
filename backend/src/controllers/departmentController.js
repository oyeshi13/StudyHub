import pool from "../config/db.js"

const getDepartments = (async (req,res)=>{
    try{
        const result = await pool.query("SELECT * FROM DEPARTMENTS")
        res.send(result.rows)
    }catch(err){
        console.log(err)
        res.status(500).send("Error occurred")
    }
})

export default getDepartments