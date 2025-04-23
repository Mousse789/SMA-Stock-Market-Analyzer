import express from 'express'
import https from 'https'
import * as fs from 'fs'
import cors from 'cors'
import 'dotenv/config'
import { connectToDatabase } from "./database.js"
import stocks from "./routes/stocks.js"
import { getLoggerInstance } from './logger.js'


connectToDatabase()

const app = express()
const logger = getLoggerInstance()

const httpsOptions = {
    key: fs.readFileSync("./ssl/key.key"),
    cert: fs. readFileSync("./ssl/cert.pem"),
}

const server = https.createServer(httpsOptions, app)

app.use(cors());
app.use(express.json())
app.use('/usstock', stocks)

app.get('/alive', (req, res) =>{
    res.send("The server is up!")
})

server.listen(6060, () => {
    logger.info("PORT 6060 is Running!")
})
