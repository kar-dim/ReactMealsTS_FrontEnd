import { useRouteError } from 'react-router-dom';
import RouteErrorStyles from './route_error.module.css';

//error page if the user navigated to non-existent path
const RouteErrorPage = () => {
  const error : any = useRouteError();
  console.error(error);

  return (
    <div id={RouteErrorStyles.error_page}>
        <div id={RouteErrorStyles.error_page_content}>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p><i>{error.statusText || error.message}</i></p>
        </div>
    </div>
  );
};

export default RouteErrorPage;