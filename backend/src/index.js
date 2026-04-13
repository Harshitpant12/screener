import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"

import { connectDB } from "./utils/db.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001
app.use(cors()) // to be updated after frontend implementation

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth/', authRoutes) // not imported yet

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`app is listening on : http://localhost:${PORT}`);
    })
}).catch((err) => {
    console.log("Error : ", err.message);
})