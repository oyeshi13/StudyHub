import express from "express"
import postDoubt from "../controllers/postDoubtController.js"
import doubtUpload from "../middleware/doubtUploadMiddleware.js"

const postDoubtRoute = express.Router()

postDoubtRoute.post("/", doubtUpload.array("attachments", 5), postDoubt)

export default postDoubtRoute
