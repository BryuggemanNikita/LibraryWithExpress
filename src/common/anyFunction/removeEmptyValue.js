/**
 * Исключение значений undefined из объекта
 * @param {*} obj - объект
 */
export const removeEmptyValue = obj => {
    const keys = Object.keys(obj);
    keys.forEach(key => {
        if (!obj[key]) {
            delete obj[key];
        }
    });
};