import mongoose, { connect } from 'mongoose';
import {DB_NAME} from '../constants.js';

const connectDB = async () => {
    try {
        await connect(`${process.env.MONGO_DB_URL}/${DB_NAME}`);
        console.log(`Connected to MongoDB database: ${DB_NAME}`);   
    }
    catch(error){
        console.log(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit the process with failure       
    }
}
export default connectDB;