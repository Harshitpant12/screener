import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./lib/db.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001
app.use(cors()) // to be updated after frontend implementation

app.get('/', (req, res) => {
    res.send("Hello world!")
})

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`app is listening on : http://localhost:${PORT}`);
    })
}).catch((err) => {
    console.log("Error : ", err.message);
})