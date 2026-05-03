// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Topbar from '../../components/admin/Topbar'
import Pagination from '../../components/admin/Pagination'
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

const ITEMS_PER_PAGE = 3

export default function Dashboard() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({ categories: 0, products: 0, users: 0, orders: [] })
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        Promise.all([getCategories(), getProducts(), getAllUsers(), getAllOrdersApi()])
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

    const orders = data.orders
    const totalRevenue = orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.totalAmount, 0)

    const orderByStatus = Object.keys(STATUS_MAP).reduce((acc, key) => {
        acc[key] = orders.filter(o => o.status === key).length
        return acc
    }, {})

    const statCards = [
        { label: 'Doanh thu', value: totalRevenue.toLocaleString('vi-VN') + 'đ', icon: '💰', color: '#1b7f3a', bg: '#e7f8ec', note: 'Từ đơn hoàn thành' },
        { label: 'Đơn hàng', value: orders.length, icon: '📋', color: '#1565c0', bg: '#e6f1fb', note: `${orderByStatus.pending || 0} chờ xử lý` },
        { label: 'Người dùng', value: data.users, icon: '👤', color: '#6a1b9a', bg: '#f3e8ff', note: 'Đã đăng ký' },
        { label: 'Sản phẩm', value: data.products, icon: '☕', color: '#6f4e37', bg: '#f5ece4', note: `${data.categories} danh mục` },
    ]

    const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE)
    const paginatedOrders = orders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    return (
        <div style={s.wrapper}>
            <Topbar title='Dashboard' subtitle='Tổng quan hệ thống Coffee Order' />
            <div style={s.body}>

                {/* Stat cards */}
                <div style={s.statsGrid}>
                    {statCards.map(card => (
                        <div key={card.label} className='admin-stat-card'>
                            <div style={s.statTop}>
                                <div>
                                    <div style={s.statLabel}>{card.label}</div>
                                    <div style={{ ...s.statValue, color: card.color }}>{card.value}</div>
                                    <div style={s.statNote}>{card.note}</div>
                                </div>
                                <div style={{ ...s.statIconBox, background: card.bg }}>
                                    <span style={{ fontSize: 22 }}>{card.icon}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={s.twoCol}>
                    {/* Đơn hàng theo trạng thái */}
                    <div style={s.cardLeft}>
                        <style>{`
                            @keyframes barGrow {
                                from { width: 0%; }
                                to { width: var(--bar-width); }
                            }
                            .animated-bar {
                                animation: barGrow 0.8s ease forwards;
                            }
                        `}</style>
                        <div style={s.cardHeader}>
                            <h3 style={s.cardTitle}>Đơn hàng theo trạng thái</h3>
                            <button style={s.linkBtn} onClick={() => navigate('/admin/orders')}>Xem tất cả →</button>
                        </div>
                        {Object.entries(STATUS_MAP).map(([key, info]) => {
                            const count = orderByStatus[key] || 0
                            const percent = orders.length > 0 ? (count / orders.length) * 100 : 0
                            return (
                                <div key={key} style={s.statusRow}>
                                    <div style={s.statusLeft}>
                                        <span style={{ ...s.dot, background: info.color }} />
                                        <span style={s.statusLabel}>{info.label}</span>
                                    </div>
                                    <div style={s.barTrack}>
                                        <div
                                            className='animated-bar'
                                            style={{
                                                ...s.barFill,
                                                '--bar-width': `${percent}%`,
                                                width: `${percent}%`,
                                                background: `linear-gradient(90deg, ${info.color}99, ${info.color})`,
                                            }}
                                        />
                                    </div>
                                    <span style={{ ...s.statusCount, color: info.color }}>{count}</span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Đơn hàng gần đây */}
                    <div style={s.card}>
                        <div style={s.cardHeader}>
                            <h3 style={s.cardTitle}>Đơn hàng gần đây</h3>
                            <button style={s.linkBtn} onClick={() => navigate('/admin/orders')}>Xem tất cả →</button>
                        </div>
                        {loading ? (
                            <p style={s.muted}>Đang tải...</p>
                        ) : orders.length === 0 ? (
                            <p style={s.muted}>Chưa có đơn hàng</p>
                        ) : (
                            <>
                                {paginatedOrders.map(order => {
                                    const status = STATUS_MAP[order.status]
                                    return (
                                        <div key={order._id} className='admin-order-row'>
                                            <div>
                                                <div style={s.orderId}>#{order._id.slice(-6).toUpperCase()}</div>
                                                <div style={s.orderUser}>{order.user?.name || order.user?.email || '—'}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ ...s.badge, background: status?.bg, color: status?.color }}>
                                                    {status?.label}
                                                </span>
                                                <div style={s.orderAmount}>
                                                    {order.totalAmount.toLocaleString('vi-VN')}đ
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const s = {
    wrapper: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
    body: { padding: '20px 24px', flex: 1, overflow: 'hidden', boxSizing: 'border-box' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 },
    statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    statLabel: { fontSize: 12, color: '#8b7355', marginBottom: 8 },
    statValue: { fontSize: 24, fontWeight: 700, marginBottom: 4 },
    statNote: { fontSize: 11, color: '#8b7355' },
    statIconBox: { width: 46, height: 46, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },

    twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, paddingBottom: 28, alignItems: 'stretch' },
    card: { background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', padding: 22, boxSizing: 'border-box' },
    cardLeft: { background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', padding: 28, boxSizing: 'border-box' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    cardTitle: { fontSize: 15, fontWeight: 700, color: '#1a0f0a', margin: 0 },
    linkBtn: { background: 'none', border: 'none', color: '#6f4e37', fontSize: 12, cursor: 'pointer', fontWeight: 500 },
    muted: { color: '#8b7355', fontSize: 13 },

    statusRow: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 },
    statusLeft: { display: 'flex', alignItems: 'center', gap: 10, width: 150, flexShrink: 0 },
    dot: { width: 11, height: 11, borderRadius: '50%', flexShrink: 0 },
    statusLabel: { fontSize: 14, color: '#1a0f0a', fontWeight: 500 },
    barTrack: { flex: 1, height: 10, background: '#f5f0eb', borderRadius: 6, overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: 6, minWidth: 4 },
    statusCount: { fontSize: 15, fontWeight: 700, width: 24, textAlign: 'right', flexShrink: 0 },

    orderId: { fontSize: 13, fontWeight: 600, color: '#1a0f0a', marginBottom: 2 },
    orderUser: { fontSize: 11, color: '#8b7355' },
    badge: { fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 4 },
    orderAmount: { fontSize: 13, fontWeight: 600, color: '#6f4e37' },
}