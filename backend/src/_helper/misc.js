const { errorHandler } = require("./error");

module.exports = {
    fn,
    toBoolean,
    direct
};

function fn() { }

function toBoolean(value) {
    if (typeof value == 'string') {
        return value.toLowerCase() !== 'false'
    }
    return !!value
}

function direct(func) {
    return (req, res, next) => {
        let info = {
            ...(req.files && { files: req.files }),
            ...(req.file && { file: req.file }),
            ...req.query,
            ...req.body,
            ...req.params,
        }

        func(info).then(({ status = 200, ...send } = {}) => {
            res.status(status).send(send);
            next();
        }).catch(error => errorHandler(res, error, func));
    }
}