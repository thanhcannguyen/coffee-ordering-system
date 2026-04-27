
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function VerifyEmail() {
    const navigate = useNavigate()
    const location = useLocation()

    // Lấy email được truyền từ trang Register sang
    const [email, setEmail] = useState(location.state?.email || '')
    const [otp, setOtp] = useState('')

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    // Gửi email + otp lên backend để xác thực
    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        setMessage('')
        setError('')

        try {
            const res = await axios.post(
                'http://localhost:5000/api/auth/verify-email',
                {
                    email,
                    otp,
                }
            )

            setMessage(res.data.message || 'Xác thực email thành công')

            // Xác thực xong thì cho user về login
            setTimeout(() => {
                navigate('/login')
            }, 1000)
        } catch (err) {
            setError(err.response?.data?.message || 'Xác thực email thất bại')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2>Xác thực email</h2>
                <p style={styles.desc}>Nhập mã OTP đã được gửi về email của bạn</p>

                {message && <p style={styles.success}>{message}</p>}
                {error && <p style={styles.error}>{error}</p>}

                <input
                    style={styles.input}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    style={styles.input}
                    type="text"
                    placeholder="Nhập mã OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />

                <button style={styles.button} disabled={loading}>
                    {loading ? 'Đang xác thực...' : 'Xác thực'}
                </button>

                <p style={styles.linkText}>
                    Đã xác thực? <Link to="/login">Đăng nhập</Link>
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