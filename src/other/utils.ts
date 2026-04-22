import { jwtDecode, JwtPayload } from "jwt-decode";
import axios from 'axios';
import { ApiRoutes, OtherRoutes, Settings } from "./PublicSettings";
import { IDish } from "../interfaces/DishInterfaces";

export const isLoggedAsAdmin = (jwtToken: string): boolean => {
    const decodedAccessToken = jwtDecode<JwtPayload & { permissions?: string[] }>(jwtToken);
    return !!(decodedAccessToken && "permissions" in decodedAccessToken && decodedAccessToken.permissions?.includes("admin:admin"));
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

// returns a base64 string used by the admin panel
export const getDishImage = async (dishUrl: string): Promise<string> => {
    try {
        const { data } = await axios.get(`${Settings.backend_url}/${OtherRoutes.dishImages}/${dishUrl}`, { responseType: "arraybuffer" });
        const bytes = new Uint8Array(data as ArrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
    } catch (error) {
        console.error(error);
    }
    return "";
};

// returns a blob URL for display purposes, callers must revoke with URL.revokeObjectURL() on cleanup
export const getDishImageUrl = async (dishUrl: string): Promise<string> => {
    try {
        const { data } = await axios.get<Blob>(`${Settings.backend_url}/${OtherRoutes.dishImages}/${dishUrl}`, { responseType: "blob" });
        return URL.createObjectURL(data);
    } catch (error) {
        console.error(error);
    }
    return "";
};