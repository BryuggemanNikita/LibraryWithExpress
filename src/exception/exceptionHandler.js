import { Logger } from '../logger/logger.js';

export const excaptionHandler = (err, req, res, next) => {
    const { message, errors } = err;
    const status = err.status ? err.status : 500;

    Logger.loging(err);
    console.error(`error: ${message}`);
    console.error(`method - ${req.method}, url - ..${req.url}`);

    if (!errors) {
        res.status(status).json({ message });
    } else {
        res.status(status).json({ message, errors });
    }

    next();
};
