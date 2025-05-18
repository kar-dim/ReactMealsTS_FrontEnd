import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import AdminMenu from "./components/AdminMenu";
import RouteErrorPage from './other/RouteError';
import { useState } from 'react';
import { CartContext } from './contexts/cart-context';
import { IDish } from './interfaces/DishInterfaces';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useAuth0 } from "@auth0/auth0-react";
import Auth0LoadingPage from "./components/Auth0LoadingPage";
import axios from "axios";

const compareDishFn = (a: IDish, b: IDish) => a.dishId - b.dishId;

const App = () => {
  const { isLoading } = useAuth0();
  //initial state when page loads
  const [cartItems, setCartItems] = useState<IDish[]>(JSON.parse(localStorage.getItem('cartItems') ?? '[]'));

  //saves cart items to localStorage and react state
  const setCart = (cart: IDish[]) => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
    setCartItems(cart);
  }

  //called from the CART MODAL ("+" BUTTONS) and in MainContent (ADD button on the main menu)
  const addItem = (dishToAdd: IDish): void => {
    const cartWithNewItem: IDish[] = [...JSON.parse(localStorage.getItem('cartItems') ?? '[]'), dishToAdd].sort(compareDishFn);
    setCart(cartWithNewItem);
  };

  //called from the CART MODAL ("-" BUTTON)
  const removeItem = (dishToRemove: IDish): void => {
    let cart: IDish[] = JSON.parse(localStorage.getItem('cartItems') ?? '[]');
    cart.splice(cart.findIndex(dish => dish.dishId === dishToRemove.dishId), 1);
    setCart(cart);
  };

  //called when an order is finished, clears the cart
  const clearItems = (): void => setCart([]);

  if (isLoading)
    return (<Auth0LoadingPage />);

  //global axios stuff
  axios.defaults.timeout = 7000;
  axios.defaults.headers.common['ngrok-skip-browser-warning'] = true;

  return (
    <CartContext.Provider value={{ cartItems: cartItems, addCartItem: addItem, removeCartItem: removeItem, clearCartItems: clearItems }}>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover={false} theme="dark" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="admin" element={<AdminMenu />} />
        <Route path="*" element={<RouteErrorPage errorText="PAGE NOT FOUND" errorDescription="The page you requested could not be found." />} />
      </Routes>
    </CartContext.Provider>
  )
}

export default App;