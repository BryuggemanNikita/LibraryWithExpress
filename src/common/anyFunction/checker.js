export const checker = (objCheck, isTrue) => {
    const arr = Object.values(objCheck);
    for (const element of arr) {
        if (!isTrue(element)) return false;
    }
    return true;
};
