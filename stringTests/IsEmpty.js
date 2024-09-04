export function IsEmpty (str) {
    if (Array.isArray(str)) {
        let flag = false;
        str.forEach(e => {
            if (IsEmpty(e)) flag = true;
        });
        return flag;
    }
    return str.trim() === '';
}
