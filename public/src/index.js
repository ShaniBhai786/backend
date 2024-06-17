import express from 'express';
import dotenv from 'dotenv';
import MONGODB_CONNECTION from './db/index.js'; 

dotenv.config({
    path: './env'
})

MONGODB_CONNECTION()

const port = process.env.PORT || 8080;
const app = express()

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})

