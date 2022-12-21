import React, {useContext } from 'react';
import IDish from '../interfaces/DishInterface';

interface contextType {
    cartItems: IDish[],
    addCartItem(item : IDish) : void,
    removeCartItem(item : IDish) : void
};

export const CartContext = React.createContext<contextType>({
    cartItems: [], 
    addCartItem(item) {},
    removeCartItem(item) {}
  }
);

export const useCartContext = () => useContext(CartContext);