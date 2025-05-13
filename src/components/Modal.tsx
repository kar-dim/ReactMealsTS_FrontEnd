import '../styles/Modal.css';
import { useEffect, useRef, ReactNode } from 'react'

interface IModal {
    showModal : boolean;
    closeModal() : void;
    desiredWidth?: string;
    children: ReactNode
};

const Modal = (props: IModal) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node))
            props.closeModal();
    };

    useEffect(() => {
        if (props.showModal)
            document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [props.showModal, props.closeModal]);

    const showModalClass = props.showModal ? 'cart_modal cart_show_modal' : 'cart_modal';
    const modalWidth = props.desiredWidth == null ? null : props.desiredWidth;
    return (
        <div className={showModalClass}>
            <div className="cart_modal_content" ref={modalRef} style={modalWidth ? { width: modalWidth } : undefined}>
                <span onClick={props.closeModal} className="cart_modal_close_button">&times;</span>
                {props.children}
            </div>
        </div>
    );
};

export default Modal;