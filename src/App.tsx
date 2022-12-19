import React, {useEffect, useState} from 'react';
import './App.css';
import Header from './components/Header';
import MainContent from './components/MainContent';
import CartItemContext from './contexts/cart-context';
import ICartItem from './interfaces/CartItemInterface';

function App() {

  //initial state when page loads (read from local storage first)
  const checkLocalStorageCartItems = () :ICartItem[] => {
    var localStorageItems = localStorage.getItem('cartItems');
    console.log(localStorageItems);
    //empty -> set empty array
    if (localStorageItems == null)
        return [];
    //else read the JSON array of dishes and return it
    var parsed : ICartItem[] = JSON.parse(localStorageItems);
    return parsed; //returns Object and not ICartItem[], BUT it works!

  };

  const [cartItems, setCartItems] = useState<ICartItem[]>(checkLocalStorageCartItems());

  const cartItemAdd = (itemToAdd : ICartItem) => {
    setCartItems([
      itemToAdd,
      ...cartItems,
    ]);
  };

  return (
    <React.Fragment>
      <Header cartItems={cartItems}/>
      <MainContent cartItemAdd={cartItemAdd}/>
    </React.Fragment>
  );
}

export default App;
