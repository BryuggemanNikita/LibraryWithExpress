import { Logger } from '../common/logger/logger.js';

export const handlerForCustomException = (err, req, res, next) => {
    const { message, errors } = err;
    const status = err.status ? err.status : 500;

    Logger.loging(err);
    console.error(`error: ${message}`);
    console.error(`method - ${req.method}, url - ..${req.url}`);

    const args = !errors ? { message } : { message, errors };

    res.status(status).json({ ...args });

    next();
};
