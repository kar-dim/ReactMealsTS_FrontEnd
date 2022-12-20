import React, {useEffect, useState} from 'react';
import './App.css';
import Header from './components/Header';
import MainContent from './components/MainContent';
import CartItemContext from './contexts/cart-context';
import IDish from './interfaces/DishInterface';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
function App() {

  //initial state when page loads (read from local storage first)
  const checkLocalStorageCartItems = () :IDish[] => {
    var localStorageItems = localStorage.getItem('cartItems');
    console.log(localStorageItems);
    //empty -> set empty array
    if (localStorageItems == null)
        return [];
    //else read the JSON array of dishes and return it
    var parsed : IDish[] = JSON.parse(localStorageItems);
    return parsed; //returns Object and not ICartItem[], BUT it works!

  };

  const [cartItems, setCartItems] = useState<IDish[]>(checkLocalStorageCartItems());

  const cartItemAdd = (itemToAdd : IDish) => {
    //first add to localstorage
    var localStorageItems = localStorage.getItem('cartItems');
    let arr : IDish[] = [];
    //not empty, append dish to existing items
    if (localStorageItems !== null)
        arr = JSON.parse(localStorageItems);
    arr.push(itemToAdd);
    localStorage.setItem('cartItems', JSON.stringify(arr));
    
    //then update state
    setCartItems([
      itemToAdd,
      ...cartItems,
    ]);
  };

  //these two are called from the CART MODAL ( "+" or "-" BUTTONS )
  const addItem = (dishToAdd : IDish): void => {
    setCartItems((prev : IDish[]): IDish[] => {
      return [
        ...prev, dishToAdd
      ];
    });
  };

  const removeItem = (dishToRemove : IDish): void => {
      for (var i=0; i<cartItems.length; i++){
        if (cartItems[i].id === dishToRemove.id){
          setCartItems((prev : IDish[]): IDish[] => {
            let arr : IDish[] = [...prev];
            arr.splice(i,1);
            return arr;
          });
          break;
        }
      }
  };

  return (
    <React.Fragment>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover={false} theme="dark"/>
      <Header cartItems={cartItems} addItem={addItem} removeItem={removeItem}/>
      <MainContent cartItemAdd={cartItemAdd}/>
    </React.Fragment>
  );
}

export default App;
