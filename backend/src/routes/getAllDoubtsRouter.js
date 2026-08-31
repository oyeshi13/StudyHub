import express from "express"
import getAllCoursesDoubts from "../controllers/getAllDoubtsController.js"

const getAllDoubtsRoute= express.Router()

getAllDoubtsRoute.get("/:student_id",getAllCoursesDoubts)

export default getAllDoubtsRoute