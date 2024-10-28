/**
 * Кастомный клас, наследник Error, ...
 * для рассширенной реализации выброса исключений с нужными параметрами
 */
export class ExceptionForHandler extends Error {
    status;
    errors;

    constructor ({ message = 'Что-то пошло не так', status = 500, errors }) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
}
