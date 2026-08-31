import express from "express"
import getMyGroups from "../controllers/groupController.js"


const groupRouter = express.Router()

groupRouter.get(`/:student_id`,getMyGroups)

export default groupRouter