// src/pages/user/Checkout.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { createOrderApi } from '../../api/orderApi'

export default function Checkout() {
    const navigate = useNavigate()
    const { cart, fetchCart } = useCart()  // ← lấy từ context, không gọi API lại

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        name: '',
        phone: '',
        address: '',
        paymentMethod: 'COD',
        note: '',
    })

    const items = cart?.items ?? []
    const totalAmount = cart?.totalAmount ?? 0

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (items.length === 0) {
            setError('Giỏ hàng đang trống')
            return
        }

        try {
            setLoading(true)
            const res = await createOrderApi({
                shippingInfo: {
                    fullName: form.name,    // đúng tên field trong model
                    phone: form.phone,
                    address: form.address,
                },
                paymentMethod: form.paymentMethod,
                note: form.note,
            })

            // Refresh cart sau khi đặt hàng — backend đã clear cart rồi
            await fetchCart()

            const orderId = res.data.data._id
            navigate(`/orders/${orderId}`)

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

                <div style={s.layout}>

                    {/* Cột trái — Form thông tin */}
                    <div>
                        <div style={s.card}>
                            <h3 style={s.cardTitle}>Thông tin nhận hàng</h3>

                            {error && <div style={s.errorBox}>{error}</div>}

                            <form onSubmit={handleSubmit}>
                                {[
                                    { name: 'name', label: 'Họ tên', placeholder: 'Nguyễn Văn A', type: 'text' },
                                    { name: 'phone', label: 'Số điện thoại', placeholder: '0901234567', type: 'text' },
                                    { name: 'address', label: 'Địa chỉ', placeholder: '123 Lê Lợi, Q1...', type: 'text' },
                                ].map(field => (
                                    <div key={field.name} style={s.formGroup}>
                                        <label style={s.label}>{field.label}</label>
                                        <input
                                            style={s.input}
                                            type={field.type}
                                            name={field.name}
                                            placeholder={field.placeholder}
                                            value={form[field.name]}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                ))}

                                <div style={s.formGroup}>
                                    <label style={s.label}>Phương thức thanh toán</label>
                                    <select
                                        style={s.input}
                                        name='paymentMethod'
                                        value={form.paymentMethod}
                                        onChange={handleChange}
                                    >
                                        <option value='COD'>💵 Thanh toán khi nhận hàng (COD)</option>
                                        <option value='BANKING'>🏦 Chuyển khoản ngân hàng</option>
                                    </select>
                                </div>

                                <div style={s.formGroup}>
                                    <label style={s.label}>Ghi chú (tuỳ chọn)</label>
                                    <textarea
                                        style={{ ...s.input, height: 80, resize: 'vertical' }}
                                        name='note'
                                        placeholder='Giao buổi sáng, gọi trước khi giao...'
                                        value={form.note}
                                        onChange={handleChange}
                                    />
                                </div>

                                <button
                                    type='submit'
                                    style={{ ...s.btnPrimary, opacity: loading ? 0.7 : 1 }}
                                    disabled={loading || items.length === 0}
                                >
                                    {loading ? 'Đang xử lý...' : '✓ Xác nhận đặt hàng'}
                                </button>

                                <button
                                    type='button'
                                    style={s.btnSecondary}
                                    onClick={() => navigate('/cart')}
                                >
                                    ← Quay lại giỏ hàng
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Cột phải — Tóm tắt đơn */}
                    <div style={s.summary}>
                        <h3 style={s.cardTitle}>Đơn hàng của bạn</h3>

                        {items.map((item, idx) => (
                            <div key={idx} style={s.summaryItem}>
                                <div style={s.summaryItemLeft}>
                                    <img
                                        src={item.product?.image || item.image}
                                        alt={item.product?.name || item.name}
                                        style={s.thumb}
                                        onError={e => { e.target.src = 'https://placehold.co/48x48/f5f0eb/6f4e37?text=☕' }}
                                    />
                                    <div>
                                        <div style={s.itemName}>
                                            {item.product?.name || item.name}
                                        </div>
                                        <div style={s.itemMeta}>x{item.quantity}</div>
                                    </div>
                                </div>
                                <div style={s.itemTotal}>
                                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                </div>
                            </div>
                        ))}

                        <div style={s.divider} />

                        <div style={s.totalRow}>
                            <span style={s.totalLabel}>Phí giao hàng</span>
                            <span style={{ color: '#1b7f3a', fontSize: 13 }}>Miễn phí</span>
                        </div>

                        <div style={{ ...s.totalRow, fontWeight: 700, fontSize: 17, marginTop: 8 }}>
                            <span>Tổng cộng</span>
                            <span style={{ color: '#6f4e37' }}>
                                {totalAmount.toLocaleString('vi-VN')}đ
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

const s = {
    page: { background: '#f5f0eb', minHeight: '100vh', padding: '32px 0' },
    container: { maxWidth: 960, margin: '0 auto', padding: '0 24px' },
    title: { fontSize: 26, fontWeight: 600, color: '#1a0f0a', marginBottom: 24 },
    layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' },
    loading: { padding: 40, textAlign: 'center', color: '#8b7355' },

    card: { background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', padding: 24, marginBottom: 16 },
    cardTitle: { fontSize: 15, fontWeight: 600, color: '#1a0f0a', margin: '0 0 20px' },

    formGroup: { marginBottom: 16 },
    label: { display: 'block', fontSize: 12, fontWeight: 500, color: '#8b7355', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
    input: { width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #e8ddd5', fontSize: 14, background: '#f5f0eb', boxSizing: 'border-box', outline: 'none' },

    btnPrimary: { width: '100%', padding: '13px', background: '#6f4e37', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 10 },
    btnSecondary: { width: '100%', padding: '11px', background: '#fff', color: '#8b7355', border: '1px solid #e8ddd5', borderRadius: 10, fontSize: 14, cursor: 'pointer' },

    errorBox: { background: '#fde8e8', color: '#b42318', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 },

    summary: { background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', padding: 24, position: 'sticky', top: 80 },
    summaryItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    summaryItemLeft: { display: 'flex', alignItems: 'center', gap: 10, flex: 1 },
    thumb: { width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 },
    itemName: { fontSize: 13, fontWeight: 500, color: '#1a0f0a' },
    itemMeta: { fontSize: 12, color: '#8b7355', marginTop: 2 },
    itemTotal: { fontSize: 13, fontWeight: 600, color: '#6f4e37', flexShrink: 0 },
    divider: { borderTop: '1px solid #e8ddd5', margin: '16px 0' },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 },
    totalLabel: { color: '#8b7355' },
}