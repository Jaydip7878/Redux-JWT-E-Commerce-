import { useLocation } from 'react-router-dom';
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './page/Login';
import Home from './page/Home';
import Register from './page/Register';
import Products from './page/Products';
import Cart from './page/Cart';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import { useSelector } from 'react-redux';

export default function AppRoutes() {
  const token = useSelector((state)=>state.auth.token)
  const location = useLocation()

  const showNavbar = token && location.pathname !== '/login' && location.pathname !== '/register'

  return (
    <>
      {showNavbar && <Navbar />}
      
      <Routes>
        <Route path='/' element = {<Navigate to = "/login" />} />
        <Route path='/login' element= {token?<Navigate to ='/home' />:<Login /> } />
        <Route path='/register' element = {<Register />} />

        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
      </Routes>
    </>
  )
}
