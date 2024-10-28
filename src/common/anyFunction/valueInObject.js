export const valueInObject = (element, inEnum) => {
    const arr = Object.values(inEnum);
    return arr.includes(element);
};
