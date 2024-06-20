// exporting asynHandler
const asynHandler = (requestHandler) => { // ---Higher order function
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export default asynHandler;