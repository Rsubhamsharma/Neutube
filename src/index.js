
import connectDB from './db/index.js';
import { configDotenv } from 'dotenv';
import app from './app.js';
configDotenv();

connectDB().then(()=>{
    app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
})
}).catch((err )=> {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit the process if the database connection fails
    
})