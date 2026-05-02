// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Topbar from '../../components/admin/Topbar'
import { getCategories } from '../../api/categoryApi'
import { getProducts } from '../../api/productApi'
import { getAllUsers } from '../../api/userApi'
import { getAllOrdersApi } from '../../api/orderApi'

const STATUS_MAP = {
    pending: { label: 'Chờ xác nhận', color: '#b45309', bg: '#fef3e2' },
    confirmed: { label: 'Đã xác nhận', color: '#1565c0', bg: '#e6f1fb' },
    preparing: { label: 'Đang pha chế', color: '#6a1b9a', bg: '#f3e8ff' },
    completed: { label: 'Hoàn thành', color: '#1b7f3a', bg: '#e7f8ec' },
    cancelled: { label: 'Đã huỷ', color: '#b42318', bg: '#fde8e8' },
}

export default function Dashboard() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({
        categories: 0,
        products: 0,
        users: 0,
        orders: [],
    })

    useEffect(() => {
        Promise.all([
            getCategories(),
            getProducts(),
            getAllUsers(),
            getAllOrdersApi(),
        ])
            .then(([catRes, proRes, userRes, orderRes]) => {
                setData({
                    categories: catRes.data.total,
                    products: proRes.data.total,
                    users: userRes.data.total,
                    orders: orderRes.data.data,
                })
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    // Tính toán từ orders
    const orders = data.orders
    const totalRevenue = orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.totalAmount, 0)

    const orderByStatus = Object.keys(STATUS_MAP).reduce((acc, key) => {
        acc[key] = orders.filter(o => o.status === key).length
        return acc
    }, {})

    // 5 đơn mới nhất
    const recentOrders = [...orders].slice(0, 5)

    const statCards = [
        { label: 'Tổng doanh thu', value: totalRevenue.toLocaleString('vi-VN') + 'đ', icon: '💰', color: '#1b7f3a', note: 'Từ đơn hoàn thành' },
        { label: 'Tổng đơn hàng', value: orders.length, icon: '📋', color: '#1565c0', note: `${orderByStatus.pending || 0} chờ xử lý` },
        { label: 'Người dùng', value: data.users, icon: '👤', color: '#6a1b9a', note: 'Đã đăng ký' },
        { label: 'Sản phẩm', value: data.products, icon: '☕', color: '#6f4e37', note: `${data.categories} danh mục` },
    ]

    if (loading) return (
        <div>
            <Topbar title='Dashboard' />
            <p style={s.loading}>Đang tải dữ liệu...</p>
        </div>
    )

    return (
        <div>
            <Topbar title='Dashboard' />
            <div style={s.body}>

                {/* Stats cards */}
                <div style={s.statsGrid}>
                    {statCards.map(card => (
                        <div key={card.label} style={s.statCard}>
                            <div style={s.statTop}>
                                <div>
                                    <div style={s.statLabel}>{card.label}</div>
                                    <div style={{ ...s.statValue, color: card.color }}>{card.value}</div>
                                </div>
                                <div style={{ ...s.statIcon, background: card.color + '18' }}>
                                    {card.icon}
                                </div>
                            </div>
                            <div style={s.statNote}>{card.note}</div>
                        </div>
                    ))}
                </div>

                <div style={s.layout}>

                    {/* Đơn hàng theo trạng thái */}
                    <div style={s.card}>
                        <div style={s.cardHeader}>
                            <h3 style={s.cardTitle}>Đơn hàng theo trạng thái</h3>
                            <button style={s.linkBtn} onClick={() => navigate('/admin/orders')}>
                                Xem tất cả →
                            </button>
                        </div>

                        {Object.entries(STATUS_MAP).map(([key, info]) => {
                            const count = orderByStatus[key] || 0
                            const percent = orders.length > 0 ? (count / orders.length) * 100 : 0

                            return (
                                <div key={key} style={s.statusRow}>
                                    <div style={s.statusLeft}>
                                        <span style={{ ...s.statusDot, background: info.color }} />
                                        <span style={s.statusLabel}>{info.label}</span>
                                    </div>
                                    <div style={s.statusBar}>
                                        <div style={{
                                            ...s.statusFill,
                                            width: `${percent}%`,
                                            background: info.color,
                                        }} />
                                    </div>
                                    <span style={s.statusCount}>{count}</span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Đơn hàng gần đây */}
                    <div style={s.card}>
                        <div style={s.cardHeader}>
                            <h3 style={s.cardTitle}>Đơn hàng gần đây</h3>
                            <button style={s.linkBtn} onClick={() => navigate('/admin/orders')}>
                                Xem tất cả →
                            </button>
                        </div>

                        {recentOrders.length === 0 ? (
                            <p style={s.empty}>Chưa có đơn hàng nào</p>
                        ) : (
                            recentOrders.map(order => {
                                const status = STATUS_MAP[order.status]
                                return (
                                    <div key={order._id} style={s.orderRow}>
                                        <div style={s.orderLeft}>
                                            <div style={s.orderId}>#{order._id.slice(-6).toUpperCase()}</div>
                                            <div style={s.orderUser}>{order.user?.name || order.user?.email || '—'}</div>
                                        </div>
                                        <div style={s.orderRight}>
                                            <span style={{ ...s.badge, background: status?.bg, color: status?.color }}>
                                                {status?.label}
                                            </span>
                                            <div style={s.orderAmount}>
                                                {order.totalAmount.toLocaleString('vi-VN')}đ
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

const s = {
    body: { padding: 28 },
    loading: { padding: 40, textAlign: 'center', color: '#8b7355' },

    // Stats
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 },
    statCard: { background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', padding: '20px 22px' },
    statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
    statLabel: { fontSize: 12, color: '#8b7355', marginBottom: 6 },
    statValue: { fontSize: 24, fontWeight: 700 },
    statIcon: { width: 42, height: 42, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 },
    statNote: { fontSize: 11, color: '#8b7355' },

    // Layout 2 cột
    layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
    card: { background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', padding: 22 },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
    cardTitle: { fontSize: 14, fontWeight: 600, color: '#1a0f0a', margin: 0 },
    linkBtn: { background: 'none', border: 'none', color: '#6f4e37', fontSize: 12, cursor: 'pointer', fontWeight: 500 },
    empty: { color: '#8b7355', fontSize: 13, textAlign: 'center', padding: '20px 0' },

    // Status bar chart
    statusRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
    statusLeft: { display: 'flex', alignItems: 'center', gap: 7, width: 120, flexShrink: 0 },
    statusDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
    statusLabel: { fontSize: 12, color: '#1a0f0a' },
    statusBar: { flex: 1, height: 6, background: '#f5f0eb', borderRadius: 3, overflow: 'hidden' },
    statusFill: { height: '100%', borderRadius: 3, transition: 'width 0.4s ease', minWidth: 2 },
    statusCount: { fontSize: 12, fontWeight: 600, color: '#1a0f0a', width: 24, textAlign: 'right', flexShrink: 0 },

    // Recent orders
    orderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f0eb' },
    orderLeft: {},
    orderId: { fontSize: 13, fontWeight: 600, color: '#1a0f0a', marginBottom: 2 },
    orderUser: { fontSize: 11, color: '#8b7355' },
    orderRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 },
    badge: { fontSize: 11, fontWeight: 500, padding: '2px 10px', borderRadius: 20 },
    orderAmount: { fontSize: 13, fontWeight: 600, color: '#6f4e37' },
}