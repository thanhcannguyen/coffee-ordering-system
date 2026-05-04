
// src/pages/user/Orders.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyOrdersApi } from '../../api/orderApi'

// Map status → tiếng Việt + màu + badge
const STATUS_MAP = {
    pending: { label: 'Chờ xác nhận', bg: '#fef3e2', color: '#b45309' },
    confirmed: { label: 'Đã xác nhận', bg: '#e6f1fb', color: '#1565c0' },
    preparing: { label: 'Đang pha chế', bg: '#f3e8ff', color: '#6a1b9a' },
    completed: { label: 'Hoàn thành', bg: '#e7f8ec', color: '#1b7f3a' },
    cancelled: { label: 'Đã huỷ', bg: '#fde8e8', color: '#b42318' },
}

export default function Orders() {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMyOrdersApi()
            .then(res => setOrders(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p style={s.loading}>Đang tải đơn hàng...</p>

    return (
        <div style={s.page}>
            <div style={s.container}>
                <h1 style={s.title}>Lịch sử đơn hàng</h1>

                {orders.length === 0 ? (
                    <div style={s.emptyBox}>
                        <div style={s.emptyIcon}>📋</div>
                        <p style={s.emptyText}>Bạn chưa có đơn hàng nào</p>
                        <button style={s.btnPrimary} onClick={() => navigate('/menu')}>
                            Đặt hàng ngay
                        </button>
                    </div>
                ) : (
                    <div style={s.list}>
                        {orders.map(order => {
                            const status = STATUS_MAP[order.status] || { label: order.status, bg: '#f0f0f0', color: '#888' }

                            return (
                                <div
                                    key={order._id}
                                    style={s.card}
                                    onClick={() => navigate(`/orders/${order._id}`)}
                                >
                                    {/* Header card */}
                                    <div style={s.cardHeader}>
                                        <div>
                                            <span style={s.orderId}>#{order._id.slice(-8).toUpperCase()}</span>
                                            <span style={s.orderDate}>
                                                {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                        <span style={{ ...s.badge, background: status.bg, color: status.color }}>
                                            {status.label}
                                        </span>
                                    </div>

                                    {/* Danh sách sản phẩm tóm tắt */}
                                    <div style={s.itemsPreview}>
                                        {order.items.slice(0, 3).map((item, idx) => (
                                            <span key={idx} style={s.itemTag}>
                                                {item.name} x{item.quantity}
                                            </span>
                                        ))}
                                        {order.items.length > 3 && (
                                            <span style={s.itemTag}>+{order.items.length - 3} món khác</span>
                                        )}
                                    </div>

                                    {/* Footer card */}
                                    <div style={s.cardFooter}>
                                        <span style={s.footerMeta}>
                                            {order.items.reduce((s, i) => s + i.quantity, 0)} món
                                            · {order.paymentMethod}
                                        </span>
                                        <span style={s.totalAmount}>
                                            {order.totalAmount.toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

const s = {
    page: { background: '#f5f0eb', minHeight: '100vh' },
    container: { maxWidth: 760, margin: '0 auto', padding: '0 24px' },
    title: { fontSize: 26, fontWeight: 600, color: '#1a0f0a', marginBottom: 24 },
    loading: { padding: 40, textAlign: 'center', color: '#8b7355' },
    list: { display: 'flex', flexDirection: 'column', gap: 14 },

    emptyBox: { textAlign: 'center', padding: '60px 0' },
    emptyIcon: { fontSize: 48, marginBottom: 14 },
    emptyText: { color: '#8b7355', fontSize: 15, marginBottom: 20 },
    btnPrimary: { padding: '12px 28px', background: '#6f4e37', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer', fontWeight: 500 },

    card: {
        background: '#fff', borderRadius: 12,
        border: '1px solid #e8ddd5', padding: '18px 20px',
        cursor: 'pointer', transition: 'box-shadow 0.15s',
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    orderId: { fontSize: 14, fontWeight: 600, color: '#1a0f0a', marginRight: 10 },
    orderDate: { fontSize: 12, color: '#8b7355' },
    badge: { fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 20, flexShrink: 0 },

    itemsPreview: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
    itemTag: { fontSize: 12, background: '#f5f0eb', color: '#6f4e37', padding: '3px 10px', borderRadius: 20 },

    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f5f0eb', paddingTop: 12 },
    footerMeta: { fontSize: 12, color: '#8b7355' },
    totalAmount: { fontSize: 16, fontWeight: 700, color: '#6f4e37' },
}