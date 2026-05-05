import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Login from './page/Login';
import Home from './page/Home';
import Register from './page/Register';
import Products from './page/Products';
import Cart from './page/Cart';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import AppRoutes from './AppRoutes';


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
