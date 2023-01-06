import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RouteErrorPage from './other/route_error';

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <RouteErrorPage />,
    },
]);

ReactDOM.createRoot(document.getElementById("root") as Element).render(
    <RouterProvider router={router} />
);
