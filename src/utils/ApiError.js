// ApiErrors Utility
class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong !!!", 
        errors = [],
        statck = ""
    ){
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.statck = statck;

        if(statck) {
            this.statck = statck;
        }
        else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError }