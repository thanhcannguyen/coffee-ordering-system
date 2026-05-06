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

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    useEffect(() => {
        const h = () => setIsMobile(window.innerWidth <= 768)
        window.addEventListener('resize', h)
        return () => window.removeEventListener('resize', h)
    }, [])
    return isMobile
}

export default function Dashboard() {
    const navigate = useNavigate()
    const isMobile = useIsMobile()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({ categories: 0, products: 0, users: 0, orders: [] })
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        Promise.all([getCategories(), getProducts(), getAllUsers(), getAllOrdersApi()])
            .then(([catRes, proRes, userRes, orderRes]) => {
                setData({ categories: catRes.data.total, products: proRes.data.total, users: userRes.data.total, orders: orderRes.data.data })
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const orders = data.orders
    const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0)
    const orderByStatus = Object.keys(STATUS_MAP).reduce((acc, key) => { acc[key] = orders.filter(o => o.status === key).length; return acc }, {})

    const statCards = [
        { label: 'Doanh thu', value: totalRevenue.toLocaleString('vi-VN') + 'đ', icon: '💰', color: '#1b7f3a', bg: '#e7f8ec', note: 'Từ đơn hoàn thành' },
        { label: 'Đơn hàng', value: orders.length, icon: '📋', color: '#1565c0', bg: '#e6f1fb', note: `${orderByStatus.pending || 0} chờ xử lý` },
        { label: 'Người dùng', value: data.users, icon: '👤', color: '#6a1b9a', bg: '#f3e8ff', note: 'Đã đăng ký' },
        { label: 'Sản phẩm', value: data.products, icon: '☕', color: '#6f4e37', bg: '#f5ece4', note: `${data.categories} danh mục` },
    ]

    const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE)
    const paginatedOrders = orders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    return (
        <div>
            <Topbar title='Dashboard' subtitle='Tổng quan hệ thống Coffee Order' />
            <div style={{ padding: isMobile ? '14px 12px' : '20px 24px' }}>

                {/* Stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: isMobile ? 10 : 16, marginBottom: 16 }}>
                    {statCards.map(card => (
                        <div key={card.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', padding: isMobile ? '14px 12px' : '18px 20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: 11, color: '#8b7355', marginBottom: 6 }}>{card.label}</div>
                                    <div style={{ fontSize: isMobile ? 16 : 22, fontWeight: 700, color: card.color, marginBottom: 4, wordBreak: 'break-all' }}>{card.value}</div>
                                    <div style={{ fontSize: 10, color: '#8b7355' }}>{card.note}</div>
                                </div>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>{card.icon}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Two cols → one col on mobile */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>

                    {/* Trạng thái */}
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', padding: isMobile ? '16px 14px' : '22px 24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a0f0a', margin: 0 }}>Đơn hàng theo trạng thái</h3>
                            <button style={{ background: 'none', border: 'none', color: '#6f4e37', fontSize: 12, cursor: 'pointer' }} onClick={() => navigate('/admin/orders')}>Xem tất cả →</button>
                        </div>
                        {Object.entries(STATUS_MAP).map(([key, info]) => {
                            const count = orderByStatus[key] || 0
                            const percent = orders.length > 0 ? (count / orders.length) * 100 : 0
                            return (
                                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: info.color, flexShrink: 0 }} />
                                    <span style={{ fontSize: 12, color: '#1a0f0a', width: isMobile ? 100 : 130, flexShrink: 0 }}>{info.label}</span>
                                    <div style={{ flex: 1, height: 8, background: '#f5f0eb', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{ width: `${percent}%`, height: '100%', background: info.color, borderRadius: 4, minWidth: count > 0 ? 4 : 0 }} />
                                    </div>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: info.color, width: 20, textAlign: 'right', flexShrink: 0 }}>{count}</span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Đơn hàng gần đây */}
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', padding: isMobile ? '16px 14px' : '22px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a0f0a', margin: 0 }}>Đơn hàng gần đây</h3>
                            <button style={{ background: 'none', border: 'none', color: '#6f4e37', fontSize: 12, cursor: 'pointer' }} onClick={() => navigate('/admin/orders')}>Xem tất cả →</button>
                        </div>
                        {loading ? <p style={{ color: '#8b7355', fontSize: 13 }}>Đang tải...</p> : orders.length === 0 ? <p style={{ color: '#8b7355', fontSize: 13 }}>Chưa có đơn hàng</p> : (
                            <>
                                {paginatedOrders.map(order => {
                                    const status = STATUS_MAP[order.status]
                                    return (
                                        <div key={order._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f0eb' }}>
                                            <div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a0f0a', marginBottom: 2 }}>#{order._id.slice(-6).toUpperCase()}</div>
                                                <div style={{ fontSize: 11, color: '#8b7355' }}>{order.user?.name || order.user?.email || '—'}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20, background: status?.bg, color: status?.color, display: 'inline-block', marginBottom: 4 }}>{status?.label}</span>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: '#6f4e37' }}>{order.totalAmount.toLocaleString('vi-VN')}đ</div>
                                            </div>
                                        </div>
                                    )
                                })}
                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}