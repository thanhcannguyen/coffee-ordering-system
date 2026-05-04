
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
    const [form, setForm] = useState({
        name: '',
        phone: '',
        address: '',
        paymentMethod: 'COD',
        note: '',
    })

    const items = cart?.items ?? []
    const totalAmount = cart?.totalAmount ?? 0

    // Cuộn về đầu + khóa scroll trang
    useEffect(() => {
        window.scrollTo(0, 0)
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (items.length === 0) { setError('Gio hang dang trong'); return }
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
            setError(err.response?.data?.message || 'Dat hang that bai')
        } finally {
            setLoading(false)
        }
    }

    if (!cart) return <p style={s.loading}>Dang tai...</p>

    return (
        <div style={s.page}>
            <div style={s.container}>
                <h1 style={s.title}>Thanh toán</h1>

                <div style={s.layout}>

                    {/* Cột trái — Form */}
                    <div style={s.formCard}>
                        <h3 style={s.cardTitle}>Thông tin nhận hàng</h3>

                        {error && <div style={s.errorBox}>{error}</div>}

                        <div style={s.formGrid}>
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
                        </div>

                        <div style={s.formGroup}>
                            <label style={s.label}>Phương thức thanh toán</label>
                            <select style={s.input} name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                                <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                                <option value="BANKING">Chuyển khoản ngân hàng</option>
                            </select>
                        </div>

                        <div style={s.formGroup}>
                            <label style={s.label}>Ghi chú (tuỳ chọn)</label>
                            <textarea
                                style={{ ...s.input, height: 70, resize: 'none' }}
                                name="note"
                                placeholder="Giao buổi sáng, gọi trước khi giao..."
                                value={form.note}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={s.btnRow}>
                            <button type="button" style={s.btnSecondary} onClick={() => navigate('/cart')}>
                                ← Giỏ hàng
                            </button>
                            <button
                                type="button"
                                style={{ ...s.btnPrimary, opacity: loading ? 0.7 : 1 }}
                                disabled={loading || items.length === 0}
                                onClick={handleSubmit}
                            >
                                {loading ? 'Đang xử lý...' : '✓ Xác nhận đặt hàng'}
                            </button>
                        </div>
                    </div>

                    {/* Cột phải — Tóm tắt đơn */}
                    <div style={s.summary}>
                        <h3 style={s.cardTitle}>Đơn hàng của bạn</h3>

                        {/* Danh sách món — có scroll */}
                        <div style={s.itemScroll}>
                            {items.map((item, idx) => (
                                <div key={idx} style={s.summaryItem}>
                                    <div style={s.summaryItemLeft}>
                                        <img
                                            src={item.product?.image || item.image}
                                            alt={item.product?.name || item.name}
                                            style={s.thumb}
                                            onError={e => { e.target.src = 'https://placehold.co/44x44/f5f0eb/6f4e37?text=Coffee' }}
                                        />
                                        <div>
                                            <div style={s.itemName}>{item.product?.name || item.name}</div>
                                            <div style={s.itemMeta}>x{item.quantity}</div>
                                        </div>
                                    </div>
                                    <div style={s.itemTotal}>
                                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tổng — cố định, không scroll */}
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
    page: {
        background: '#ede8e2',
        minHeight: '100vh',
        padding: '22px 0 40px',
    },
    container: {
        maxWidth: 1010,
        margin: '0 auto',
        padding: '0 24px',
    },
    title: { fontSize: 24, fontWeight: 700, color: '#1a0f0a', marginBottom: 16 },
    loading: { padding: 40, textAlign: 'center', color: '#8b7355' },

    // Layout 2 cột
    layout: {
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: 20,
        alignItems: 'start',
    },

    // Form card — nhỏ gọn
    formCard: {
        background: '#fff',
        borderRadius: 14,
        border: '2px solid #c9b49a',
        boxShadow: '0 2px 16px rgba(111,78,55,0.10)',
        padding: '20px 24px',
    },
    cardTitle: { fontSize: 15, fontWeight: 700, color: '#1a0f0a', margin: '0 0 16px' },

    // 2 cột cho họ tên + sdt
    formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0 16px',
    },
    formGroup: { marginBottom: 12 },
    label: {
        display: 'block', fontSize: 11, fontWeight: 600,
        color: '#6f4e37', marginBottom: 5,
        textTransform: 'uppercase', letterSpacing: 0.5,
    },
    input: {
        width: '100%', padding: '9px 12px',
        borderRadius: 8, border: '1.5px solid #e0d3c8',
        fontSize: 13, background: '#faf7f4',
        boxSizing: 'border-box', outline: 'none',
        color: '#1a0f0a',
    },

    btnRow: { display: 'flex', gap: 10, marginTop: 4 },
    btnPrimary: {
        flex: 2, padding: '12px',
        background: '#6f4e37', color: '#fff',
        border: 'none', borderRadius: 10,
        fontSize: 14, fontWeight: 700, cursor: 'pointer',
    },
    btnSecondary: {
        flex: 1, padding: '12px',
        background: '#fff', color: '#8b7355',
        border: '1.5px solid #d4c4b4', borderRadius: 10,
        fontSize: 14, cursor: 'pointer',
    },
    errorBox: {
        background: '#fde8e8', color: '#b42318',
        padding: '10px 14px', borderRadius: 8,
        fontSize: 13, marginBottom: 12,
    },

    // Summary card
    summary: {
        background: '#fff',
        borderRadius: 14,
        border: '2px solid #c9b49a',
        boxShadow: '0 2px 16px rgba(111,78,55,0.10)',
        padding: '20px 24px',
    },

    // Vùng cuộn danh sách món
    itemScroll: {
        overflowY: 'auto',
        maxHeight: 340,
        marginRight: -8,
        paddingRight: 8,
    },

    summaryItem: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 12,
    },
    summaryItemLeft: { display: 'flex', alignItems: 'center', gap: 10, flex: 1 },
    thumb: { width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 },
    itemName: { fontSize: 13, fontWeight: 600, color: '#1a0f0a' },
    itemMeta: { fontSize: 12, color: '#8b7355', marginTop: 2 },
    itemTotal: { fontSize: 13, fontWeight: 700, color: '#6f4e37', flexShrink: 0 },

    divider: { borderTop: '1.5px solid #e8ddd5', margin: '12px 0' },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 },
    totalLabel: { color: '#8b7355' },
}