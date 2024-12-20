import fs from 'fs';

/**
 * Класс для реализации логирования, в частности ошибков
 */
export class Logger {
    /**
     * Статический метод класса для логирования ошибок
     * @param {*} err - ошибка
     * @param {*} dir_error - название файла с логами
     */
    static async loging (err, dir_error = 'error.log') {
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        const now = new Intl.DateTimeFormat('ru-RU', options).format(
            Date.now()
        );

        dir_error = `../errors/${dir_error}`;

        if (!fs.existsSync(dir_error)) {
            fs.open(dir_error, 'w', e => {});
        }

        fs.appendFile(dir_error, `${now} ${err.stack}\n`, e => {});
    }
}
