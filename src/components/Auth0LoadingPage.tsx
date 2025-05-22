import auth0style from '../styles/Auth0LoadingPage.module.scss';

const Auth0LoadingPage = () => {
    return (
        <div id={auth0style.auth0_loader}>
            <span className={auth0style.auth0_spinner}></span>
            <h1 id={auth0style.auth0_text}>Loading...</h1>
        </div>
    );
}

export default Auth0LoadingPage;