'use strict'

const middleware = {
    logErrors: (err, req, res, next) => {
        console.error('ERROR', err.stack);
        next(err);
    },
    clientErrorHandler: (err, req, res, next) => {
        if (req.xhr) {
            res.status(500).send({ error: 'Something failed!' });
        } else {
            res.status(500).send({ error: 'Internal Error' });
        }
    },
};

export default middleware;