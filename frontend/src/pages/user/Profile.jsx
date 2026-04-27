
import { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'
import { useAuth } from '../../context/AuthContext'

export default function Profile() {
    const { user, logout } = useAuth()

    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axiosInstance.get('/users/profile')

                setProfile(res.data.data)
            } catch (err) {
                setError(err.response?.data?.message || 'Không thể tải thông tin user')
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    if (loading) {
        return <p style={{ padding: 40 }}>Đang tải thông tin...</p>
    }

    if (error) {
        return <p style={{ padding: 40, color: 'red' }}>{error}</p>
    }

    return (
        <div style={{ padding: 40 }}>
            <h1>Thông tin cá nhân</h1>

            <p>
                <strong>ID:</strong> {profile?._id || profile?.id}
            </p>

            <p>
                <strong>Tên:</strong> {profile?.name || user?.name}
            </p>

            <p>
                <strong>Email:</strong> {profile?.email || user?.email}
            </p>

            <p>
                <strong>Role:</strong> {profile?.role || user?.role}
            </p>

            <button onClick={logout}>Đăng xuất</button>
        </div>
    )
}