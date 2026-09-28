import express from "express";
import { verifyToken, requireRole } from "../middleware/authmiddleware.js";
import { handleVote } from "../controllers/voteController.js";

const router = express.Router();

router.post("/:resourceId", verifyToken, requireRole("student"), handleVote);

export default router;