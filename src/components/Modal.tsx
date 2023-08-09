import './Modal.css';
import { ReactNode } from 'react'

interface IModal {
    showModal : boolean;
    setShowModal(show : boolean) : void;
    children: ReactNode
};

//TODO: hide if clicked OUTSIDE!
const CartModal = (props: IModal) => {
    let showModalClass = props.showModal ? "cart_modal cart_show_modal" : "cart_modal";
    return (
        <div className={showModalClass}>
            <div className="cart_modal_content">
                <span onClick={() => props.setShowModal(false)} className="cart_modal_close_button">&times;</span>
                {props.children}
            </div>
        </div>
    );
};

export default CartModal;