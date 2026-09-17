import express from "express";
import { verifyToken } from "../middleware/authmiddleware.js";
import { toggleBookmark, getBookmarkedPosts } from "../controllers/bookmarkController.js";

const router = express.Router();

router.post("/toggle/:resourceId", verifyToken, toggleBookmark);
router.get("/my-bookmarks", verifyToken, getBookmarkedPosts);

export default router;