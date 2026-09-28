import express from "express";
import { verifyToken, requireRole } from "../middleware/authmiddleware.js";
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
router.post("/comment/:commentId", verifyToken, requireRole("student"), reportComment);
router.get("/comments", verifyToken, requireRole("admin"), getReportedComments);
router.delete("/comment/:commentId", verifyToken, requireRole("admin"), deleteComment);

// Resource report routes
router.post("/resource/:resourceId", verifyToken, requireRole("student"), reportResource);
router.get("/resources", verifyToken, requireRole("admin"), getReportedResources);
router.delete("/resource/:resourceId", verifyToken, requireRole("admin"), deleteResource);

export default router;