import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Home';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById("root") as Element).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
