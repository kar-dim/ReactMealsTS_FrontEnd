import { useAuth0 } from "@auth0/auth0-react";
import HeaderStyles from "./Header.module.css";

const Auth0SignInOffButton = (props: {text: string; isLogin: boolean})=> {
  const { loginWithRedirect, logout } = useAuth0();
  return (
    <button className={HeaderStyles.custom_button} onClick=
    {() => props.isLogin ? loginWithRedirect() : logout({ logoutParams: { returnTo: "http://localhost:3000/" } })}>
      {props.text}
    </button>
  );
};

export default Auth0SignInOffButton;