import express from "express"
import { Router } from "express"
import getPostsController from "../controllers/getPostsController.js"

const getPosts = express.Router()

getPosts.get("/:departmentId",getPostsController)

export default getPosts