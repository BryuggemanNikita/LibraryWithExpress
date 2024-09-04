export function IsOnlyWords (str) {
    if (Array.isArray(str)) {
        let flag = true;
        str.forEach(e => {
            if(!IsOnlyWords(e)) flag = false;
        });
        return flag;
    }

    return /^[a-zA-Zа-яА-Я]*$/.test(str);
}
