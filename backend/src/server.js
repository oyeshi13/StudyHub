import express from "express"
import dotenv from "dotenv"
import pool from "./config/db.js"
import cors from "cors"

// Routes Import
import authRouter from "./routes/authRoutes.js"
import departmentRouter from "./routes/departmentRoutes.js"
import groupRouter from "./routes/groupRoutes.js"
import getPosts from "./routes/postsRouter.js"
import getDept from "./routes/getDeptRouter.js"
import getCourses from "./routes/coursesRoute.js"

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()


app.use(cors({
  origin: '*', 
  credentials: true
}));
app.use(express.json())


app.get("/", (req, res) => {
    res.send("Hello from backend")
})

// 🔴 AUTH ROUTE (এইটা নিশ্চিত করুন)
app.use("/api/auth", authRouter);

// Other Routes
app.use("/explore-departments", departmentRouter)
app.use("/groups", groupRouter)
app.use("/groups/posts", getPosts)
app.use("/dept", getDept)
app.use("/groups/courses", getCourses)


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})