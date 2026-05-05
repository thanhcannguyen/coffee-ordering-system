import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'

export default function VerifyEmail() {
    const navigate = useNavigate()
    const location = useLocation()
    const [email, setEmail] = useState(location.state?.email || '')
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [timeLeft, setTimeLeft] = useState(5 * 60)
    const [expired, setExpired] = useState(false)

    useEffect(() => {
        if (timeLeft <= 0) { setExpired(true); return }
        const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000)
        return () => clearTimeout(timer)
    }, [timeLeft])

    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (expired) return
        setLoading(true); setMessage(''); setError('')
        try {
            const res = await axiosInstance.post('/auth/verify-email', { email, otp })
            setMessage(res.data.message || 'Xác thực thành công! Đang chuyển đến đăng nhập...')
            setTimeout(() => navigate('/login'), 2500)
        } catch (err) {
            setError(err.response?.data?.message || 'Xác thực thất bại')
        } finally { setLoading(false) }
    }

    return (
        <div style={s.page}>
            <div className='auth-card'>
                <div style={{ textAlign: 'center', marginBottom: 12 }}><span style={{ fontSize: 32 }}>✉️</span></div>
                <h2 style={s.title}>Xác thực email</h2>
                <p style={s.desc}>Nhập mã OTP đã được gửi đến<br /><strong style={{ color: '#6f4e37' }}>{email || 'email của bạn'}</strong></p>

                <div style={{ ...s.timerBox, background: expired ? '#fde8e8' : timeLeft <= 60 ? '#fef3e2' : '#e7f8ec', color: expired ? '#b42318' : timeLeft <= 60 ? '#b45309' : '#1b7f3a', border: `1px solid ${expired ? '#f5c5c2' : timeLeft <= 60 ? '#fcd99a' : '#a3ddb4'}` }}>
                    {expired ? '⏰ Mã OTP đã hết hạn — vui lòng đăng ký lại' : <span>⏱ Mã còn hiệu lực trong <strong>{formatTime(timeLeft)}</strong></span>}
                </div>

                {message && <div style={s.alertOk}>✓ {message}</div>}
                {error && <div style={s.alertErr}>✕ {error}</div>}

                <form onSubmit={handleSubmit}>
                    {!location.state?.email && (
                        <div style={s.field}>
                            <label style={s.label}>Email</label>
                            <input style={s.input} type='email' placeholder='example@gmail.com' value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                    )}
                    <div style={s.field}>
                        <label style={s.label}>Mã OTP</label>
                        <input style={{ ...s.input, textAlign: 'center', fontSize: 24, letterSpacing: 12, fontWeight: 600, background: expired ? '#f5f5f5' : '#faf7f4', color: expired ? '#aaa' : '#1a0f0a' }}
                            type='text' placeholder='000000' value={otp} maxLength={6} disabled={expired}
                            onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError('') }} required />
                        <p style={s.hint}>Mã OTP gồm 6 chữ số</p>
                    </div>
                    <button style={{ ...s.btn, opacity: (loading || otp.length < 6 || expired) ? 0.55 : 1, cursor: expired ? 'not-allowed' : 'pointer' }} disabled={loading || otp.length < 6 || expired}>
                        {loading ? 'Đang xác thực...' : 'Xác thực'}
                    </button>
                </form>

                {expired && <button style={s.retryBtn} onClick={() => navigate('/register')}>← Quay lại đăng ký</button>}
                <p style={s.foot}>Đã xác thực? <Link to='/login' style={s.link}>Đăng nhập</Link></p>
            </div>
        </div>
    )
}

const s = {
    page: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f0eb', padding: '20px 16px' },
    title: { textAlign: 'center', fontSize: 22, fontWeight: 700, color: '#1a0f0a', margin: '0 0 6px' },
    desc: { textAlign: 'center', color: '#8b7355', fontSize: 13, margin: '0 0 20px', lineHeight: 1.6 },
    timerBox: { textAlign: 'center', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16, transition: 'all 0.4s' },
    alertOk: { padding: '11px 14px', borderRadius: 8, background: '#e7f8ec', color: '#1b7f3a', fontSize: 13, marginBottom: 16, textAlign: 'center', fontWeight: 500 },
    alertErr: { padding: '11px 14px', borderRadius: 8, background: '#fde8e8', color: '#b42318', fontSize: 13, marginBottom: 16, textAlign: 'center' },
    field: { marginBottom: 14 },
    label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#6f4e37', marginBottom: 6, letterSpacing: 0.3 },
    input: { width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #e8ddd5', fontSize: 14, boxSizing: 'border-box', outline: 'none' },
    hint: { fontSize: 11, color: '#8b7355', marginTop: 6, textAlign: 'center' },
    btn: { width: '100%', padding: '13px', background: '#6f4e37', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, marginTop: 4, cursor: 'pointer' },
    retryBtn: { width: '100%', padding: '11px', background: '#fff', color: '#8b7355', border: '1px solid #e8ddd5', borderRadius: 10, fontSize: 14, cursor: 'pointer', marginTop: 10 },
    foot: { textAlign: 'center', fontSize: 13, color: '#8b7355', marginTop: 20 },
    link: { color: '#6f4e37', fontWeight: 600, textDecoration: 'none' },
}