import React, {useEffect, useState} from 'react';
import CartButton from './CartButton';
import HeaderStyles from './Header.module.css';
import {useCartContext} from '../contexts/cart-context';
import CartModal from './CartModal';
import { toastShow } from '../other/ToastUtils';
import { Link } from "react-router-dom";
import imgBg from '../media/bg.webp';
import Auth0SignInOffButton from './Auth0SignInOffButton';
import { useAuth0 } from "@auth0/auth0-react";
import Settings from '../other/PublicSettings';

//renders the top header bar
const Header = ()  => {

    const {getIdTokenClaims, isAuthenticated} = useAuth0();
    const [userLoggedIn, setUserLoggedIn] = useState<IAuth0User | undefined>(undefined);

    //get the IdToken Claims, which contain the user's metadata (user NAME/LASTNAME/ADDRESS), these are added
    //in the idToken in Auth0 dashboard -> onPostLogin AUTH0 ACTION
    useEffect(() => {
        if (isAuthenticated) {
            const getIdClaimsAsync = async() => {
                let claims = await getIdTokenClaims();
                if (claims != undefined) {
                    setUserLoggedIn({
                        name: claims[`${Settings.auth0_audience}/user_metadata.name`],
                        last_name: claims[`${Settings.auth0_audience}/user_metadata.last_name`],
                        email: claims[`email`] ?? "",
                        address: claims[`${Settings.auth0_audience}/user_metadata.address`],
                    });
                }
            }
            getIdClaimsAsync();
        } else
            setUserLoggedIn(undefined);

        }, [isAuthenticated]);

    const [showModal, setShowModal] = useState<boolean>(false);
    const {cartItems} = useCartContext();

    //called from inside the modal (props), disables/enables the modal
    const showModalHandler = (showModal : boolean) => { setShowModal(showModal); }

    //click on the "cart" div
    const clickCartHandler = (): void => {
        if (!isAuthenticated){
            toastShow("Please Login first!", "E");
        } else {
            if (cartItems !== null && cartItems.length > 0){
                setShowModal(true);
            } //else -> empty
            else {
                toastShow('Empty cart!', "E");
            }
        }
    };

    return (
        <React.Fragment>
            <CartModal showModal={showModal} setShowModal={showModalHandler} />
            <div className={HeaderStyles.header_main}>
                <div>
                    <Link to="/" id={HeaderStyles.header_home}>Jimmys Foodzilla</Link>
                    <button className={HeaderStyles.custom_button}><Link id={HeaderStyles.header_about_link} to="/about">About</Link></button>
                    <Auth0SignInOffButton text={isAuthenticated ? "Logout" : "Login"} isLogin = {!isAuthenticated} />
                    {(isAuthenticated && userLoggedIn !== undefined && userLoggedIn.name != undefined) && <span id={HeaderStyles.header_user_name}>Welcome back, {userLoggedIn.name}!</span>}
                </div>

                <CartButton cartItemsCounter = {cartItems.length} cartButtonClick={clickCartHandler} />
            </div>
            <img src={imgBg} className={HeaderStyles.main_bg} alt="food background"></img>
            <div className={HeaderStyles.header_text}>
                <h1>Delicious Food, Delivered To You</h1>
                <p>Choose your favorite meal from our broad selection of available meals and enjoy a delicious lunch or dinner at home.</p>
                <p>All our meals are cooked with high-quality ingredients, just-in-time and of course by experienced chefs!</p>
            </div>
        </React.Fragment>
    );
};

export default Header;