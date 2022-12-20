import CartButtonStyle from './CartButton.module.css';
import IDish from '../interfaces/DishInterface';
interface CartButtonInterface {
   cartItems: IDish[],
   cartButtonClick(): void
};

const CartButton = ({cartItems, cartButtonClick}: CartButtonInterface) => {
    return (
       <div onClick={cartButtonClick} className={CartButtonStyle.cart_button}>
         <img src={require('../media/cart_icon.png')} width="25px" height="25px" alt="cart icon"></img>
         <p>Your Cart</p>
         <div className={CartButtonStyle.cart_count}>
            <p>{cartItems.length}</p>
         </div>
       </div>
    );
};

export default CartButton;