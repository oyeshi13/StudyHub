import express from "express";
import { createComment, getComments } from "../controllers/commentController.js";
import { verifyToken, requireRole } from "../middleware/authmiddleware.js";

const commentRouter = express.Router();

commentRouter.get("/:resourceId", getComments);
commentRouter.post("/:resourceId", verifyToken, requireRole("student"), createComment);

export default commentRouter;
