import React, {useContext } from 'react';
import IDish from '../interfaces/DishInterface';

interface contextType {
    cartItems: IDish[],
    addCartItem(item : IDish) : void,
    removeCartItem(item : IDish) : void,
    clearCartItems() : void
};

// the cart items context with addition and removal of cart items, shared among all the components of the application
export const CartContext = React.createContext<contextType>({
    cartItems: [], 
    addCartItem(item) {},
    removeCartItem(item) {},
    clearCartItems(){}
  }
);

export const useCartContext = () => useContext(CartContext);