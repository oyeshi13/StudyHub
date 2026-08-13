import express from "express"
import postDoubt from "../controllers/postDoubtController.js"

const postDoubtRoute = express.Router()

postDoubtRoute.post("/",postDoubt)

export default postDoubtRoute