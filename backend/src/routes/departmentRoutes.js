import express from "express"
import getDepartments from "../controllers/departmentController.js"


const departmentRouter = express.Router()

departmentRouter.get("/:student_id",getDepartments)

export default departmentRouter