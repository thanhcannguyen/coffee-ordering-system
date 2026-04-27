
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function UserRoute({ children }) {
    const { token } = useAuth()

    // Chưa có token nghĩa là chưa login
    if (!token) {
        return <Navigate to="/login" />
    }

    // Có token thì cho vào trang bên trong
    return children
}