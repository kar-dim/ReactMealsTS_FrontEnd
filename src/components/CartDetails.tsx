import {IDish} from '../interfaces/DishInterfaces';
import CartDetailsStyle from '../styles/CartDetails.module.css';
import {useCartContext} from '../contexts/cart-context';
import { toastShow } from '../other/ToastUtils';
import {useState} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {ApiRoutes} from '../other/PublicSettings';
import { post } from '../other/utils';

interface CartItemCounter extends IDish {
    count: number;
};

interface IOrderItem { 
    dishid: number, 
    dish_counter: number
};

interface IOrderData  { 
    userId: string | null, 
    order: IOrderItem[] 
};

interface ICartDetails {
    closeModal() : void;
};

const CartDetails = ({closeModal} : ICartDetails) => {

    const { user, getAccessTokenSilently } = useAuth0();
    const [showOrderButton, setShowOrderButton] = useState<boolean>(true);
    const {cartItems, addCartItem, removeCartItem, clearCartItems} = useCartContext();
    
    //returns a "frequency object" which counts how many times each dish ID (that exists in cart) appears
    const cartItemsCountered : CartItemCounter[] = [...cartItems.reduce( (mp, o) => {
        if (!mp.has(o.dishId)) mp.set(o.dishId, { ...o, count: 0 });
        mp.get(o.dishId).count++;
        return mp;
    }, new Map()).values()];

    //order food (POST request)
    const order = async() => {
        const orderData : IOrderData = {
            userId : user == undefined ? null : user.sub == undefined ? null : user.sub,
            order: cartItemsCountered.map((cardItemC) => { return {dishid: cardItemC.dishId, dish_counter: cardItemC.count} })
        };
        //if empty card don't send request! Also close the modal
        if (orderData.order.length == 0){
            toastShow('Empty cart!', 'E');
            closeModal();
            return;
        }
        //send http POST request
        try {
            setShowOrderButton(false);
            post<IOrderData, any>(ApiRoutes.Order, orderData, await getAccessTokenSilently());
            toastShow('Your order is complete! Thanks', 'S');
            clearCartItems();
            closeModal();
        } catch (error : any) {
            toastShow('Could not order!', 'E');
            console.error(error);
        } finally {
            setShowOrderButton(true);
        }
    };
    const calculatedTotalAmount = cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);

    return (
        <div>
            <ul className={CartDetailsStyle.cart_details_ul}>
                {
                  cartItemsCountered.map((cartItemC : CartItemCounter, index : number) => {
                    return (<li key={index}>
                                <div className={CartDetailsStyle.cart_details_item}>
                                    <p>{cartItemC.dish_name}</p>
                                    <div className={CartDetailsStyle.cart_details_price}>
                                        <div className={CartDetailsStyle.cart_details_price_left}>
                                            <span>$ {cartItemC.price.toFixed(2)}</span>
                                            <div className={CartDetailsStyle.cart_details_counter_box}>
                                                <span>x {cartItemC.count}</span>
                                            </div>
                                        </div>
                                        <div className={CartDetailsStyle.cart_details_price_right}>
                                            <button onClick={() => removeCartItem(cartItemC)} className={CartDetailsStyle.cart_details_minus}>-</button>
                                            <button onClick={() => addCartItem(cartItemC)} className={CartDetailsStyle.cart_details_plus}>+</button>
                                        </div>
                                    </div>
                                    <hr></hr>
                                </div>
                        </li>);
                  })
                }
            </ul>

            <div className={CartDetailsStyle.cart_details_main}>
                <h2>Total Amount</h2>
                <div className={CartDetailsStyle.cart_details_main_right}>
                    <h2>$ {calculatedTotalAmount}</h2>
                    <div className={CartDetailsStyle.cart_details_main_right_buttons}>
                        <button onClick={closeModal} className={CartDetailsStyle.cart_details_button_close}>Close</button>
                        <button disabled={!showOrderButton} onClick={( () => order() )}className={CartDetailsStyle.cart_details_button_order}>Order</button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 

export default CartDetails;