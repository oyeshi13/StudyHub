import express from "express"
import dotenv from "dotenv"
import pool from "./config/db.js"

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())


app.get("/",(req,res)=>{
    res.send("Hello from backend")
})




app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})

