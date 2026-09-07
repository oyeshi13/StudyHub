import express from "express";
import { register, login, getPendingStudents, approveStudent } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);


router.get("/pending-students", getPendingStudents);
router.put("/approve-student/:id", approveStudent);

export default router;