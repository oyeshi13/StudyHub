import express from "express"
import { getDoubt, getAnswers, postAnswer } from "../controllers/doubtDetailsController.js"

const doubtDetailsRoute = express.Router()

doubtDetailsRoute.get("/:doubtId/answers", getAnswers)
doubtDetailsRoute.post("/:doubtId/answers", postAnswer)
doubtDetailsRoute.get("/:doubtId", getDoubt)

export default doubtDetailsRoute
