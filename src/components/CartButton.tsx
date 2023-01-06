import CartButtonStyle from './CartButton.module.css';
import IDish from '../interfaces/DishInterface';

interface CartButtonInterface {
   cartItemsCounter: number,
   cartButtonClick(): void
};

//Button (div for the whole "button" area) that will show the modal (call cartButtonClick passed to it)
//and shows the current number of cart items
const CartButton = ({cartItemsCounter, cartButtonClick}: CartButtonInterface) => {
    return (
       <div onClick={cartButtonClick} className={CartButtonStyle.cart_button}>
         <img src={require('../media/cart_icon.png')} width="25px" height="25px" alt="cart icon"></img>
         <p>Your Cart</p>
         <div className={CartButtonStyle.cart_count}>
            <p>{cartItemsCounter}</p>
         </div>
       </div>
    );
};

export default CartButton;