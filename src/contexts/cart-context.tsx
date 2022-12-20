import React from 'react';
import IDish from '../interfaces/DishInterface';
interface contextType {
    cartItems: IDish[],
    addCartItem(item : IDish) : void
};

const CartContext = React.createContext<contextType>({
    cartItems: [], 
    addCartItem(item) {}
  }
);

export default CartContext;