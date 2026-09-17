import express from "express";
import { verifyToken } from "../middleware/authmiddleware.js";
import { handleVote } from "../controllers/voteController.js";

const router = express.Router();

router.post("/:resourceId", verifyToken, handleVote);

export default router;