export function IsEmptyStr (str) {
    if (Array.isArray(str)) {
        let flag = false;
        str.forEach(e => {
            if (IsEmptyStr(e)) flag = true;
        });
        return flag;
    }
    return str.trim() === '';
}
