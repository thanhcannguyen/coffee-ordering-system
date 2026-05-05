// src/pages/user/Checkout.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { createOrderApi } from '../../api/orderApi'

export default function Checkout() {
    const navigate = useNavigate()
    const { cart, fetchCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({ name: '', phone: '', address: '', paymentMethod: 'COD', note: '' })

    const items = cart?.items ?? []
    const totalAmount = cart?.totalAmount ?? 0

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError('') }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (items.length === 0) { setError('Giỏ hàng đang trống'); return }
        try {
            setLoading(true)
            const res = await createOrderApi({
                shippingInfo: { fullName: form.name, phone: form.phone, address: form.address },
                paymentMethod: form.paymentMethod,
                note: form.note,
            })
            await fetchCart()
            navigate(`/orders/${res.data.data._id}`)
        } catch (err) {
            setError(err.response?.data?.message || 'Đặt hàng thất bại')
        } finally {
            setLoading(false)
        }
    }

    if (!cart) return <p style={s.loading}>Đang tải...</p>

    return (
        <div style={s.page}>
            <div style={s.container}>
                <h1 style={s.title}>Thanh toán</h1>

                <div className='checkout-layout' style={s.layout}>
                    {/* Form */}
                    <div style={s.formCard}>
                        <h3 style={s.cardTitle}>Thông tin nhận hàng</h3>
                        {error && <div style={s.errorBox}>{error}</div>}

                        <div className='checkout-form-grid' style={s.formGrid}>
                            {[
                                { name: 'name', label: 'Họ tên', placeholder: 'Nguyễn Văn A', type: 'text' },
                                { name: 'phone', label: 'Số điện thoại', placeholder: '0901234567', type: 'text' },
                            ].map(f => (
                                <div key={f.name} style={s.formGroup}>
                                    <label style={s.label}>{f.label}</label>
                                    <input style={s.input} type={f.type} name={f.name}
                                        placeholder={f.placeholder} value={form[f.name]}
                                        onChange={handleChange} required />
                                </div>
                            ))}
                        </div>

                        {[
                            { name: 'address', label: 'Địa chỉ', placeholder: '123 Lê Lợi, Q1...', type: 'text' },
                        ].map(f => (
                            <div key={f.name} style={s.formGroup}>
                                <label style={s.label}>{f.label}</label>
                                <input style={s.input} type={f.type} name={f.name}
                                    placeholder={f.placeholder} value={form[f.name]}
                                    onChange={handleChange} required />
                            </div>
                        ))}

                        <div style={s.formGroup}>
                            <label style={s.label}>Phương thức thanh toán</label>
                            <div style={s.paymentGroup}>
                                {[
                                    { value: 'COD', label: '🚚 Thanh toán khi nhận hàng' },
                                    { value: 'BANKING', label: '🏦 Chuyển khoản ngân hàng' },
                                ].map(opt => (
                                    <label key={opt.value} style={{ ...s.paymentOption, background: form.paymentMethod === opt.value ? '#f5ede4' : '#faf7f4', border: `1.5px solid ${form.paymentMethod === opt.value ? '#6f4e37' : '#e0d3c8'}` }}>
                                        <input type='radio' name='paymentMethod' value={opt.value}
                                            checked={form.paymentMethod === opt.value}
                                            onChange={handleChange}
                                            style={{ accentColor: '#6f4e37', marginRight: 10, flexShrink: 0 }} />
                                        <span style={{ fontSize: 13, color: '#1a0f0a', fontWeight: form.paymentMethod === opt.value ? 600 : 400 }}>{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div style={s.formGroup}>
                            <label style={s.label}>Ghi chú (tuỳ chọn)</label>
                            <textarea style={{ ...s.input, height: 70, resize: 'none', position: 'relative', zIndex: 1 }}
                                name='note' placeholder='Giao buổi sáng, gọi trước khi giao...'
                                value={form.note} onChange={handleChange} />
                        </div>

                        <div style={s.btnRow}>
                            <button type='button' style={s.btnSecondary} onClick={() => navigate('/cart')}>← Giỏ hàng</button>
                            <button type='button' style={{ ...s.btnPrimary, opacity: loading ? 0.7 : 1 }}
                                disabled={loading || items.length === 0} onClick={handleSubmit}>
                                {loading ? 'Đang xử lý...' : '✓ Xác nhận đặt hàng'}
                            </button>
                        </div>
                    </div>

                    {/* Summary */}
                    <div style={s.summary}>
                        <h3 style={s.cardTitle}>Đơn hàng của bạn</h3>
                        <div style={s.itemScroll}>
                            {items.map((item, idx) => (
                                <div key={idx} style={s.summaryItem}>
                                    <div style={s.summaryItemLeft}>
                                        <img src={item.product?.image || item.image} alt={item.product?.name}
                                            style={s.thumb} onError={e => { e.target.src = 'https://placehold.co/44x44/f5f0eb/6f4e37?text=Coffee' }} />
                                        <div>
                                            <div style={s.itemName}>{item.product?.name || item.name}</div>
                                            <div style={s.itemMeta}>x{item.quantity}</div>
                                        </div>
                                    </div>
                                    <div style={s.itemTotal}>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</div>
                                </div>
                            ))}
                        </div>
                        <div style={s.divider} />
                        <div style={s.totalRow}>
                            <span style={s.totalLabel}>Phí giao hàng</span>
                            <span style={{ color: '#1b7f3a', fontWeight: 600 }}>Miễn phí</span>
                        </div>
                        <div style={{ ...s.totalRow, fontWeight: 700, fontSize: 17, marginTop: 8 }}>
                            <span>Tổng cộng</span>
                            <span style={{ color: '#6f4e37' }}>{totalAmount.toLocaleString('vi-VN')}đ</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const s = {
    page: { background: '#ede8e2', minHeight: '100vh', padding: '22px 0 40px' },
    container: { maxWidth: 1010, margin: '0 auto', padding: '0 16px' },
    title: { fontSize: 24, fontWeight: 700, color: '#1a0f0a', marginBottom: 16 },
    loading: { padding: 40, textAlign: 'center', color: '#8b7355' },
    layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' },
    formCard: { background: '#fff', borderRadius: 14, border: '2px solid #c9b49a', boxShadow: '0 2px 16px rgba(111,78,55,0.10)', padding: '20px 24px', overflow: 'visible' },
    cardTitle: { fontSize: 15, fontWeight: 700, color: '#1a0f0a', margin: '0 0 16px' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' },
    formGroup: { marginBottom: 12 },
    label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#6f4e37', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 },
    input: { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #e0d3c8', fontSize: 13, background: '#faf7f4', boxSizing: 'border-box', outline: 'none', color: '#1a0f0a', position: 'relative', zIndex: 10 },
    btnRow: { display: 'flex', gap: 10, marginTop: 4, flexWrap: 'nowrap' },
    btnPrimary: { flex: 2, padding: '12px', background: '#6f4e37', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', minWidth: 0 },
    btnSecondary: { flex: '0 0 auto', padding: '12px 16px', background: '#fff', color: '#8b7355', border: '1.5px solid #d4c4b4', borderRadius: 10, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' },
    errorBox: { background: '#fde8e8', color: '#b42318', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 12 },
    paymentGroup: { display: 'flex', flexDirection: 'column', gap: 8 },
    paymentOption: { display: 'flex', alignItems: 'center', padding: '10px 14px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s' },
    summary: { background: '#fff', borderRadius: 14, border: '2px solid #c9b49a', boxShadow: '0 2px 16px rgba(111,78,55,0.10)', padding: '20px 24px' },
    itemScroll: { overflowY: 'auto', maxHeight: 340, marginRight: -8, paddingRight: 8 },
    summaryItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    summaryItemLeft: { display: 'flex', alignItems: 'center', gap: 10, flex: 1 },
    thumb: { width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 },
    itemName: { fontSize: 13, fontWeight: 600, color: '#1a0f0a' },
    itemMeta: { fontSize: 12, color: '#8b7355', marginTop: 2 },
    itemTotal: { fontSize: 13, fontWeight: 700, color: '#6f4e37', flexShrink: 0 },
    divider: { borderTop: '1.5px solid #e8ddd5', margin: '12px 0' },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 },
    totalLabel: { color: '#8b7355' },
}