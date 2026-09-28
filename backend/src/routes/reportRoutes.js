import express from "express";
import { verifyToken } from "../middleware/authmiddleware.js";
import { 
  reportComment, 
  getReportedComments, 
  deleteComment,
  reportResource,
  getReportedResources,
  deleteResource
} from "../controllers/reportController.js";

const router = express.Router();

// Comment report routes
router.post("/comment/:commentId", verifyToken, reportComment);
router.get("/comments", verifyToken, getReportedComments);
router.delete("/comment/:commentId", verifyToken, deleteComment);

// Resource report routes
router.post("/resource/:resourceId", verifyToken, reportResource);
router.get("/resources", verifyToken, getReportedResources);
router.delete("/resource/:resourceId", verifyToken, deleteResource);

export default router;