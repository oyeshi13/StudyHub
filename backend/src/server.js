import express from "express"
import dotenv from "dotenv"
import pool from "./config/db.js"
import departmentRouter from "./routes/departmentRoutes.js"
import groupRouter from "./routes/groupRoutes.js"
import cors from "cors"
import getPosts from "./routes/postsRouter.js"
import getDept from "./routes/getDeptRouter.js"
import getCourses from "./routes/coursesRoute.js"
import joinGroupRoute from "./routes/joinRouter.js"
import getAllCoursesRoute from "./routes/getAllCoursesRouter.js"
import getAllDoubtsRoute from "./routes/getAllDoubtsRouter.js"
import postDoubtRoute from "./routes/postDoubtRouter.js"

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

app.use(cors({
    origin : "http://localhost:5173"
}))
app.use(express.json())


app.get("/",(req,res)=>{
    res.send("Hello from backend")
})

app.use("/explore-departments",departmentRouter)

app.use("/groups",groupRouter)

app.use("/groups/posts",getPosts)

app.use("/dept",getDept)

app.use("/groups/courses",getCourses)

app.use("/join",joinGroupRoute)

app.use("/doubts/courses",getAllCoursesRoute)

app.use("/doubts/courses/getDoubts",getAllDoubtsRoute)

app.use("/doubts/post-doubt",postDoubtRoute)



app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})

