import pool from "../config/db.js";
import { withTransaction } from "../utils/withTransaction.js";

export const handleVote = async (req, res) => {
  const studentId = req.user.student_id;
  const { resourceId } = req.params;
  const { voteType } = req.body;

  if (!['UP', 'DOWN'].includes(voteType)) {
    return res.status(400).json({ error: "Invalid vote type" });
  }

  try {
    const outcome = await withTransaction(pool, async (client) => {
      const resource = await client.query(
        "SELECT resource_id FROM RESOURCES WHERE resource_id = $1 FOR UPDATE",
        [resourceId]
      );
      if (resource.rows.length === 0) return { missing: true };

      const existingVote = await client.query(
        "SELECT vote_type FROM VOTES WHERE student_id = $1 AND resource_id = $2",
        [studentId, resourceId]
      );
      let userVoteStatus = null;
      if (existingVote.rows.length > 0 && existingVote.rows[0].vote_type === voteType) {
        await client.query("DELETE FROM VOTES WHERE student_id = $1 AND resource_id = $2", [studentId, resourceId]);
      } else if (existingVote.rows.length > 0) {
        await client.query(
          "UPDATE VOTES SET vote_type = $1, voted_at = CURRENT_TIMESTAMP WHERE student_id = $2 AND resource_id = $3",
          [voteType, studentId, resourceId]
        );
        userVoteStatus = voteType.toLowerCase();
      } else {
        await client.query(
          "INSERT INTO VOTES (student_id, resource_id, vote_type) VALUES ($1, $2, $3)",
          [studentId, resourceId, voteType]
        );
        userVoteStatus = voteType.toLowerCase();
      }
      const score = await client.query("SELECT get_resource_vote_score($1) AS total_votes", [resourceId]);
      return { totalVotes: Number(score.rows[0].total_votes), userVoteStatus };
    });

    if (outcome.missing) return res.status(404).json({ error: "Resource not found" });

    return res.status(200).json({
      totalVotes: outcome.totalVotes,
      userVoteStatus: outcome.userVoteStatus
    });
  } catch (error) {
    console.error("Vote error:", error);
    return res.status(500).json({ error: "Database error while processing vote" });
  }
};