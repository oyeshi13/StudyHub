import pool from "../config/db.js";
import { withTransaction } from "../utils/withTransaction.js";

// bookmark toggle
export const toggleBookmark = async (req, res) => {
  const studentId = req.user.student_id;
  const { resourceId } = req.params;

  try {
    const bookmarked = await withTransaction(pool, async (client) => {
      await client.query("SELECT student_id FROM STUDENT WHERE student_id = $1 FOR UPDATE", [studentId]);
      const existing = await client.query(
        "SELECT 1 FROM BOOKMARKS WHERE student_id = $1 AND resource_id = $2",
        [studentId, resourceId]
      );
      if (existing.rows.length > 0) {
        await client.query("DELETE FROM BOOKMARKS WHERE student_id = $1 AND resource_id = $2", [studentId, resourceId]);
        return false;
      }
      await client.query("INSERT INTO BOOKMARKS (student_id, resource_id) VALUES ($1, $2)", [studentId, resourceId]);
      return true;
    });
    return res.status(bookmarked ? 201 : 200).json({
      bookmarked,
      message: bookmarked ? "Bookmark added" : "Bookmark removed"
    });
  } catch (error) {
    console.error("Toggle bookmark error:", error);
    return res.status(500).json({ error: "Database error while toggling bookmark" });
  }
};

// fetching mookmarked post
export const getBookmarkedPosts = async (req, res) => {
  const studentId = req.user.student_id;

  try {
    const query = `
      SELECT 
        r.resource_id,
        r.title,
        r.description,
        r.file_url,
        r.file_type,
        r.created_at,
        s.name AS author,
        d.dept_name AS group_name,
        b.bookmarked_at
      FROM BOOKMARKS b
      JOIN Resources r ON b.resource_id = r.resource_id
      JOIN Student s ON r.uploaded_by = s.student_id
      LEFT JOIN DEPARTMENTS d ON r.dept_code = d.dept_code
      WHERE b.student_id = $1
      ORDER BY b.bookmarked_at DESC;
    `;
    const result = await pool.query(query, [studentId]);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Fetch bookmarked posts error:", error);
    return res.status(500).json({ error: "Database error while fetching bookmarks" });
  }
};