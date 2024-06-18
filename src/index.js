import dotenv from 'dotenv';
import MONGODB_CONNECTION from './db/index.js'; 

dotenv.config({
    path: './env'
})

MONGODB_CONNECTION();