import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import {Settings} from "./other/PublicSettings.ts"

ReactDOM.createRoot(document.getElementById("root") as Element).render(
  <BrowserRouter>
    <Auth0Provider
      domain={Settings.auth0_domain}
      clientId={Settings.auth0_clientId}
      useRefreshTokens={true}
      useRefreshTokensFallback={true}
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: `${Settings.frontend_url}/`,
        audience: Settings.auth0_audience
      }}
    >
      <App />
    </Auth0Provider>
  </BrowserRouter>
);
