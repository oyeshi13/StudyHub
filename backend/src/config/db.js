import {Pool} from "pg"
import dotenv from "dotenv"

dotenv.config()

const pool = new Pool({
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    database : process.env.DB_NAME,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD
})

async function testConnection(){
    let result = await pool.query("SELECT NOW()")
    console.log(result.rows)
    
}




//console.log(testConnection())

testConnection()

export default pool