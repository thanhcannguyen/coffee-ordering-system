// src/pages/user/Profile.jsx
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { updateProfile } from '../../api/userApi'

export default function Profile() {
    const { user, login } = useAuth()
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        name: user?.name || '', phone: user?.phone || '',
        street: user?.address?.street || '', district: user?.address?.district || '', city: user?.address?.city || '',
    })

    const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setSuccess(''); setError('') }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true); setSuccess(''); setError('')
        try {
            const res = await updateProfile({ name: form.name, phone: form.phone, address: { street: form.street, district: form.district, city: form.city } })
            login(localStorage.getItem('token'), res.data.data)
            setSuccess('Cập nhật thông tin thành công')
            setEditing(false)
        } catch (err) {
            setError(err.response?.data?.message || 'Cập nhật thất bại')
        } finally { setLoading(false) }
    }

    const initials = user?.name?.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase() || '?'

    return (
        <div style={s.page}>
            <div style={s.container}>
                <h1 style={s.title}>Hồ sơ cá nhân</h1>

                {/* Layout — 2 cột desktop, 1 cột mobile */}
                <div className='profile-layout' style={s.layout}>

                    {/* Avatar card */}
                    <div style={s.sideCard}>
                        <div style={s.avatar}>{initials}</div>
                        <div style={s.userName}>{user?.name}</div>
                        <div style={s.userEmail}>{user?.email}</div>
                        <span style={s.verifiedBadge}>✓ Email đã xác minh</span>
                        <div style={s.roleBadge}>{user?.role === 'admin' ? '👑 Quản trị viên' : '☕ Khách hàng'}</div>
                    </div>

                    {/* Info cards */}
                    <div>
                        {success && <div style={s.successBox}>{success}</div>}
                        {error && <div style={s.errorBox}>{error}</div>}

                        <div style={s.card}>
                            <div style={s.cardHeader}>
                                <h3 style={s.cardTitle}>Thông tin cá nhân</h3>
                                {!editing && <button style={s.editBtn} onClick={() => setEditing(true)}>Chỉnh sửa</button>}
                            </div>

                            {editing ? (
                                <form onSubmit={handleSubmit}>
                                    {[
                                        { name: 'name', label: 'Họ tên', placeholder: 'Nguyễn Văn A' },
                                        { name: 'phone', label: 'Số điện thoại', placeholder: '0901234567' },
                                    ].map(f => (
                                        <div key={f.name} style={s.formGroup}>
                                            <label style={s.label}>{f.label}</label>
                                            <input style={s.input} name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} />
                                        </div>
                                    ))}
                                    <div style={s.formGroup}>
                                        <label style={s.label}>Địa chỉ</label>
                                        <input style={s.input} name='street' value={form.street} onChange={handleChange} placeholder='Số nhà, tên đường' />
                                        <input style={{ ...s.input, marginTop: 8 }} name='district' value={form.district} onChange={handleChange} placeholder='Quận / Huyện' />
                                        <input style={{ ...s.input, marginTop: 8 }} name='city' value={form.city} onChange={handleChange} placeholder='Tỉnh / Thành phố' />
                                    </div>
                                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                        <button type='submit' style={s.btnPrimary} disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
                                        <button type='button' style={s.btnSecondary} onClick={() => setEditing(false)}>Hủy</button>
                                    </div>
                                </form>
                            ) : (
                                <div>
                                    {[
                                        { label: 'Họ tên', value: user?.name },
                                        { label: 'Email', value: user?.email },
                                        { label: 'Số điện thoại', value: user?.phone || <span style={s.empty}>Chưa cập nhật</span> },
                                        { label: 'Đường', value: user?.address?.street || <span style={s.empty}>Chưa cập nhật</span> },
                                        { label: 'Quận / Huyện', value: user?.address?.district || <span style={s.empty}>Chưa cập nhật</span> },
                                        { label: 'Tỉnh / Thành phố', value: user?.address?.city || <span style={s.empty}>Chưa cập nhật</span> },
                                    ].map(row => (
                                        <div key={row.label} style={s.infoRow}>
                                            <span style={s.infoLabel}>{row.label}</span>
                                            <span style={s.infoValue}>{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={s.card}>
                            <h3 style={s.cardTitle}>Bảo mật</h3>
                            <div style={s.infoRow}>
                                <span style={s.infoLabel}>Mật khẩu</span>
                                <span style={s.infoValue}>••••••••</span>
                            </div>
                            <div style={s.infoRow}>
                                <span style={s.infoLabel}>Xác minh email</span>
                                <span style={{ fontSize: 12, background: '#e7f8ec', color: '#1b7f3a', padding: '3px 10px', borderRadius: 20 }}>✓ Đã xác minh</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const s = {
    page: { background: '#f5f0eb', minHeight: '100vh' },
    container: { maxWidth: 860, margin: '0 auto', padding: '0 16px' },
    title: { fontSize: 24, fontWeight: 600, color: '#1a0f0a', marginBottom: 20 },
    layout: { display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, alignItems: 'start' },
    sideCard: { background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', padding: 20, textAlign: 'center' },
    avatar: { width: 64, height: 64, borderRadius: '50%', background: '#6f4e37', color: '#fff', fontSize: 22, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' },
    userName: { fontSize: 16, fontWeight: 600, color: '#1a0f0a', marginBottom: 4 },
    userEmail: { fontSize: 12, color: '#8b7355', marginBottom: 12, wordBreak: 'break-all' },
    verifiedBadge: { display: 'inline-block', fontSize: 11, background: '#e7f8ec', color: '#1b7f3a', padding: '3px 10px', borderRadius: 20, marginBottom: 10 },
    roleBadge: { fontSize: 12, color: '#8b7355', marginTop: 4 },
    card: { background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', padding: '20px 16px', marginBottom: 14 },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 },
    cardTitle: { fontSize: 14, fontWeight: 600, color: '#1a0f0a', margin: 0 },
    editBtn: { padding: '6px 16px', borderRadius: 8, border: '1px solid #e8ddd5', background: '#f5f0eb', color: '#6f4e37', fontSize: 13, cursor: 'pointer', fontWeight: 500 },
    formGroup: { marginBottom: 14 },
    label: { display: 'block', fontSize: 11, fontWeight: 500, color: '#8b7355', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
    input: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e8ddd5', fontSize: 14, background: '#f5f0eb', boxSizing: 'border-box', outline: 'none' },
    btnPrimary: { padding: '11px 24px', background: '#6f4e37', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontWeight: 500 },
    btnSecondary: { padding: '10px 20px', background: '#fff', color: '#8b7355', border: '1px solid #e8ddd5', borderRadius: 8, fontSize: 14, cursor: 'pointer' },
    infoRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f0eb', gap: 8, flexWrap: 'wrap' },
    infoLabel: { fontSize: 13, color: '#8b7355' },
    infoValue: { fontSize: 13, fontWeight: 500, color: '#1a0f0a', textAlign: 'right', wordBreak: 'break-word' },
    empty: { color: '#c4a882', fontStyle: 'italic', fontWeight: 400 },
    successBox: { background: '#e7f8ec', color: '#1b7f3a', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 14 },
    errorBox: { background: '#fde8e8', color: '#b42318', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 14 },
}