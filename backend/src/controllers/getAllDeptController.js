import pool from "../config/db.js"

const getAllDeptFromDB = (async (req,res)=>{
    try{
        const result = await pool.query(`
            SELECT DEPT_NAME
            FROM DEPARTMENTS
            `)
            res.send(result.rows)
    }catch(err){
        console.log(err);
        res.send("couldn't get depts")
    }
})

export default getAllDeptFromDB