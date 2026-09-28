import express from "express";
import { verifyToken, requireRole } from "../middleware/authmiddleware.js";
import { toggleBookmark, getBookmarkedPosts } from "../controllers/bookmarkController.js";

const router = express.Router();

router.post("/toggle/:resourceId", verifyToken, requireRole("student"), toggleBookmark);
router.get("/my-bookmarks", verifyToken, requireRole("student"), getBookmarkedPosts);

export default router;