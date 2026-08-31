import express from "express"
import { Router } from "express"
import getAllDeptFromDB from "../controllers/getAllDeptController.js";

const getAllDept = express.Router()

getAllDept.get("/",getAllDeptFromDB)

export default getAllDept;