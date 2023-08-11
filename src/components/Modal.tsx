import './Modal.css';
import { ReactNode } from 'react'

interface IModal {
    showModal : boolean;
    setShowModal() : void;
    children: ReactNode
    modalWidth: string
};

//TODO: hide if clicked OUTSIDE!
const Modal = (props: IModal) => {
    let showModalClass = props.showModal ? "cart_modal cart_show_modal" : "cart_modal";
    return (
        <div className={showModalClass}>
            <div className="cart_modal_content" style={{width : props.modalWidth}}>
                <span onClick={() => props.setShowModal()} className="cart_modal_close_button">&times;</span>
                {props.children}
            </div>
        </div>
    );
};

export default Modal;