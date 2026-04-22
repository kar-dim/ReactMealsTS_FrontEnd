// toast functions
import { toast, ToastOptions } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

type ToastFn = (message: string, options?: ToastOptions) => void;

const toastTypeMap: Record<string, ToastFn> = {
    E: toast.error,
    W: toast.warn,
    I: toast.info,
    S: toast.success
};

const defaultToastOptions: ToastOptions = {
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
    const toastMethod = toastTypeMap[type.toUpperCase()];
    if (toastMethod)
        toastMethod(message, defaultToastOptions);
};
