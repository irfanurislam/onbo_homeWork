import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Another from './components/another.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element:  <App />,
  },
  // {
   
  //     path: "/second",
  //     element:  <Another></Another> ,
   
  // }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <RouterProvider router={router} />
  </React.StrictMode>,
)
