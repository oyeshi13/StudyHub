import express from "express"
import getAllCourses from "../controllers/getAllCoursesController.js"

const getAllCoursesRoute = express.Router()

getAllCoursesRoute.get("/:student_id",getAllCourses)

export default getAllCoursesRoute