import pool from "../config/db.js";

export const handleVote = async (req, res) => {
  const studentId = req.user.student_id;
  const { resourceId } = req.params;
  const { voteType } = req.body;

  if (!['UP', 'DOWN'].includes(voteType)) {
    return res.status(400).json({ error: "Invalid vote type" });
  }

  try {
    // Check if user already voted
    const existingVote = await pool.query(
      `SELECT * FROM VOTES WHERE student_id = $1 AND resource_id = $2;`,
      [studentId, resourceId]
    );

    let userVoteStatus = null;

    if (existingVote.rows.length > 0) {
      const currentVote = existingVote.rows[0].vote_type;

      if (currentVote === voteType) {
        // Cancel vote if clicked again
        await pool.query(
          `DELETE FROM VOTES WHERE student_id = $1 AND resource_id = $2;`,
          [studentId, resourceId]
        );
        userVoteStatus = null;
      } else {
        // Toggle vote direction
        await pool.query(
          `UPDATE VOTES SET vote_type = $1, voted_at = CURRENT_TIMESTAMP WHERE student_id = $2 AND resource_id = $3;`,
          [voteType, studentId, resourceId]
        );
        userVoteStatus = voteType.toLowerCase();
      }
    } else {
      // Insert new vote
      await pool.query(
        `INSERT INTO VOTES (student_id, resource_id, vote_type) VALUES ($1, $2, $3);`,
        [studentId, resourceId, voteType]
      );
      userVoteStatus = voteType.toLowerCase();
    }

    // Calculate total net votes
    const countResult = await pool.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN vote_type = 'UP' THEN 1 WHEN vote_type = 'DOWN' THEN -1 ELSE 0 END), 0) AS total_votes
       FROM VOTES WHERE resource_id = $1;`,
      [resourceId]
    );

    const totalVotes = parseInt(countResult.rows[0].total_votes, 10);

    return res.status(200).json({
      totalVotes,
      userVoteStatus
    });
  } catch (error) {
    console.error("Vote error:", error);
    return res.status(500).json({ error: "Database error while processing vote" });
  }
};