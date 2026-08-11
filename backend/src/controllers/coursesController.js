import pool from "../config/db.js"

const getCoursesFromDB = (async (req,res)=>{
    try{
        const { departmentId} = req.params
        console.log(departmentId)
        const result = await pool.query(`
            SELECT course_title ||' ' || course_code AS course
            FROM COURSES
            WHERE dept_code = $1    
        `,[departmentId])
        res.send(result.rows)
    }catch(err){
        console.log(err)
        res.status(500).send("couldn't get courses")
    }
})


export default getCoursesFromDB