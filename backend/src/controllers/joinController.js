import pool from "../config/db.js"
import { withTransaction } from "../utils/withTransaction.js";


const joinGroup = (async (req,res)=>{
    
    try{
        const { departmentId } = req.params
        const studentId = req.user.student_id
        if (!Number.isInteger(Number(departmentId)) || !Number.isInteger(studentId)) {
            return res.status(400).json({ message: "A valid department is required." });
        }

        const result = await withTransaction(pool, async (client) => {
            const group = await client.query(
                "SELECT group_id FROM dept_groups WHERE dept_code = $1",
                [departmentId]
            );
            if (group.rows.length === 0) return { missing: true };

            const joined = await client.query(
                `INSERT INTO JOINED_GROUPS (student_id, group_id)
                 VALUES ($1, $2)
                 ON CONFLICT (student_id, group_id) DO NOTHING
                 RETURNING group_id`,
                [studentId, group.rows[0].group_id]
            );
            return { groupId: group.rows[0].group_id, joined: joined.rows.length > 0 };
        });

        if (result.missing) {
            return res.status(404).json({ message: "Department group not found." });
        }

        return res.status(result.joined ? 201 : 200).json({
            message: result.joined ? "Joined successfully." : "Already joined.",
            group_id: result.groupId
        });
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Couldn't join group" })
    }
})

export default joinGroup
