import express from "express"
import getDepartments from "../controllers/departmentController.js"


const departmentRouter = express.Router()

departmentRouter.get("/",getDepartments)

export default departmentRouter