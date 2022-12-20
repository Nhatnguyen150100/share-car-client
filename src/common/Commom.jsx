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