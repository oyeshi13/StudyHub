import express from "express";
import { register, login, getPendingStudents, approveStudent } from "../controllers/authController.js";
import { verifyToken, requireRole } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);


router.get("/pending-students", verifyToken, requireRole("admin"), getPendingStudents);
router.put("/approve-student/:id", verifyToken, requireRole("admin"), approveStudent);

export default router;