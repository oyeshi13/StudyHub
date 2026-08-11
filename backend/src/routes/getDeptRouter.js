import express from "express"
//import { Router } from "express"
import getDeptFromDB from "../controllers/getDeptController.js"


const getDept = express.Router()

getDept.get("/:departmentId",getDeptFromDB)

export default getDept