import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useCallback, useEffect, useMemo, useReducer } from 'react';
import { CartContext } from './contexts/cart-context';
import { IDish } from './interfaces/DishInterfaces';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useAuth0 } from "@auth0/auth0-react";
import Auth0LoadingPage from "./components/Auth0LoadingPage";
import RouteErrorPage from './other/RouteError';
import axios from "axios";

const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const AdminMenu = lazy(() => import('./components/AdminMenu'));

axios.defaults.timeout = 7000;
axios.defaults.headers.common['ngrok-skip-browser-warning'] = true;

const compareDishFn = (a: IDish, b: IDish) => a.dishId - b.dishId;

type CartAction =
  | { type: 'add'; dish: IDish }
  | { type: 'remove'; dish: IDish }
  | { type: 'clear' };

const cartReducer = (state: IDish[], action: CartAction): IDish[] => {
  switch (action.type) {
    case 'add':
      return [...state, action.dish].sort(compareDishFn);
    case 'remove': {
      const index = state.findIndex(dish => dish.dishId === action.dish.dishId);
      if (index === -1)
        return state;
      const next = [...state];
      next.splice(index, 1);
      return next;
    }
    case 'clear':
      return state.length === 0 ? state : [];
  }
};

const App = () => {
  const { isLoading } = useAuth0();
  //initial state read from localStorage once (lazy initializer)
  const [cartItems, dispatch] = useReducer(cartReducer, undefined, () =>
    JSON.parse(localStorage.getItem('cartItems') ?? '[]') as IDish[]
  );

  //keep localStorage in sync with the cart state
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  //stable action identities so consumers can safely list them in effect dependency arrays without re-running on every cart change
  const addCartItem = useCallback((dish: IDish) => dispatch({ type: 'add', dish }), []);
  const removeCartItem = useCallback((dish: IDish) => dispatch({ type: 'remove', dish }), []);
  const clearCartItems = useCallback(() => dispatch({ type: 'clear' }), []);

  //memoized! so consumers only re render when the cart actually changes
  const cartValue = useMemo(() => ({
    cartItems,
    addCartItem,
    removeCartItem,
    clearCartItems,
  }), [cartItems, addCartItem, removeCartItem, clearCartItems]);

  if (isLoading)
    return (<Auth0LoadingPage />);

  return (
    <CartContext.Provider value={cartValue}>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover={false} theme="dark" />
      <Suspense fallback={<Auth0LoadingPage />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="admin" element={<AdminMenu />} />
          <Route path="*" element={<RouteErrorPage errorText="PAGE NOT FOUND" errorDescription="The page you requested could not be found." />} />
        </Routes>
      </Suspense>
    </CartContext.Provider>
  )
}

export default App;
