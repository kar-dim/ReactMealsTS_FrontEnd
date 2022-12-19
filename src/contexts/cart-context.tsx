import React from 'react';
import CartInterface from '../interfaces/CartItemInterface';
interface contextType {
    cartItems: CartInterface[],
    addCartItem(item : CartInterface) : void
};

const CartContext = React.createContext<contextType>({
    cartItems: [], 
    addCartItem(item) {}
  }
);

export default CartContext;