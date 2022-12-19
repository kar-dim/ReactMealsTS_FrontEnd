import React, {useRef} from 'react';
import './CartModal.css';
import ICartItem from '../interfaces/CartItemInterface';
import CartDetails from './CartDetails';

interface ICartModal {
    cartItems : ICartItem[];
    showModal : boolean;
    setShowModal(show : boolean) : void;
};

//TODO: hide if clicked OUTSIDE!

const CartModal = ({cartItems, showModal, setShowModal} : ICartModal) => {
    let showModalClass = showModal ? "cart_modal cart_show_modal" : "cart_modal";
    return (
        <div className={showModalClass}>
            <div className="cart_modal_content">
                <span onClick={() => setShowModal(false)} className="cart_modal_close_button">&times;</span>
                <CartDetails cartItems={cartItems} closeModal={() => setShowModal(false)}/>
            </div>
        </div>
    );
};

export default CartModal;