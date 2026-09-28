import "dotenv/config";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const migrationPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "database", "checklist_features.sql");
const client = await pool.connect();

try {
  await client.query("BEGIN");
  await client.query(await readFile(migrationPath, "utf8"));
  await client.query("COMMIT");
  console.log("Checklist database features installed successfully.");
} catch (error) {
  await client.query("ROLLBACK").catch(() => {});
  console.error("Checklist database migration failed:", error.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}