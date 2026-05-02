// src/pages/user/OrderDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getOrderByIdApi } from '../../api/orderApi'

const STATUS_MAP = {
    pending: { label: 'Chờ xác nhận', bg: '#fef3e2', color: '#b45309' },
    confirmed: { label: 'Đã xác nhận', bg: '#e6f1fb', color: '#1565c0' },
    preparing: { label: 'Đang pha chế', bg: '#f3e8ff', color: '#6a1b9a' },
    completed: { label: 'Hoàn thành', bg: '#e7f8ec', color: '#1b7f3a' },
    cancelled: { label: 'Đã huỷ', bg: '#fde8e8', color: '#b42318' },
}

// Timeline hiển thị tiến trình đơn hàng
const TIMELINE = ['pending', 'confirmed', 'preparing', 'completed']

export default function OrderDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        getOrderByIdApi(id)
            .then(res => setOrder(res.data.data))
            .catch(err => setError(err.response?.data?.message || 'Không tìm thấy đơn hàng'))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <p style={s.loading}>Đang tải...</p>
    if (error) return <p style={{ ...s.loading, color: '#b42318' }}>{error}</p>
    if (!order) return null

    const status = STATUS_MAP[order.status] || { label: order.status, bg: '#f0f0f0', color: '#888' }
    const currentStep = TIMELINE.indexOf(order.status)

    return (
        <div style={s.page}>
            <div style={s.container}>

                {/* Breadcrumb */}
                <div style={s.breadcrumb}>
                    <button style={s.backBtn} onClick={() => navigate('/orders')}>
                        ← Lịch sử đơn hàng
                    </button>
                </div>

                {/* Header */}
                <div style={s.header}>
                    <div>
                        <h1 style={s.title}>
                            Đơn hàng #{order._id.slice(-8).toUpperCase()}
                        </h1>
                        <p style={s.subtitle}>
                            Đặt lúc {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </p>
                    </div>
                    <span style={{ ...s.statusBadge, background: status.bg, color: status.color }}>
                        {status.label}
                    </span>
                </div>

                {/* Timeline tiến trình — chỉ hiện khi chưa huỷ */}
                {order.status !== 'cancelled' && (
                    <div style={s.card}>
                        <h3 style={s.cardTitle}>Tiến trình đơn hàng</h3>
                        <div style={s.timeline}>
                            {TIMELINE.map((step, idx) => {
                                const done = idx <= currentStep
                                const current = idx === currentStep
                                const info = STATUS_MAP[step]
                                return (
                                    <div key={step} style={s.timelineStep}>
                                        <div style={{
                                            ...s.timelineDot,
                                            background: done ? '#6f4e37' : '#e8ddd5',
                                            border: current ? '3px solid #6f4e37' : '3px solid transparent',
                                            boxShadow: current ? '0 0 0 3px #f5f0eb' : 'none',
                                        }} />
                                        <div style={{ ...s.timelineLabel, color: done ? '#1a0f0a' : '#8b7355', fontWeight: current ? 600 : 400 }}>
                                            {info.label}
                                        </div>
                                        {idx < TIMELINE.length - 1 && (
                                            <div style={{ ...s.timelineLine, background: idx < currentStep ? '#6f4e37' : '#e8ddd5' }} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                <div style={s.layout}>

                    {/* Cột trái */}
                    <div>
                        {/* Sản phẩm đã đặt */}
                        <div style={s.card}>
                            <h3 style={s.cardTitle}>Sản phẩm đã đặt</h3>
                            {order.items.map((item, idx) => (
                                <div key={idx} style={s.itemRow}>
                                    <div style={s.itemLeft}>
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                style={s.thumb}
                                                onError={e => { e.target.src = 'https://placehold.co/56x56/f5f0eb/6f4e37?text=☕' }}
                                            />
                                        )}
                                        <div>
                                            <div style={s.itemName}>{item.name}</div>
                                            <div style={s.itemMeta}>
                                                {item.price.toLocaleString('vi-VN')}đ × {item.quantity}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={s.itemTotal}>
                                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                    </div>
                                </div>
                            ))}

                            <div style={s.divider} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 17 }}>
                                <span>Tổng cộng</span>
                                <span style={{ color: '#6f4e37' }}>
                                    {order.totalAmount.toLocaleString('vi-VN')}đ
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Cột phải */}
                    <div>
                        {/* Thông tin giao hàng */}
                        <div style={s.card}>
                            <h3 style={s.cardTitle}>Thông tin nhận hàng</h3>
                            {[
                                { label: 'Họ tên', value: order.shippingInfo?.fullName }, // ← đúng field
                                { label: 'SĐT', value: order.shippingInfo?.phone },
                                { label: 'Địa chỉ', value: order.shippingInfo?.address },
                            ].map(row => (
                                <div key={row.label} style={s.infoRow}>
                                    <span style={s.infoLabel}>{row.label}</span>
                                    <span style={s.infoValue}>{row.value || '—'}</span>
                                </div>
                            ))}
                        </div>

                        {/* Thông tin đơn */}
                        <div style={s.card}>
                            <h3 style={s.cardTitle}>Thông tin thanh toán</h3>
                            {[
                                { label: 'Phương thức', value: order.paymentMethod },
                                { label: 'Phí giao hàng', value: <span style={{ color: '#1b7f3a' }}>Miễn phí</span> },
                            ].map(row => (
                                <div key={row.label} style={s.infoRow}>
                                    <span style={s.infoLabel}>{row.label}</span>
                                    <span style={s.infoValue}>{row.value}</span>
                                </div>
                            ))}
                            {order.note && (
                                <div style={s.noteBox}>
                                    <span style={s.infoLabel}>Ghi chú</span>
                                    <p style={s.noteText}>{order.note}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <button style={s.menuBtn} onClick={() => navigate('/menu')}>
                    ☕ Tiếp tục đặt hàng
                </button>
            </div>
        </div>
    )
}

const s = {
    page: { background: '#f5f0eb', minHeight: '100vh', padding: '32px 0' },
    container: { maxWidth: 900, margin: '0 auto', padding: '0 24px' },
    loading: { padding: 40, textAlign: 'center', color: '#8b7355' },

    breadcrumb: { marginBottom: 16 },
    backBtn: { background: 'none', border: 'none', color: '#6f4e37', fontSize: 14, cursor: 'pointer', padding: 0, fontWeight: 500 },

    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
    title: { fontSize: 24, fontWeight: 600, color: '#1a0f0a', margin: '0 0 4px' },
    subtitle: { fontSize: 13, color: '#8b7355', margin: 0 },
    statusBadge: { fontSize: 13, fontWeight: 500, padding: '6px 16px', borderRadius: 20 },

    // Timeline
    card: { background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', padding: 24, marginBottom: 16 },
    cardTitle: { fontSize: 14, fontWeight: 600, color: '#1a0f0a', margin: '0 0 18px' },
    timeline: { display: 'flex', alignItems: 'flex-start', gap: 0 },
    timelineStep: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' },
    timelineDot: { width: 14, height: 14, borderRadius: '50%', marginBottom: 8, zIndex: 1 },
    timelineLabel: { fontSize: 11, textAlign: 'center', lineHeight: 1.3 },
    timelineLine: { position: 'absolute', top: 7, left: '50%', width: '100%', height: 2, zIndex: 0 },

    layout: { display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 },

    // Items
    itemRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f0eb' },
    itemLeft: { display: 'flex', alignItems: 'center', gap: 12 },
    thumb: { width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 },
    itemName: { fontSize: 14, fontWeight: 500, color: '#1a0f0a', marginBottom: 4 },
    itemMeta: { fontSize: 12, color: '#8b7355' },
    itemTotal: { fontSize: 14, fontWeight: 600, color: '#6f4e37' },
    divider: { borderTop: '1px solid #e8ddd5', margin: '16px 0' },

    // Info
    infoRow: { display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f5f0eb' },
    infoLabel: { fontSize: 12, color: '#8b7355' },
    infoValue: { fontSize: 13, fontWeight: 500, color: '#1a0f0a', textAlign: 'right', maxWidth: '60%' },
    noteBox: { paddingTop: 10 },
    noteText: { fontSize: 13, color: '#1a0f0a', margin: '4px 0 0', lineHeight: 1.5 },

    menuBtn: { display: 'block', margin: '8px auto 0', padding: '12px 32px', background: '#6f4e37', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer', fontWeight: 500 },
}