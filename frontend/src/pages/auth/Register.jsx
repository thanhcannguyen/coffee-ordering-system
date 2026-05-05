// src/pages/auth/Register.jsx
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
            setTimeout(() => navigate('/verify-email', { state: { email: formData.email } }), 2500)
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={s.page}>
            <div className='auth-card'>
                <h2 style={s.title}>Tạo tài khoản</h2>
                <p style={s.desc}>Đăng ký để bắt đầu đặt cà phê online</p>

                {message && <div style={s.alertOk}><span>✓</span> {message}</div>}
                {error && <div style={s.alertErr}><span>✕</span> {error}</div>}

                <form onSubmit={handleSubmit}>
                    {[
                        { name: 'name', label: 'Họ tên', placeholder: 'Nguyễn Văn A', type: 'text' },
                        { name: 'email', label: 'Email', placeholder: 'example@gmail.com', type: 'email' },
                        { name: 'password', label: 'Mật khẩu', placeholder: 'Ít nhất 6 ký tự', type: 'password' },
                    ].map(f => (
                        <div key={f.name} style={s.field}>
                            <label style={s.label}>{f.label}</label>
                            <input style={s.input} type={f.type} name={f.name}
                                placeholder={f.placeholder} value={formData[f.name]}
                                onChange={handleChange} required />
                        </div>
                    ))}
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
    page: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f0eb', padding: '20px 16px' },
    title: { textAlign: 'center', fontSize: 22, fontWeight: 700, color: '#1a0f0a', margin: '0 0 6px' },
    desc: { textAlign: 'center', color: '#8b7355', fontSize: 13, margin: '0 0 24px' },
    alertOk: { padding: '11px 14px', borderRadius: 8, background: '#e7f8ec', color: '#1b7f3a', fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 500 },
    alertErr: { padding: '11px 14px', borderRadius: 8, background: '#fde8e8', color: '#b42318', fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
    field: { marginBottom: 14 },
    label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#6f4e37', marginBottom: 6, letterSpacing: 0.3 },
    input: { width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #e8ddd5', fontSize: 14, background: '#faf7f4', boxSizing: 'border-box', outline: 'none' },
    btn: { width: '100%', padding: '13px', background: '#6f4e37', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 4 },
    foot: { textAlign: 'center', fontSize: 13, color: '#8b7355', marginTop: 20 },
    link: { color: '#6f4e37', fontWeight: 600, textDecoration: 'none' },
}