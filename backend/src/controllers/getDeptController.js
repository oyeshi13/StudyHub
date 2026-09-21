import pool from "../config/db.js"

const getDeptFromDB = (async (req,res)=>{
    try{
        const {departmentId} = req.params
        console.log(departmentId)
        const result = await pool.query(`
            SELECT d.*, dg.group_name
            FROM DEPARTMENTS d
            LEFT JOIN DEPT_GROUPS dg ON dg.dept_code = d.dept_code
            WHERE d.dept_code = $1
        `,[departmentId])
        res.send(result.rows)
    }catch(err){
        console.log(err)
        res.status(500).send("Couldn't get dept")
    }
})

export default getDeptFromDB