import express from "express"
import dotenv from "dotenv"
import pool from "./config/db.js"
import departmentRouter from "./routes/departmentRoutes.js"
import groupRouter from "./routes/groupRoutes.js"
import cors from "cors"

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

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})

