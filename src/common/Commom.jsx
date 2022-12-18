export const getDay = (day) =>{
    // let birthDate = ;
    let date = new Date(day).toISOString().substring(0,10);
    return date;
}