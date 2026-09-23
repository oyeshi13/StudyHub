import express from "express";
import { verifyToken } from "../middleware/authmiddleware.js";
import { 
  reportComment, 
  getReportedComments, 
  deleteComment 
} from "../controllers/reportController.js";

const router = express.Router();

router.post("/comment/:commentId", verifyToken, reportComment);
router.get("/comments", verifyToken, getReportedComments);
router.delete("/comment/:commentId", verifyToken, deleteComment);

export default router;