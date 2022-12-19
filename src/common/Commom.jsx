export const getDay = (day) =>{
    // let birthDate = ;
    let date = new Date(day).toISOString().substring(0,10);
    return date;
}

export const getTime = (day) =>{
    // let birthDate = ;
    let date = new Date(day).toISOString().substring(12,16);
    return date;
}