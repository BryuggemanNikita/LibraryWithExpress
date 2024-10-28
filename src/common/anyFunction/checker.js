/**
 * Реализация проверки эл-ов объекта заданной функии
 * @param {*} objCheck - объект, эл-ты которого нужно проверить
 * @param {*} isTrue - функция, проверки эд-тов
 * @returns
 */
export const checker = (objCheck, isTrue) => {
    const arr = Object.values(objCheck);
    for (const element of arr) {
        if (!isTrue(element)) return false;
    }
    return true;
};
