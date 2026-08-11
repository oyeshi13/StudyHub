import pool from "../config/db.js"

const getPostsController = (async (req,res)=>{
    try{

        const {departmentId} = req.params
        const result = await pool.query(
            `SELECT *
            FROM RESOURCES
            WHERE dept_code = $1`,
            [departmentId]
        )
        res.status(200).send(result.rows)
    }catch(err){
        console.log(err)
        res.status(500).send("Error occurred, Posts couldn't be fetched")
    }
})

export default getPostsController