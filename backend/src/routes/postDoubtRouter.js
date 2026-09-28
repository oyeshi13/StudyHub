import express from "express"
import postDoubt from "../controllers/postDoubtController.js"
import doubtUpload from "../middleware/doubtUploadMiddleware.js"
import { requireRole } from "../middleware/authmiddleware.js"

const postDoubtRoute = express.Router()

postDoubtRoute.post("/", requireRole("student"), doubtUpload.array("attachments", 5), postDoubt)

export default postDoubtRoute
