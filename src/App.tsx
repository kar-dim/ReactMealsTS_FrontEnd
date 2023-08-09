import {Routes, Route } from "react-router-dom";
import Home from "./Home"
import About from './About'
import RouteErrorPage from './other/route_error';
import {useState} from 'react';
import {CartContext} from './contexts/cart-context';
import IDish from './interfaces/DishInterface';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useAuth0 } from "@auth0/auth0-react";
import Auth0LoadingPage from "./components/Auth0LoadingPage";

function App() {
    
    //initial state when page loads (read from local storage first)
    const checkLocalStorageCartItems = () :IDish[] => {
      var localStorageItems = localStorage.getItem('cartItems');
      //empty -> set empty array
      if (localStorageItems == null)
          return [];
      //else read the JSON array of dishes and return it
      var parsed : IDish[] = JSON.parse(localStorageItems);
      return parsed; //returns Object and not ICartItem[], BUT it works!
    };
  
    const [cartItems, setCartItems] = useState<IDish[]>(checkLocalStorageCartItems());
  
    //called from the CART MODAL ("+" BUTTONS) and in MainContent (ADD button on the main menu)
    const addItem = (dishToAdd : IDish): void => {
      //first add to localstorage
      var localStorageItems = localStorage.getItem('cartItems');
      let arr : IDish[] = [];
      //not empty, append dish to existing items
      if (localStorageItems !== null)
          arr = JSON.parse(localStorageItems);
      arr.push(dishToAdd);
      localStorage.setItem('cartItems', JSON.stringify(arr));
      //then set the state
      setCartItems((prev : IDish[]): IDish[] => {
        return [
          ...prev, dishToAdd
        ];
      });
    };
  
    //called from the CART MODAL ("-" BUTTON)
    const removeItem = (dishToRemove : IDish): void => {
        for (let i=0; i<cartItems.length; i++){
          if (cartItems[i].dishId === dishToRemove.dishId) {
            setCartItems((prev : IDish[]): IDish[] => {
              let arr : IDish[] = [...prev];
              arr.splice(i,1);
              //replace localstorage
              localStorage.setItem('cartItems', JSON.stringify(arr));
              return arr;
            });
            break;
          }
        }
    };
  
    const clearItems = (): void => {
      localStorage.removeItem('cartItems');
      setCartItems([]);
    };

    const { isLoading } = useAuth0();
    if (isLoading) {
      return (
        <Auth0LoadingPage />
      );
    }

  return (
    <CartContext.Provider value ={{cartItems: cartItems, addCartItem: addItem, removeCartItem: removeItem, clearCartItems: clearItems}}>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover={false} theme="dark"/>
        <Routes>
          <Route path="/" element = { <Home/> } />
          <Route path="about" element = { <About/> } />
          <Route path="*" element = { <RouteErrorPage/> } />
        </Routes>

    </CartContext.Provider>
  )
}

export default App;