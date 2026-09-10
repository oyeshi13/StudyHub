import express from "express";
import upload from "../middleware/postUploadMiddleware.js";
import getPostsController from "../controllers/getPostsController.js";
import createPostController from "../controllers/createPostController.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const getPosts = express.Router();

getPosts.get("/student/:student_id", getPostsController);
getPosts.get("/:departmentId", getPostsController);

getPosts.post(
  "/:departmentId",
  verifyToken,
  (req, res, next) => {
    upload.single("attachment")(req, res, (err) => {
      if (err) {
        console.error("Multer Error:", err);
        return res.status(400).send(err.message);
      }
      next();
    });
  },
  createPostController
);

export default getPosts;