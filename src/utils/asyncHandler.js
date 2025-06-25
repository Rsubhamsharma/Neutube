//This file is used to handle async errors in Express routes whenever we use async and await We mostly use this in our react app and while talking with the database.
const asyncHandler = (fn)=>(req,res,next)=>{
    Promise.resolve(fn(req,res,next))
    .catch(next);
    return asyncHandler


}



export {asyncHandler};
//This function can also be writen with try and catch block like thid
// const asyncHandler = (fn) => {async (req,res,next)=>{
    //     try {        
        //         await fn(req,res,next);
        //     } catch (error) {
    //         next(error);
    //     }
// }
// This function takes an async function as an argument and returns a new function that handles any errors that occur during the execution of the async function. If an error occurs, it will be passed to the next middleware in the Express stack, allowing for centralized error handling. 
// This is useful in Express applications to avoid repetitive try-catch blocks in route handlers.
// Usage example:
// const express = require('express');
// const asyncHandler = require('./utils/asyncHandler');
// const app = express();

// app.get('/route', asyncHandler(async (req, res) => {
//     const data = await someAsyncOperation();     
//     res.json(data);
// }));
// this file can be writen in this way also but it is not recommended to use this way because it is not a good practice to use try and catch block in every route handler
//// const asyncHandler = (fn) => async (req, res, next) => {
    //     try {
        //         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }