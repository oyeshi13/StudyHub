import express from "express"
import joinGroup from "../controllers/joinController.js"


const joinGroupRoute = express.Router()

joinGroupRoute.post("/:departmentId/:student_id",joinGroup)


export default joinGroupRoute