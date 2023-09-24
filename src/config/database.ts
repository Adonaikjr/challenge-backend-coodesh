import { env } from '../env'
import { MongoClient } from 'mongodb'

const uri = env.DATABASE_URL
const MongoDB = new MongoClient(uri)

export default MongoDB
