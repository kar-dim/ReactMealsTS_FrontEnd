import '../styles/Modal.scss';
import { useEffect, useRef, ReactNode } from 'react'

interface IModal {
    showModal: boolean;
    closeModal(): void;
    desiredWidth?: string;
    children: ReactNode
};

const Modal = ({ showModal, closeModal, desiredWidth, children }: IModal) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node))
                closeModal();
        };

        if (showModal)
            document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showModal, closeModal]);

    const showModalClass = showModal ? 'cart_modal cart_show_modal' : 'cart_modal';
    return (
        <div className={showModalClass}>
            <div className="cart_modal_content" ref={modalRef} style={{ ...(desiredWidth && { width: desiredWidth }) }}>
                <span onClick={closeModal} className="cart_modal_close_button">🗙</span>
                {children}
            </div>
        </div>
    );
};

export default Modal;