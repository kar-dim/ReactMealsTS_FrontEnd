import React, {useRef} from 'react';
import './CartModal.css';
import IDish from '../interfaces/DishInterface';
import CartDetails from './CartDetails';

interface ICartModal {
    cartItems : IDish[];
    showModal : boolean;
    setShowModal(show : boolean) : void;
    addItem(dish: IDish) : void;
    removeItem(dish: IDish) : void;
};

//TODO: hide if clicked OUTSIDE!

const CartModal = ({cartItems, showModal, setShowModal, addItem, removeItem} : ICartModal) => {
    let showModalClass = showModal ? "cart_modal cart_show_modal" : "cart_modal";
    return (
        <div className={showModalClass}>
            <div className="cart_modal_content">
                <span onClick={() => setShowModal(false)} className="cart_modal_close_button">&times;</span>
                <CartDetails cartItems={cartItems} closeModal={() => setShowModal(false)} addItem={addItem} removeItem={removeItem}/>
            </div>
        </div>
    );
};

export default CartModal;