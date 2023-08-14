import jwtDecode, {JwtPayload } from "jwt-decode";

export const isLoggedAsAdmin = (jwtToken : string) => {
    const decodedAccessToken = jwtDecode<JwtPayload & { permissions : string[]}>(jwtToken);
    if (decodedAccessToken && decodedAccessToken.hasOwnProperty("permissions")) {
        const filteredArray = decodedAccessToken.permissions.filter(permission => permission === "admin:admin");
        return filteredArray !== undefined && filteredArray.length == 1;
    }
    return false;
} 