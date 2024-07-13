import {jwtDecode, JwtPayload } from "jwt-decode";

export const isLoggedAsAdmin = (jwtToken : string) => {
    const decodedAccessToken = jwtDecode<JwtPayload & { permissions : string[]}>(jwtToken);
    return decodedAccessToken && decodedAccessToken.hasOwnProperty("permissions") && decodedAccessToken.permissions.indexOf("admin:admin") !== -1
} 