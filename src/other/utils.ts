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

// Module level cache of dishUrl -> blob URL so the same image is fetched only once
// per session (avoids the N+1 refetch when components remount). URLs intentionally
// live for the whole session, so callers must NOT revoke them.
const imageUrlCache = new Map<string, string>();

// returns a blob URL for an <img src>, shared by the main menu and the admin panel
export const getDishImageUrl = async (dishUrl: string): Promise<string> => {
    const cached = imageUrlCache.get(dishUrl);
    if (cached)
        return cached;
    try {
        const { data } = await axios.get<Blob>(`${Settings.backend_url}/${OtherRoutes.dishImages}/${dishUrl}`, { responseType: "blob" });
        const url = URL.createObjectURL(data);
        imageUrlCache.set(dishUrl, url);
        return url;
    } catch (error) {
        console.error(error);
    }
    return "";
};