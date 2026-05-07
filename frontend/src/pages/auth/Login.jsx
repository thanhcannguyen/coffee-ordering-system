// src/pages/auth/Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true); setError('')
        try {
            const res = await axiosInstance.post('/auth/login', formData)
            login(res.data.token, res.data.data)
            navigate(res.data.data.role === 'admin' ? '/admin' : '/menu')
        } catch (err) {
            const msg = err.response?.data?.message || ''
            // Nếu backend trả về lỗi chưa xác minh → redirect sang verify-email
            if (err.response?.status === 403 || msg.toLowerCase().includes('xác minh') || msg.toLowerCase().includes('verify')) {
                navigate('/verify-email', { state: { email: formData.email } })
                return
            }
            setError(msg || 'Đăng nhập thất bại')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={s.page}>
            <div className='auth-card'>
                <h2 style={s.title}>Đăng nhập</h2>
                <p style={s.desc}>Chào mừng bạn quay trở lại</p>

                {error && (
                    <div style={s.alertErr}>
                        <span>✕</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={s.field}>
                        <label style={s.label}>Email</label>
                        <input style={s.input} type='email' name='email'
                            placeholder='example@gmail.com' value={formData.email}
                            onChange={handleChange} required />
                    </div>
                    <div style={s.field}>
                        <label style={s.label}>Mật khẩu</label>
                        <input style={s.input} type='password' name='password'
                            placeholder='Nhập mật khẩu' value={formData.password}
                            onChange={handleChange} required />
                    </div>
                    <button style={{ ...s.btn, opacity: loading ? 0.75 : 1 }} disabled={loading}>
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                <p style={s.foot}>
                    Chưa có tài khoản? <Link to='/register' style={s.link}>Đăng ký ngay</Link>
                </p>
            </div>
        </div>
    )
}

const s = {
    page: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f0eb', padding: '20px 16px' },
    title: { textAlign: 'center', fontSize: 22, fontWeight: 700, color: '#1a0f0a', margin: '0 0 6px' },
    desc: { textAlign: 'center', color: '#8b7355', fontSize: 13, margin: '0 0 24px' },
    alertErr: { textAlign: 'center', padding: '10px 14px', borderRadius: 8, background: '#fde8e8', color: '#b42318', fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
    field: { marginBottom: 14 },
    label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#6f4e37', marginBottom: 6, letterSpacing: 0.3 },
    input: { width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #e8ddd5', fontSize: 14, background: '#faf7f4', boxSizing: 'border-box', outline: 'none' },
    btn: { width: '100%', padding: '13px', background: '#6f4e37', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 4 },
    foot: { textAlign: 'center', fontSize: 13, color: '#8b7355', marginTop: 20 },
    link: { color: '#6f4e37', fontWeight: 600, textDecoration: 'none' },
}