import express from "express"
import getMyGroups from "../controllers/groupController.js"


const groupRouter = express.Router()

groupRouter.get("/",getMyGroups)

export default groupRouter