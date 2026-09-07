import pool from "../config/db.js"


const joinGroup = (async (req,res)=>{
    
    try{
        const {departmentId,student_id} = req.params
        if (!Number.isInteger(Number(departmentId)) || !Number.isInteger(Number(student_id))) {
            return res.status(400).json({ message: "A valid department and student ID are required." });
        }

        const group = await pool.query(
            "SELECT group_id FROM dept_groups WHERE dept_code = $1",
            [departmentId]
        );
        if (group.rows.length === 0) {
            return res.status(404).json({ message: "Department group not found." });
        }

        const result = await pool.query(
            `INSERT INTO JOINED_GROUPS (student_id, group_id)
             SELECT $1, $2
             WHERE NOT EXISTS (
                 SELECT 1 FROM JOINED_GROUPS
                 WHERE student_id = $1 AND group_id = $2
             )
             RETURNING group_id`,
            [student_id, group.rows[0].group_id]
        )

        return res.status(result.rows.length > 0 ? 201 : 200).json({
            message: result.rows.length > 0 ? "Joined successfully." : "Already joined.",
            group_id: group.rows[0].group_id
        });
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Couldn't join group" })
    }
})

export default joinGroup
