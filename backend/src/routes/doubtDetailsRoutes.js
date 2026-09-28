import express from "express"
import { getDoubt, getAnswers, postAnswer } from "../controllers/doubtDetailsController.js"
import { requireRole } from "../middleware/authmiddleware.js"

const doubtDetailsRoute = express.Router()

doubtDetailsRoute.get("/:doubtId/answers", getAnswers)
doubtDetailsRoute.post("/:doubtId/answers", requireRole("student"), postAnswer)
doubtDetailsRoute.get("/:doubtId", getDoubt)

export default doubtDetailsRoute
