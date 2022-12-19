import ICartItem from '../interfaces/CartItemInterface';
import CartDetailsStyle from './CartDetails.module.css';

interface ICartDetails {
    cartItems : ICartItem[];
    closeModal() : void;
};

const CartDetails = ({cartItems, closeModal} : ICartDetails) => {

    //returns a "frequency object" which counts how many times each dish ID appears
    const formatCartItems = () => {
        let counts : any = {}
        //todo..
        for (var i = 0, j = cartItems.length; i < j; i++) {
        if (counts[cartItems[i].id]) {
            counts[cartItems[i].id]++;
        }
        else {
            counts[cartItems[i].id] = 1;
        } 
        console.log(counts);
}
    };

    return (
        <div>
            <ul>
                {
                  cartItems.map((cartItem : ICartItem, index : number) => {
                    return <li key={index}>{cartItem.dish_name}</li>;
                  })
                }
            </ul>

            <div className={CartDetailsStyle.cart_details_main}>
                <h2>Total Amount</h2>
                <div className={CartDetailsStyle.cart_details_main_right}>
                    <h2>$ 59.99</h2>
                    <div>
                        <button className={CartDetailsStyle.cart_details_button_close}>Close</button>
                        <button className={CartDetailsStyle.cart_details_button_order}>Order</button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 

export default CartDetails;