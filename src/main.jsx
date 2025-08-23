
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import{
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { Provider } from 'react-redux'
import { store } from './store/store.jsx'


import Login from './Pages/Login.jsx';
import Signup from './Pages/Signup.jsx';
import Home from './Pages/Home.jsx';
import Scan from './Pages/Scan.jsx';
import Result from './components/Result.jsx';


const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"",
        element:<Home/>
      },
      {
        path:"login",
        element:<Login/>
      },
      {
        path:"signup",
        element:<Signup/>
      },
      {
        path:"scan",
        element:<Scan/>
      },
      {
        path:"result",
        element:<Result/>
      },
      {
        path:"*",
        element:<h1>404 Not Found</h1>
      }
    ]
  }
]);


createRoot(document.getElementById('root')).render(
   <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
