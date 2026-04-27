
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyEmail from './pages/auth/VerifyEmail'

import UserRoute from './routes/UserRoute'
import AdminRoute from './routes/AdminRoute'
import { useAuth } from './context/AuthContext'

// Trang tạm cho user sau khi login
function UserHome() {
  const { user, logout } = useAuth()

  return (
    <div style={{ padding: 40 }}>
      <h1>Trang User</h1>
      <p>Xin chào: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>

      <button onClick={logout}>Đăng xuất</button>
    </div>
  )
}

// Trang tạm cho admin sau khi login
function AdminHome() {
  const { user, logout } = useAuth()

  return (
    <div style={{ padding: 40 }}>
      <h1>Trang Admin</h1>
      <p>Xin chào admin: {user?.name}</p>
      <p>Email: {user?.email}</p>

      <button onClick={logout}>Đăng xuất</button>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Vào trang gốc thì chuyển về login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth pages */}
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />

        {/* Trang cần đăng nhập mới vào được */}
        <Route
          path="/home"
          element={
            <UserRoute>
              <UserHome />
            </UserRoute>
          }
        />

        {/* Trang chỉ admin mới vào được */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminHome />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}