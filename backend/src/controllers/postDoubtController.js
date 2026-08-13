import pool from "../config/db.js"

const postDoubt = (async (req,res) => {
    try{
        const {course_code , title, description, author} = req.body
        const result = await pool.query(
            `INSERT INTO DOUBTS(title,description,course_code,author,solved) VALUES($1,$2,$3,$4,$5) `,
            [title,description,course_code,author,false]
        )

        res.send("posted doubt successfully")
    }catch(err){
        console.log(err)
        res.status(500).send("couldn't post")
    }
})

export default postDoubt