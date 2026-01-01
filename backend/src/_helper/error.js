class InvalidAttempt extends Error {
    constructor(message, title = "Invalid Attempt") {
        super(message);
        this.title = title;
    }
}

function errorHandler(res, error, func) {
    switch (error.constructor) {
        case InvalidAttempt:
            return {
                error: true,
                title: error.title,
                message: error.message
            }
        default:
            console.log('💥Uncaught Error Exeption:\n', error);
            return {
                error: true
            }
    }
}

module.exports = {
    errorHandler,
    InvalidAttempt,
};