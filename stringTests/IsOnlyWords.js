export function IsOnlyWords(str){
    return /^[a-zA-Zа-яА-Я]*$/.test(str);
}