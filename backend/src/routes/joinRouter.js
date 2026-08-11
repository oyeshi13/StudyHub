import express from "express"
import joinGroup from "../controllers/joinController.js"


const joinGroupRoute = express.Router()

joinGroupRoute.post("/:departmentId",joinGroup)


export default joinGroupRoute