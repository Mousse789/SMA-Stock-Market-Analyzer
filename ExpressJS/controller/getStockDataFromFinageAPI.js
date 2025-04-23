import { FINAGE_API } from "../settings.js"
import axios from 'axios'
import 'dotenv/config'
import moment from 'moment'

export const getStockDataFromFinageAPI = (stockSymbol, date) =>{
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return { error: `Invalid date format. Please use YYYY-MM-DD.` }
    }

    const dayOfWeek = moment(date).format('dddd')
    if(moment(date).day()===0 || moment(date).day()===6){
        return {error: `The market is closed on the ${date}, which is a ${dayOfWeek}. Please try another date.`
    };
    }
    const finageStockEODHistoricalDataUrl = `https://api.finage.co.uk/history/stock/open-close?stock=${stockSymbol}&date=${date}&apikey=${FINAGE_API}`

    const stockEODData = axios.get(finageStockEODHistoricalDataUrl)
    .then(response => response.data)
    .catch(error => {
        console.log(error)
        return null
    })

    return stockEODData
}