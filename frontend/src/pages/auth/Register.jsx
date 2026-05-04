
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'

export default function Register() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({ name: '', email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError(''); setMessage('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true); setMessage(''); setError('')
        try {
            const res = await axiosInstance.post('/auth/register', formData)
            setMessage(res.data.message || 'Đăng ký thành công! Vui lòng kiểm tra email.')

            // ← tăng lên 2500ms để user đọc kịp thông báo
            setTimeout(() => {
                navigate('/verify-email', { state: { email: formData.email } })
            }, 2500)
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={s.page}>
            <div style={s.card}>
                {/* Tiêu đề — căn giữa */}
                <h2 style={s.title}>Tạo tài khoản</h2>
                <p style={s.desc}>Đăng ký để bắt đầu đặt cà phê online</p>

                {/* Thông báo — căn giữa */}
                {message && (
                    <div style={s.alertOk}>
                        <span style={s.alertIcon}>✓</span> {message}
                    </div>
                )}
                {error && (
                    <div style={s.alertErr}>
                        <span style={s.alertIcon}>✕</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={s.field}>
                        <label style={s.label}>Họ tên</label>
                        <input
                            style={s.input}
                            type='text'
                            name='name'
                            placeholder='Nguyễn Văn A'
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={s.field}>
                        <label style={s.label}>Email</label>
                        <input
                            style={s.input}
                            type='email'
                            name='email'
                            placeholder='example@gmail.com'
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={s.field}>
                        <label style={s.label}>Mật khẩu</label>
                        <input
                            style={s.input}
                            type='password'
                            name='password'
                            placeholder='Ít nhất 6 ký tự'
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button style={{ ...s.btn, opacity: loading ? 0.75 : 1 }} disabled={loading}>
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </form>

                <p style={s.foot}>
                    Đã có tài khoản? <Link to='/login' style={s.link}>Đăng nhập</Link>
                </p>
            </div>
        </div>
    )
}

const s = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f0eb',
    },
    card: {
        width: 380,
        padding: '36px 32px',
        borderRadius: 16,
        background: '#fff',
        border: '1px solid #e8ddd5',
        boxShadow: '0 4px 24px rgba(111,78,55,0.08)',
    },
    logoWrap: { textAlign: 'center', marginBottom: 12 },
    logoIcon: { fontSize: 32 },
    title: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 700,
        color: '#1a0f0a',
        margin: '0 0 6px',
    },
    desc: {
        textAlign: 'center',
        color: '#8b7355',
        fontSize: 13,
        margin: '0 0 24px',
    },
    alertOk: {
        textAlign: 'center',
        padding: '11px 14px',
        borderRadius: 8,
        background: '#e7f8ec',
        color: '#1b7f3a',
        fontSize: 13,
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        fontWeight: 500,
    },
    alertErr: {
        textAlign: 'center',
        padding: '11px 14px',
        borderRadius: 8,
        background: '#fde8e8',
        color: '#b42318',
        fontSize: 13,
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    alertIcon: { fontSize: 12, fontWeight: 700 },
    field: { marginBottom: 14 },
    label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#6f4e37', marginBottom: 6, letterSpacing: 0.3 },
    input: {
        width: '100%', padding: '11px 14px',
        borderRadius: 8, border: '1px solid #e8ddd5',
        fontSize: 14, background: '#faf7f4',
        boxSizing: 'border-box', outline: 'none',
    },
    btn: {
        width: '100%', padding: '13px',
        background: '#6f4e37', color: '#fff',
        border: 'none', borderRadius: 10,
        fontSize: 15, fontWeight: 600,
        cursor: 'pointer', marginTop: 4,
    },
    foot: { textAlign: 'center', fontSize: 13, color: '#8b7355', marginTop: 20 },
    link: { color: '#6f4e37', fontWeight: 600, textDecoration: 'none' },
}