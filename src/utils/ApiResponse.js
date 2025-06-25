//This file is used to write a default response format for the API. It is used to send a consistent response format 
// for all API responses. This is useful to avoid repetitive code in the application and to provide a consistent response format across the application.
class ApiResponse{
    constructor(res, statusCode = 200, message = 'Success', ) {
        this.res = res;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    
        this.errors = errors;
    }
}
export {ApiResponse}

   