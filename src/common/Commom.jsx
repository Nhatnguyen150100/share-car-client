export const publicKey = 'pk.eyJ1Ijoibmt0b2FuMTkwNSIsImEiOiJjbGNnYjRwdWQwN25jM3FrYjR2cW0wdjBnIn0.Gmum4cSi-U6skWPEq4eQaA';

export const CURRENT_MONEY = 9700;

export const getDay = (day) =>{
    // let birthDate = ;
    let date = new Date(day).toISOString().substring(0,10);
    return date.split("-").reverse().join("-");
}

export const getTime = (day) =>{
    // let birthDate = ;
    let date = new Date(day).toISOString().substring(12,16);
    return date;
}

export const getAgeFromBirthDay = (dateString) => {
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export const forMatMoneyVND = (money) => {
    return money.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
}

