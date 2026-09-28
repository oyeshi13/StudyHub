import express from "express"
import joinGroup from "../controllers/joinController.js"
import { requireRole } from "../middleware/authmiddleware.js"


const joinGroupRoute = express.Router()

joinGroupRoute.post("/:departmentId/:student_id", requireRole("student"), joinGroup)


export default joinGroupRoute