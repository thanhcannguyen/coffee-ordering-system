
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'

export default function Register() {
    const navigate = useNavigate()

    // Lưu dữ liệu người dùng nhập vào form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    // Cập nhật formData theo từng input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    // Gửi dữ liệu đăng ký lên backend
    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        setMessage('')
        setError('')

        try {
            const res = await axiosInstance.post('/auth/register', formData)

            setMessage(res.data.message || 'Đăng ký thành công')

            // Chuyển qua trang xác thực, gửi kèm email sang trang VerifyEmail
            setTimeout(() => {
                navigate('/verify-email', {
                    state: { email: formData.email },
                })
            }, 1000)
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2>Đăng ký tài khoản</h2>
                <p style={styles.desc}>Tạo tài khoản để sử dụng hệ thống đặt coffee</p>

                {message && <p style={styles.success}>{message}</p>}
                {error && <p style={styles.error}>{error}</p>}

                <input
                    style={styles.input}
                    type="text"
                    name="name"
                    placeholder="Họ tên"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

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
                    {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>

                <p style={styles.linkText}>
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
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
    success: {
        padding: '10px',
        borderRadius: '8px',
        background: '#e7f8ec',
        color: '#1b7f3a',
        fontSize: '14px',
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