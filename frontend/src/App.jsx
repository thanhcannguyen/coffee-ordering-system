// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Auth
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyEmail from './pages/auth/VerifyEmail'

// Layouts
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'

// User pages
import Menu from './pages/user/Menu'
import ProductDetail from './pages/user/ProductDetail'
import Profile from './pages/user/Profile'
import Cart from './pages/user/Cart'
import Checkout from './pages/user/Checkout'
import Orders from './pages/user/Orders'
import OrderDetail from './pages/user/OrderDetail'

// Admin pages
import Dashboard from './pages/admin/Dashboard'
import Categories from './pages/admin/Categories'
import Products from './pages/admin/Products'
import Users from './pages/admin/Users'

// Route guards
import UserRoute from './routes/UserRoute'
import AdminRoute from './routes/AdminRoute'
import AdminOrders from './pages/admin/Orders'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Vào trang gốc → về login */}
        <Route path='/' element={<Navigate to='/login' />} />

        {/* Auth — public */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/verify-email' element={<VerifyEmail />} />

        {/* User — cần đăng nhập, dùng UserLayout */}
        <Route element={<UserRoute><UserLayout /></UserRoute>}>
          <Route path='/menu' element={<Menu />} />
          <Route path='/product/:id' element={<ProductDetail />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/cart' element={<Cart />} />
          {/* Giai đoạn 3 thêm vào đây: /cart, /checkout, /orders */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Route>

        {/* Admin — chỉ admin, dùng AdminLayout */}
        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path='/admin' element={<Dashboard />} />
          <Route path='/admin/categories' element={<Categories />} />
          <Route path='/admin/products' element={<Products />} />
          <Route path='/admin/users' element={<Users />} />
          {/* Giai đoạn 4-5 thêm vào đây: /admin/orders, /admin/users */}
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Route>

        {/* Fallback */}
        <Route path='*' element={<Navigate to='/login' />} />
      </Routes>
    </BrowserRouter>
  )
}