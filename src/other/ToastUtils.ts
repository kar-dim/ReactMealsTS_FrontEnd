// toast functions
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const defaultToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
};

// Show the toast based on its type (Error, Warn, Info, Success)
export const toastShow = (message: string, type: string) => {
    if (!type) 
        return;
    const normalizedType = type.toUpperCase();
    const toastTypeMap: Record<string, Function> = {
        E: toast.error,
        W: toast.warn,
        I: toast.info,
        S: toast.success,
    };
    const toastMethod = toastTypeMap[normalizedType];
    if (toastMethod)
        toastMethod(message, defaultToastOptions);
};
