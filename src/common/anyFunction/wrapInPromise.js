import { ExceptionForHandler } from '../exception/error.js';

export const wrapInPromise = (method, dataStore) => (query, options) =>
    new Promise(res => {
        const args = [query];
        if (options) args.push(options);
        dataStore[method](...args, (err, docs) => {
            if (err)
                throw new ExceptionForHandler({
                    message: 'Проблемы с бд',
                    status: 500
                });
            res(docs);
        });
    });
