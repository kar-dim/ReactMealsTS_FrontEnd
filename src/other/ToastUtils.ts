//toast functions
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

//show the (dark) toast based on its type (Error, Warn, Info, Success), will not execute if type is wrong
export const toastShow = (message : string, type : string) => {
    if (type !== null && type !== undefined)
    {
        type = type.toUpperCase();
        if (type === "E")
        {
            toast.error(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
        } else if (type === "W") {
            toast.warn(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
        } else if (type === "I") {
            toast.info(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
        } else if (type === "S") {
            toast.success(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
        }
    }
};
