import RouteErrorStyles from '../styles/RouteError.module.scss'

interface IErrorPageProps {
  title?: string,
  errorText?: string,
  errorDescription?: string
}
//error page if the user navigated to non-existent path
const RouteErrorPage = ({ title = 'Error', errorText = 'Some unexpected error occured', errorDescription = 'Please try again later' }: IErrorPageProps) => {
  return (
    <div id={RouteErrorStyles.error_page}>
      <div id={RouteErrorStyles.error_page_content}>
        <h1>{title}</h1>
        <p>{errorText}</p>
        <p><i>{errorDescription}</i></p>
      </div>
    </div>
  );
};

export default RouteErrorPage;