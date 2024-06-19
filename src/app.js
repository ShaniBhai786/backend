import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const port = 8080 || process.env.PORT;
const app = express() 

app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));

app.use(express.json({
    extended: true,
    limit: "16kb",
}))

app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())

import userRoute from './routes/users.routes.js'

app.use("/api/v1/users", userRoute);

app.listen(port, () => {
    console.log(`Server is listning on port : ${port}`);
})

export { app }