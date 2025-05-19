import { jwtDecode, JwtPayload } from "jwt-decode";
import axios from 'axios';
import { ApiRoutes, OtherRoutes, Settings } from "./PublicSettings";
import { IDish } from "../interfaces/DishInterfaces";

export const isLoggedAsAdmin = (jwtToken: string) => {
    const decodedAccessToken = jwtDecode<JwtPayload & { permissions: string[] }>(jwtToken);
    return decodedAccessToken && decodedAccessToken.hasOwnProperty("permissions") && decodedAccessToken.permissions.indexOf("admin:admin") !== -1
}

export const get = async <O>(url: string, token: string): Promise<O> =>
    (await axios.get<O>(`${Settings.backend_url}/${url}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const post = async <I, O>(url: string, obj: I, token: string): Promise<O> =>
    (await axios.post<O>(`${Settings.backend_url}/${url}`, obj, { headers: { Authorization: `Bearer ${token}` } })).data;

export const put = async <I, O>(url: string, obj: I, token: string): Promise<O> =>
    (await axios.put<O>(`${Settings.backend_url}/${url}`, obj, { headers: { Authorization: `Bearer ${token}` } })).data;

export const del = async <O>(url: string, token: string): Promise<O> =>
    (await axios.delete<O>(`${Settings.backend_url}/${url}`, { headers: { Authorization: `Bearer ${token}` } })).data;

export const getDishes = async (): Promise<IDish[]> => {
    try {
        return (await axios.get(`${Settings.backend_url}/${ApiRoutes.GetDishes}`)).data as IDish[];
    } catch (error) {
        console.error(error);
    }
    return [];
}

export const getDishImage = async (dishUrl: string): Promise<string> => {
    try {
        const { data } = await axios.get(`${Settings.backend_url}/${OtherRoutes.dishImages}/${dishUrl}`, { responseType: "arraybuffer" });
        //convert to base64
        return btoa(String.fromCharCode(...new Uint8Array(data)));
    } catch (error) {
        console.error(error);
    }
    return "";
};