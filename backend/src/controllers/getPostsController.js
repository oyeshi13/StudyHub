import pool from "../config/db.js"

const getPostsController = (async (req,res)=>{
    try{

        const {departmentId, student_id} = req.params
        const query = student_id
            ? `SELECT DISTINCT r.*
               FROM RESOURCES r
               JOIN DEPT_GROUPS dg ON dg.dept_code = r.dept_code
               JOIN JOINED_GROUPS jg ON jg.group_id = dg.group_id
               WHERE jg.student_id = $1
               ORDER BY r.created_at DESC`
            : `SELECT * FROM RESOURCES WHERE dept_code = $1 ORDER BY created_at DESC`;
        const value = student_id || departmentId;
        const result = await pool.query(
            query,
            [value]
        )
        res.status(200).send(result.rows)
    }catch(err){
        console.log(err)
        res.status(500).send("Error occurred, Posts couldn't be fetched")
    }
})

export default getPostsController
