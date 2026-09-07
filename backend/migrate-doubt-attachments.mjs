import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

await pool.query(`
  ALTER TABLE DOUBTS
  ADD COLUMN IF NOT EXISTS attachments JSONB NOT NULL DEFAULT '[]'::jsonb
`);
console.log("DOUBTS.attachments is ready");
await pool.end();
