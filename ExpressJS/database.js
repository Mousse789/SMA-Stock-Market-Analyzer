import {MongoClient} from 'mongodb'
import { MONGODB_NAME, MONGODB_USERNAME, MONGODB_PASSWORD } from "./settings.js"

const uri = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_NAME}.mongodb.net/`
let databaseClient

export async function connectToDatabase(){
    try{
        const client = new MongoClient(uri)
        await client.connect()
        databaseClient = client.db("us-stock-price")
        console.log('Database Connected Successfully')
    }
    catch(error){
        console.error(error)
    }
}

export function getUSStockPrice(){
    return databaseClient
}