import express from "express";
import getMyGroups from "../controllers/groupController.js";
import getPostsController from "../controllers/getPostsController.js";
import createPostController from "../controllers/createPostController.js";

const groupRouter = express.Router();

groupRouter.get("/:student_id", getMyGroups);


export default groupRouter;