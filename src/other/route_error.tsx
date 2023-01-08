import RouteErrorStyles from './route_error.module.css';

//error page if the user navigated to non-existent path
const RouteErrorPage = () => {
  return (
    <div id={RouteErrorStyles.error_page}>
        <div id={RouteErrorStyles.error_page_content}>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p><i>404 Not Found</i></p>
        </div>
    </div>
  );
};

export default RouteErrorPage;