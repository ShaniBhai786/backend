import dotenv from 'dotenv';
import MONGODB_CONNECTION from './db/index.js'; 
import { app } from './app.js'

dotenv.config({
    path: './env'
})

MONGODB_CONNECTION();