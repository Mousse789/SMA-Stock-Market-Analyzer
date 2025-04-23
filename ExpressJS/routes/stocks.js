import express from 'express'
import 'dotenv/config'
import { getLoggerInstance } from '../logger.js'
import { getUSStockPrice } from '../database.js'
import { getStockDataFromFinageAPI } from '../controller/getStockDataFromFinageAPI.js'

const stocks = express.Router()
const logger = getLoggerInstance('StockService')

stocks.get('/get-stock-data', async (req, res)=>{
    logger.info("Attempting to fetch default stock data...")
    const stockDatabase = getUSStockPrice()
    const stockData = await stockDatabase.collection('default_stocks').find().toArray()
    logger.info("Successfully fetched default stock data.")
    res.json(stockData)
})

stocks.post('/stock-data-overview', async(req, res)=>{
    logger.info(`Received request to post stock data overview for symbol: ${req.body.symbol} on date: ${req.body.date}`)
    console.log("Received Body", req.body)
    const {symbol, date} = req.body

    if(!symbol || !date){
        logger.error("Error: Stock symbol and date are required.")
        return res.status(400).send("Error: Stock symbol and date are required.")
    }

    const stockDataOverview = await getStockDataFromFinageAPI(symbol, date)

    if(stockDataOverview && stockDataOverview.error){
        logger.error("API Error: " + stockDataOverview.error)
        return res.status(400).json({error: stockDataOverview.error})
    }
    else if(stockDataOverview){
        const stockDatabase = getUSStockPrice()

        try{
            const stockSearchingHistory = stockDatabase.collection('stock_searching_history')
            const storeSearchingHistoryData = await stockSearchingHistory.insertOne(stockDataOverview)
            logger.info("Stored stock searching history data successfully.")
            console.log("Storing Stock Seaching History: ", storeSearchingHistoryData)
            res.json(stockDataOverview)
        }catch(error){
            logger.error("Failed to retrieve stock data from Finage API.")
            console.error("Error: Fail to insert data into the database", error)
            res.status(500).send("Error: Fail to save stock data to database")
        }
    }
    else{
        logger.error("Database or API call failed: " + error.message)
        res.status(500).send("Error retrieving stock data from Finage API.")
    }
})

stocks.post('/upward-trend-stocks', async(req, res) => {
    try {
        const stockDatabase = getUSStockPrice()
        const stockSearchingHistory = await stockDatabase.collection('stock_searching_history')
            .aggregate([
                {
                    $project: {
                        _id: 0,
                        symbol: 1,
                        date: "$from",
                        open: 1,
                        close: 1,
                        netChange: { $subtract: ["$close", "$open"] }
                    }
                },
                { $match: { netChange: { $gt: 0 } } }
            ]).toArray()

        console.log("Stock Searching History:", stockSearchingHistory)

        if (stockSearchingHistory.length === 0) {
            res.json({success: false, message: "No upward trend stocks found."})
        } else {
            const upwardTrendCollection = stockDatabase.collection('upward_trend_stocks')
            const promises = stockSearchingHistory.map(stock =>
                upwardTrendCollection.updateOne(
                    { symbol: stock.symbol, date: stock.date },
                    { $set: stock },
                    { upsert: true }
                )
            )
            const results = await Promise.all(promises)
            const insertedCount = results.filter(result => result.upsertedCount > 0).length
            console.log("Upserted Records:", insertedCount)
            res.json({success: true, message: `Upserted ${insertedCount} upward trend stocks successfully.`})
        }
    } catch (error) {
        console.error("Error accessing database:", error)
        res.status(500).send("Database access error occurred.")
    }
})

stocks.get('/list-stock-history', async (req, res) => {
    const stockDatabase = getUSStockPrice()
    try {
        const entries = await stockDatabase.collection('stock_searching_history')
                                           .find({}, { projection: { _id: 0, symbol: 1, from: 1, open: 1, close: 1} })
                                           .toArray()
        if (entries.length === 0) {
            res.status(404).json({ success: false, message: "No stock history entries found." })
        } else {
            res.json({ success: true, data: entries })
        }
    } catch (error) {
        console.error("Failed to fetch stock data:", error)
        res.status(500).send("Database operation failed.")
    }
})

stocks.delete('/delete-stock-history', async (req, res) => {
    const { symbol } = req.body
    if (!symbol) {
        return res.status(400).json({ error: "Symbol is required for deletion." })
    }

    const stockDatabase = getUSStockPrice()
    try {
        let query = { symbol: symbol }

        const result = await stockDatabase.collection('stock_searching_history').deleteMany(query)
        if (result.deletedCount === 0) {
            res.status(404).json({ success: false, message: "No records found with the specified symbol." })
        } else {
            res.json({ success: true, message: `Deleted ${result.deletedCount} records successfully.` })
        }
    } catch (error) {
        console.error("Failed to delete stock data:", error)
        res.status(500).send("Database operation failed.")
    
    }
})

export default stocks