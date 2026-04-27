
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
    const { token, user } = useAuth()

    // Chưa đăng nhập thì về login
    if (!token) {
        return <Navigate to="/login" />
    }

    // Đăng nhập rồi nhưng không phải admin thì không cho vào
    if (user?.role !== 'admin') {
        return <Navigate to="/home" />
    }

    // Đúng admin thì cho vào trang admin
    return children
}