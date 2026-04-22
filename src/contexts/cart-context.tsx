import { createContext, useContext } from 'react';
import { IDish } from '../interfaces/DishInterfaces';

interface contextType {
  cartItems: IDish[],
  addCartItem(item: IDish): void,
  removeCartItem(item: IDish): void,
  clearCartItems(): void
};

// the cart items context with addition and removal of cart items, shared among all the components of the application
export const CartContext = createContext<contextType>({
  cartItems: [],
  addCartItem(_item) { },
  removeCartItem(_item) { },
  clearCartItems() { }
}
);

export const useCartContext = () => useContext(CartContext);