import { validationResult } from 'express-validator';

class ExteptionErrors {
    errorsHendlingForValidator (request, response, message) {
        const errors = validationResult(request);
        return new Promise(res => {
            if (!errors.isEmpty()) {
                return response.status(400).json({ message, errors });
            }
            res();
        });
    }

    responseError (needBadTest, status, message, response) {
        return new Promise(res => {
            if (needBadTest) {
                return response.status(status).json({ message });
            }
            res();
        });
    }
}

export const handlingErrors = new ExteptionErrors();
