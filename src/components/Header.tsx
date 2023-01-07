import React, {useState} from 'react';
import CartButton from './CartButton';
import HeaderStyles from './Header.module.css';
import {useCartContext} from '../contexts/cart-context';
import CartModal from './CartModal';
import { toastShow } from '../other/ToastUtils';
import { Link } from "react-router-dom";

//renders the top header bar
const Header = ()  => {

    const [showModal, setShowModal] = useState<boolean>(false);
    const {cartItems} = useCartContext();

    //called from inside the modal (props), disables/enables the modal
    const showModalHandler = (showModal : boolean) => { setShowModal(showModal); }

    //click on the "cart" div
    const clickCartHandler = (): void => {
        if (cartItems !== null && cartItems.length > 0){
            setShowModal(true);
        } //else -> empty
        else {
            toastShow('Empty cart!', "E");
        }
    };

    return (
        <React.Fragment>
            <CartModal showModal={showModal} setShowModal={showModalHandler} />
            <div className={HeaderStyles.header_main}>
                <h1>Jimmys Foodzilla</h1>


                <Link to="/about">About!</Link>


                <CartButton cartItemsCounter = {cartItems.length} cartButtonClick={clickCartHandler} />
            </div>
            <img src={require("../media/bg.webp")} className={HeaderStyles.main_bg} alt="food background"></img>
            <div className={HeaderStyles.header_text}>
                <h1>Delicious Food, Delivered To You</h1>
                <p>Choose your favorite meal from our broad selection of available meals and enjoy a delicious lunch or dinner at home.</p>
                <p>All our meals are cooked with high-quality ingredients, just-in-time and of course by experienced chefs!</p>
            </div>
        </React.Fragment>
    );
};

export default Header;