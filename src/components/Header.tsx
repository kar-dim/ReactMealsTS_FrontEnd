import React, {useState} from 'react';
import CartButton from './CartButton';
import HeaderStyles from './Header.module.css';
import IDish from '../interfaces/DishInterface';
import CartModal from './CartModal';
import { toastShow } from '../ToastUtils';

interface HeaderInterface {
    cartItems: IDish[];
    addItem(dish: IDish) : void;
    removeItem(dish: IDish) : void;
}
const Header = ({cartItems, addItem, removeItem} : HeaderInterface) => {

    const [showModal, setShowModal] = useState<boolean>(false);

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
            <CartModal cartItems={cartItems} showModal={showModal} setShowModal={showModalHandler} addItem={addItem} removeItem={removeItem} />
            <div className={HeaderStyles.header_main}>
                <h1>Jimmys Foodzilla</h1>
                <CartButton cartItems = {cartItems} cartButtonClick={clickCartHandler} />
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