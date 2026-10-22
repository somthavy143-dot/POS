import app from "./app.js";
import connectDB from "./configs/db.js";
import dotenv from 'dotenv'
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config()



connectDB()
const port = process.env.PORT
app.listen(port, () => {
    console.log(`server http://localhost:${port} is running 🔥!`)
})
