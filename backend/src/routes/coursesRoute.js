import express from "express"
import getCoursesFromDB from "../controllers/coursesController.js"

const getCourses = express.Router()

getCourses.get("/:departmentId",getCoursesFromDB)

export default  getCourses