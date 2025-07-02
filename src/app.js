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


//route declaration
import userrouter from './routes/User.routes.js'
import tweetrouter from './routes/tweet.routes.js'
import commentrouter from './routes/comment.routes.js'
import likerouter from './routes/like.routes.js'


app.use("/api/v1/users",userrouter)
app.use("/api/v1/tweet",tweetrouter)
app.use("/api/v1/comment",commentrouter)
app.use("/api/v1/like",likerouter)

export default app;