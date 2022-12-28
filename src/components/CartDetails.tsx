import IDish from '../interfaces/DishInterface';
import CartDetailsStyle from './CartDetails.module.css';
import {useCartContext} from '../contexts/cart-context';
import { toastShow } from '../ToastUtils';
import axios , {AxiosResponse, AxiosError} from 'axios';
import React, {useState} from 'react';

interface ICartDetails {
    closeModal() : void;
};

interface CartItemCounter extends IDish {
    count: number;
};

const CartDetails = ({closeModal} : ICartDetails) => {

    const [showOrderButton, setShowOrderButton] = useState<boolean>(true);

    const {cartItems, addCartItem, removeCartItem, clearCartItems} = useCartContext();
    //returns a "frequency object" which counts how many times each dish ID (that exists in cart) appears
    const cartItemsCountered : CartItemCounter[] = [...cartItems.reduce( (mp, o) => {
        if (!mp.has(o.id)) mp.set(o.id, { ...o, count: 0 });
        mp.get(o.id).count++;
        return mp;
    }, new Map()).values()];

    //order food -> send http POST
    const order = async() => {
        interface IOrderItem { dish_id: number, dish_counter: number };
        interface IOrderData  { order: IOrderItem[] };

        const orderData : IOrderData = {
            order: cartItemsCountered.map((cardItemC) => {
                return {dish_id: cardItemC.id, dish_counter: cardItemC.count}
            })
        };
        try {
            setShowOrderButton(false);
            const response : AxiosResponse = await axios.post('http://localhost:5179/api/Dishes/Order', orderData);
            toastShow('Your order is complete! Thanks', 'S');
            clearCartItems();
            closeModal();
        } catch (error : any) {
            toastShow('Could not order!', 'E');
             // check if the error was thrown from axios
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error(error.response.data);
                    console.error(error.response.status);
                    console.error(error.response.headers);
                }
            } else
                console.error(error);
        } finally {
            setShowOrderButton(true);
        }
    };

    //calculate total amount
    let calculatedTotalAmount : number = 0;
    for (var i = 0; i < cartItems.length; i++)
        calculatedTotalAmount += cartItems[i].price;
    calculatedTotalAmount = parseFloat(calculatedTotalAmount.toFixed(2));

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
                                            <span>{cartItemC.price.toFixed(2)}</span>
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
                    <h2>$ {calculatedTotalAmount.toFixed(2)}</h2>
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