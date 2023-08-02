import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.createRoot(document.getElementById("root") as Element).render(
  <BrowserRouter>
    <Auth0Provider
      domain="dev-f0vakdckhtwh0dl8.us.auth0.com"
      clientId="lUYQ4bVv26qAc2y7fK1jw9zXenl9sw5a"
      authorizationParams={{
        redirect_uri: "http://localhost:3000/"
      }}
    >
      <App />
    </Auth0Provider>
  </BrowserRouter>
);
