import jwt_decode from 'jwt-decode'

export function validateJWT() {
    let flag = false;
    localStorage.getItem("foody-user") ? flag=true : flag=false
    if (flag){
        const token = JSON.parse(localStorage.getItem("foody-user")).accessToken;

        let decodedToken = jwt_decode(token);
        let currentDate = new Date();

        if (decodedToken.exp * 1000 < currentDate.getTime()) {
            flag = false;
        }
    }
      
    return flag

}

export function getJWT() {
    if(!localStorage.getItem("foody-user")) return null;
    if (!JSON.parse(localStorage.getItem("foody-user")).accessToken) return null;
    const token = JSON.parse(localStorage.getItem("foody-user")).accessToken
    return token
}
