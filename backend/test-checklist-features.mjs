import "dotenv/config";
import assert from "node:assert/strict";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const client = await pool.connect();
let transactionOpen = false;

try {
  await client.query("BEGIN");
  transactionOpen = true;

  const department = await client.query(`
    SELECT d.dept_code, d.dept_name
    FROM DEPARTMENTS d
    JOIN DEPT_GROUPS g ON g.dept_code = d.dept_code
    ORDER BY d.dept_code
    LIMIT 1`);
  assert.ok(department.rows.length, "a department group is required for the procedure test");

  const studentId = 1_000_000_000 + Math.floor(Math.random() * 1_000_000_000);
  await client.query(
    "CALL enroll_new_student($1, $2, $3, $4, $5)",
    [studentId, "Checklist Smoke Test", `checklist-${studentId}@example.invalid`, "test-hash", department.rows[0].dept_name]
  );

  const membership = await client.query(
    "SELECT COUNT(*)::int AS count FROM JOINED_GROUPS WHERE student_id = $1",
    [studentId]
  );
  assert.equal(membership.rows[0].count, 1, "the procedure should enroll the new student");

  const resource = await client.query(
    `INSERT INTO RESOURCES (title, file_url, file_type, uploaded_by, dept_code)
     VALUES ('Checklist smoke test', '/test', 'Text', $1, $2)
     RETURNING resource_id`,
    [studentId, department.rows[0].dept_code]
  );
  const resourceId = resource.rows[0].resource_id;

  await client.query(
    "INSERT INTO VOTES (student_id, resource_id, vote_type) VALUES ($1, $2, 'UP')",
    [studentId, resourceId]
  );
  let score = await client.query("SELECT get_resource_vote_score($1) AS score", [resourceId]);
  assert.equal(score.rows[0].score, 1, "the vote function should count an upvote");

  await client.query(
    "UPDATE VOTES SET vote_type = 'DOWN' WHERE student_id = $1 AND resource_id = $2",
    [studentId, resourceId]
  );
  score = await client.query("SELECT get_resource_vote_score($1) AS score", [resourceId]);
  assert.equal(score.rows[0].score, -1, "the vote function should count a downvote");

  await client.query("SAVEPOINT invalid_vote_check");
  await assert.rejects(
    client.query(
      "UPDATE VOTES SET vote_type = 'SIDEWAYS' WHERE student_id = $1 AND resource_id = $2",
      [studentId, resourceId]
    ),
    "the validation trigger should reject unsupported vote types"
  );
  await client.query("ROLLBACK TO SAVEPOINT invalid_vote_check");

  await client.query("DELETE FROM VOTES WHERE student_id = $1 AND resource_id = $2", [studentId, resourceId]);
  const scoreAfterDelete = await client.query("SELECT get_resource_vote_score($1) AS score", [resourceId]);
  assert.equal(scoreAfterDelete.rows[0].score, 0, "the vote function should return zero after the last vote is removed");

  const audit = await client.query(
    "SELECT COUNT(*)::int AS count FROM VOTE_AUDIT WHERE actor_student_id = $1 AND resource_id = $2",
    [studentId, resourceId]
  );
  assert.equal(audit.rows[0].count, 3, "the audit trigger should record inserts, updates, and removals");

  await client.query("ROLLBACK");
  transactionOpen = false;
  console.log("Checklist database smoke test passed; all test data was rolled back.");
} catch (error) {
  if (transactionOpen) await client.query("ROLLBACK").catch(() => {});
  console.error("Checklist database smoke test failed:", error.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}