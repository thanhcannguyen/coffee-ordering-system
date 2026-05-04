
import { useState, useEffect } from 'react'  // ← thêm useEffect
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
    const [timeLeft, setTimeLeft] = useState(5 * 60) // ← 5 phút = 300 giây
    const [expired, setExpired] = useState(false)

    // ----------------------------------------
    // Đếm ngược 5 phút
    // Mỗi giây trừ 1, khi về 0 thì báo hết hạn
    // ----------------------------------------
    useEffect(() => {
        if (timeLeft <= 0) {
            setExpired(true)
            return
        }
        const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000)
        return () => clearTimeout(timer) // cleanup khi unmount
    }, [timeLeft])

    // Format giây → MM:SS
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0')
        const s = (seconds % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (expired) return
        setLoading(true); setMessage(''); setError('')
        try {
            const res = await axiosInstance.post('/auth/verify-email', { email, otp })
            setMessage(res.data.message || 'Xác thực email thành công! Đang chuyển đến đăng nhập...')
            setTimeout(() => navigate('/login'), 2500)
        } catch (err) {
            setError(err.response?.data?.message || 'Xác thực thất bại')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={s.page}>
            <div style={s.card}>

                <div style={s.logoWrap}>
                    <span style={s.logoIcon}>✉️</span>
                </div>

                <h2 style={s.title}>Xác thực email</h2>
                <p style={s.desc}>
                    Nhập mã OTP đã được gửi đến<br />
                    <strong style={{ color: '#6f4e37' }}>{email || 'email của bạn'}</strong>
                </p>

                {/* Countdown timer */}
                <div style={{
                    ...s.timerBox,
                    background: expired ? '#fde8e8' : timeLeft <= 60 ? '#fef3e2' : '#e7f8ec',
                    color: expired ? '#b42318' : timeLeft <= 60 ? '#b45309' : '#1b7f3a',
                    border: `1px solid ${expired ? '#f5c5c2' : timeLeft <= 60 ? '#fcd99a' : '#a3ddb4'}`,
                }}>
                    {expired ? (
                        <span>⏰ Mã OTP đã hết hạn — vui lòng đăng ký lại</span>
                    ) : (
                        <span>
                            ⏱ Mã còn hiệu lực trong{' '}
                            <strong style={{ fontVariantNumeric: 'tabular-nums' }}>
                                {formatTime(timeLeft)}
                            </strong>
                        </span>
                    )}
                </div>

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
                    {!location.state?.email && (
                        <div style={s.field}>
                            <label style={s.label}>Email</label>
                            <input
                                style={s.input}
                                type='email'
                                placeholder='example@gmail.com'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div style={s.field}>
                        <label style={s.label}>Mã OTP</label>
                        <input
                            style={{
                                ...s.input,
                                textAlign: 'center', fontSize: 24,
                                letterSpacing: 12, fontWeight: 600,
                                // Xám và không cho nhập khi hết hạn
                                background: expired ? '#f5f5f5' : '#faf7f4',
                                color: expired ? '#aaa' : '#1a0f0a',
                            }}
                            type='text'
                            placeholder='000000'
                            value={otp}
                            maxLength={6}
                            disabled={expired}
                            onChange={e => {
                                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                                setError('')
                            }}
                            required
                        />
                        <p style={s.hint}>Mã OTP gồm 6 chữ số</p>
                    </div>

                    <button
                        style={{
                            ...s.btn,
                            opacity: (loading || otp.length < 6 || expired) ? 0.55 : 1,
                            cursor: expired ? 'not-allowed' : 'pointer',
                        }}
                        disabled={loading || otp.length < 6 || expired}
                    >
                        {loading ? 'Đang xác thực...' : 'Xác thực'}
                    </button>
                </form>

                {expired && (
                    <button
                        style={s.retryBtn}
                        onClick={() => navigate('/register')}
                    >
                        ← Quay lại đăng ký
                    </button>
                )}

                <p style={s.foot}>
                    Đã xác thực? <Link to='/login' style={s.link}>Đăng nhập</Link>
                </p>
            </div>
        </div>
    )
}

const s = {
    page: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f0eb' },
    card: { width: 380, padding: '36px 32px', borderRadius: 16, background: '#fff', border: '1px solid #e8ddd5', boxShadow: '0 4px 24px rgba(111,78,55,0.08)' },
    logoWrap: { textAlign: 'center', marginBottom: 12 },
    logoIcon: { fontSize: 32 },
    title: { textAlign: 'center', fontSize: 22, fontWeight: 700, color: '#1a0f0a', margin: '0 0 6px' },
    desc: { textAlign: 'center', color: '#8b7355', fontSize: 13, margin: '0 0 20px', lineHeight: 1.6 },

    // Timer box — màu thay đổi theo thời gian còn lại
    timerBox: {
        textAlign: 'center', padding: '10px 14px',
        borderRadius: 8, fontSize: 13, marginBottom: 16,
        transition: 'background 0.4s, color 0.4s, border 0.4s',
    },

    alertOk: { textAlign: 'center', padding: '11px 14px', borderRadius: 8, background: '#e7f8ec', color: '#1b7f3a', fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 500 },
    alertErr: { textAlign: 'center', padding: '11px 14px', borderRadius: 8, background: '#fde8e8', color: '#b42318', fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
    alertIcon: { fontSize: 12, fontWeight: 700 },

    field: { marginBottom: 14 },
    label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#6f4e37', marginBottom: 6, letterSpacing: 0.3 },
    input: { width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #e8ddd5', fontSize: 14, boxSizing: 'border-box', outline: 'none' },
    hint: { fontSize: 11, color: '#8b7355', marginTop: 6, textAlign: 'center' },

    btn: { width: '100%', padding: '13px', background: '#6f4e37', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, marginTop: 4 },
    retryBtn: { width: '100%', padding: '11px', background: '#fff', color: '#8b7355', border: '1px solid #e8ddd5', borderRadius: 10, fontSize: 14, cursor: 'pointer', marginTop: 10 },
    foot: { textAlign: 'center', fontSize: 13, color: '#8b7355', marginTop: 20 },
    link: { color: '#6f4e37', fontWeight: 600, textDecoration: 'none' },
}