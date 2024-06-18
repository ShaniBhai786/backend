import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const port = process.env.PORT || 8080;
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));

app.use(express.json({
    extended: true,
    limit: "16kb",
}))

app.use(express.urlencoded())
app.use(express.static("public"))
app.use(cookieParser())

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})

export { app }