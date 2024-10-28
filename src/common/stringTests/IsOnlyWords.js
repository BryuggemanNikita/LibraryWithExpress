export const isOnlyWords = str => {
    for (const char of str) {
        const lower = char.toLowerCase();
        const upper = char.toUpperCase();
        if (lower === upper) return false;
    }
    return true;
};
