// exporting asynHandler
export const asynHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).reject((err) => next(err))
    }
}