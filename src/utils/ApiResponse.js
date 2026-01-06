//This file is used to write a default response format for the API. It is used to send a consistent response format 
// for all API responses. This is useful to avoid repetitive code in the application and to provide a consistent response format across the application.
class ApiResponse{
    constructor( statusCode = 200,errors=[],data=null, message = 'Success', ) {
        
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode >= 200 && statusCode < 300; // success is true if the status code is between 200 and 299
    
        this.errors = errors;
    }
}
export {ApiResponse}

   