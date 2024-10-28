import { validationResult } from 'express-validator';
import { ExceptionForHandler } from './error.js';

class ExceptionGenerator {
    testByValidator (request, message = 'Ошибка запроса') {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            throw new ExceptionForHandler({ message, status: 400, errors });
        }
    }
}

export const exceptionGenerator = new ExceptionGenerator();
