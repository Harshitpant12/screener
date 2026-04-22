import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import dns from "dns"

import { connectDB } from "./utils/db.js"
import errorHandler from "./middleware/errorHandler.js"
import authRoutes from "./routes/authRoutes.js"
import analysisRoutes from "./routes/analysisRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"

dns.setServers(["1.1.1.1", "8.8.8.8"])

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
app.use(cors({
    origin: 'https://skillsync-official.vercel.app',
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.get("/", (_, res) => {
    res.send("Welcome to the Screener API")
})

app.use('/api/auth/', authRoutes)
app.use('/api/analysis', analysisRoutes)
app.use('/api/admin', adminRoutes)

app.use(errorHandler)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`app is listening on : http://localhost:${PORT}`);
    })
}).catch((err) => {
    console.log("Error : ", err.message);
})

export default app;