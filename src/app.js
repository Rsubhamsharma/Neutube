
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
app.use(express.json());
app.use(cors(
    {
        origin:process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials:true

    }
))
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
import userrouter from './routes/User.routes.js'

app.use("/api/v1/users",userrouter)

export default app;