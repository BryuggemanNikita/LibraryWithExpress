/**
 * Проверка на наличие эл-та в объекте
 * @param {*} element - значение
 * @param {*} inEnum - объект
 * @returns boolean
 */
export const valueInObject = (element, inEnum) => {
    const arr = Object.values(inEnum);
    return arr.includes(element);
};
