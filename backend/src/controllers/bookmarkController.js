import pool from "../config/db.js";

// ১. বুকমার্ক টগল (না থাকলে অ্যাড করবে, থাকলে ডিলিট করবে)
export const toggleBookmark = async (req, res) => {
  const studentId = req.user.student_id;
  const { resourceId } = req.params;

  try {
    const checkQuery = `SELECT * FROM BOOKMARKS WHERE student_id = $1 AND resource_id = $2;`;
    const checkResult = await pool.query(checkQuery, [studentId, resourceId]);

    if (checkResult.rows.length > 0) {
      await pool.query(`DELETE FROM BOOKMARKS WHERE student_id = $1 AND resource_id = $2;`, [studentId, resourceId]);
      return res.status(200).json({ bookmarked: false, message: "Bookmark removed" });
    } else {
      await pool.query(`INSERT INTO BOOKMARKS (student_id, resource_id) VALUES ($1, $2);`, [studentId, resourceId]);
      return res.status(201).json({ bookmarked: true, message: "Bookmark added" });
    }
  } catch (error) {
    console.error("Toggle bookmark error:", error);
    return res.status(500).json({ error: "Database error while toggling bookmark" });
  }
};

// ২. ইউজারের সমস্ত বুকমার্ক করা পোস্ট ফেচ করা
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