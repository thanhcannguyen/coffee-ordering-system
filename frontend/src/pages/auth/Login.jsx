
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()

    // Lưu email + password người dùng nhập
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Cập nhật dữ liệu form
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    // Gửi login lên backend
    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        setError('')

        try {
            const res = await axios.post(
                'http://localhost:5000/api/auth/login',
                formData
            )

            // Backend của bạn trả token và user trong data
            const token = res.data.token
            const user = res.data.data

            // Lưu token + user vào AuthContext và localStorage
            login(token, user)

            // Điều hướng theo role
            if (user.role === 'admin') {
                navigate('/admin')
            } else {
                navigate('/home')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2>Đăng nhập</h2>
                <p style={styles.desc}>Đăng nhập để tiếp tục sử dụng hệ thống</p>

                {error && <p style={styles.error}>{error}</p>}

                <input
                    style={styles.input}
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    style={styles.input}
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button style={styles.button} disabled={loading}>
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>

                <p style={styles.linkText}>
                    Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                </p>
            </form>
        </div>
    )
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f5f5',
    },
    form: {
        width: '360px',
        padding: '28px',
        borderRadius: '12px',
        background: '#fff',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    },
    desc: {
        color: '#666',
        fontSize: '14px',
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '14px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
    },
    button: {
        width: '100%',
        padding: '12px',
        border: 'none',
        borderRadius: '8px',
        background: '#6f4e37',
        color: '#fff',
        fontSize: '15px',
        cursor: 'pointer',
    },
    error: {
        padding: '10px',
        borderRadius: '8px',
        background: '#fde8e8',
        color: '#b42318',
        fontSize: '14px',
    },
    linkText: {
        textAlign: 'center',
        fontSize: '14px',
        marginTop: '16px',
    },
}