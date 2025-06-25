//This file is used  to handle API errors in a consistent way across the application. It extends the built-in Error class to create a custom error type that includes a status code and a message. This allows for better error handling and response formatting in API endpoints.
//This is writen to avaoid repetitive code in the application and to provide a consistent error response format.
//In the app we can get api errors so to avoid the errors we write some code to handle the errors in a consistent way across the app
//so to avoid the repetitive code we write this file to handle the errors in a consistent way across the app
class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}