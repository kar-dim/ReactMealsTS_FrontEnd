import {useEffect, useState} from 'react';
import CartButton from './CartButton';
import HeaderStyles from '../styles/Header.module.css';
import {useCartContext} from '../contexts/cart-context';
import Modal from './Modal';
import { toastShow } from '../other/ToastUtils';
import { Link } from 'react-router-dom';
import imgBg from '../media/bg.webp';
import Auth0SignInOffButton from './Auth0SignInOffButton';
import { useAuth0 } from '@auth0/auth0-react';
import {Settings} from '../other/PublicSettings';
import CartDetails from './CartDetails';
import OrderDetails from './OrderDetails';
import { isLoggedAsAdmin } from '../other/utils';

//renders the top header bar
const Header = ()  => {

    //states
    const {getIdTokenClaims, isAuthenticated, getAccessTokenSilently} = useAuth0();
    const [userLoggedIn, setUserLoggedIn] = useState<IAuth0User | undefined>(undefined);
    const {cartItems, clearCartItems} = useCartContext();
    const [showCartModal, setShowCartModal] = useState<boolean>(false); //new order modal
    const [showMyOrdersModal, setShowMyOrdersModal] = useState<boolean>(false); //user (completed) orders modal
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    //methods
    const verifyAdminAccess = async() => setIsAdmin(isLoggedAsAdmin(await getAccessTokenSilently()));
    const loadUserProfileFromClaims = async() => {
        let claims = await getIdTokenClaims();
        if (claims == undefined)
            return;
        setUserLoggedIn({
            name: claims[`${Settings.auth0_audience}/user_metadata.name`],
            last_name: claims[`${Settings.auth0_audience}/user_metadata.last_name`],
            email: claims[`email`] ?? "",
            address: claims[`${Settings.auth0_audience}/user_metadata.address`],
        });
    }
    const checkTokenValidity = async (): Promise<boolean> => {
        try {
            await getAccessTokenSilently();
            return true;
        } catch (e) {
            return false;
        }
    };

    //get the IdToken Claims, which contain the user's metadata (user NAME/LASTNAME/ADDRESS), these are added
    //in the idToken in Auth0 dashboard -> onPostLogin AUTH0 ACTION
    //also check if the user is admin by decoding the access token and checking the "admin:admin" permission (was setup from auth0 dashboard directly)
    useEffect(() => {
        const run = async () => {
            if (isAuthenticated && await checkTokenValidity()) {
                loadUserProfileFromClaims();
                verifyAdminAccess();
                return;
            }
            clearCartItems();
            setUserLoggedIn(undefined);
            setIsAdmin(false);
        }

        run();  
    }, [isAuthenticated]);

    //click on the "cart" div
    const clickCartHandler = (): void => {
        if (!isAuthenticated){
            toastShow("Please Login first!", "E");
            return;
        }
        if (cartItems !== null && cartItems.length > 0) {
            setShowCartModal(true);
            return;
        }
        toastShow('Empty cart!', "E");
    };

    const isAuthenticatedUser = (isAuthenticated && userLoggedIn !== undefined && userLoggedIn.name != undefined);

    return (
        <>
            {showMyOrdersModal && <Modal showModal={showMyOrdersModal} closeModal={() => setShowMyOrdersModal(false)}>
                <OrderDetails closeModal={() => setShowMyOrdersModal(false)}/>
            </Modal> }
            {showCartModal && <Modal showModal={showCartModal} closeModal={() => setShowCartModal(false)}>
                <CartDetails closeModal={() => setShowCartModal(false)}/>
            </Modal> }
            <div className={HeaderStyles.header_main}>
                <div>
                    <Link to="/" id={HeaderStyles.header_home}>Jimmys Foodzilla</Link>
                    <Link id={HeaderStyles.header_about_link} to="/about"><button className={HeaderStyles.custom_button}>About</button></Link>
                    <Auth0SignInOffButton text={isAuthenticated ? "Logout" : "Login"} isLogin = {!isAuthenticated} />
                    {isAuthenticatedUser && <button className={HeaderStyles.custom_button} onClick = {() => setShowMyOrdersModal(true)}>My Orders</button>}
                    {isAuthenticatedUser && !isAdmin && <span id={HeaderStyles.header_user_name}>Welcome back, {userLoggedIn.name}!</span>}
                    {isAuthenticatedUser && isAdmin && <Link id={HeaderStyles.header_admin_link} to="/admin"><button className={HeaderStyles.custom_button}>Admin Menu</button></Link>}
                </div>
                <CartButton cartItemsCounter = {cartItems.length} cartButtonClick={clickCartHandler} />
            </div>
            <img src={imgBg} className={HeaderStyles.main_bg} alt="food background"></img>
            <div className={HeaderStyles.header_text}>
                <h1>Delicious Food, Delivered To You</h1>
                <p>Choose your favorite meal from our broad selection of available meals and enjoy a delicious lunch or dinner at home.</p>
                <p>All our meals are cooked with high-quality ingredients, just-in-time and of course by experienced chefs!</p>
            </div>
        </>
    );
};

export default Header;