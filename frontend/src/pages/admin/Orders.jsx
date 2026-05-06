// src/pages/admin/Orders.jsx
import { useState, useEffect } from 'react'
import Topbar from '../../components/admin/Topbar'
import Pagination from '../../components/admin/Pagination'
import { getAllOrdersApi, updateOrderStatusApi } from '../../api/orderApi'

const ITEMS_PER_PAGE = 4
const STATUS_MAP = {
    pending: { label: 'Chờ xác nhận', color: '#b45309', bg: '#fef3e2' },
    confirmed: { label: 'Đã xác nhận', color: '#1565c0', bg: '#e6f1fb' },
    preparing: { label: 'Đang pha chế', color: '#6a1b9a', bg: '#f3e8ff' },
    completed: { label: 'Hoàn thành', color: '#1b7f3a', bg: '#e7f8ec' },
    cancelled: { label: 'Đã huỷ', color: '#b42318', bg: '#fde8e8' },
}
const NEXT_STATUS = { pending: 'confirmed', confirmed: 'preparing', preparing: 'completed' }

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    useEffect(() => {
        const h = () => setIsMobile(window.innerWidth <= 768)
        window.addEventListener('resize', h)
        return () => window.removeEventListener('resize', h)
    }, [])
    return isMobile
}

export default function AdminOrders() {
    const isMobile = useIsMobile()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')
    const [search, setSearch] = useState('')
    const [updatingId, setUpdatingId] = useState(null)
    const [success, setSuccess] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const fetchOrders = () => {
        setLoading(true)
        getAllOrdersApi().then(res => setOrders(res.data.data)).catch(console.error).finally(() => setLoading(false))
    }
    useEffect(() => { fetchOrders() }, [])

    const filtered = orders.filter(o => {
        const matchStatus = filterStatus === 'all' || o.status === filterStatus
        const matchSearch = o._id.includes(search) || o.user?.name?.toLowerCase().includes(search.toLowerCase()) || o.user?.email?.toLowerCase().includes(search.toLowerCase())
        return matchStatus && matchSearch
    })
    useEffect(() => { setCurrentPage(1) }, [search, filterStatus])

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    const handleUpdateStatus = async (orderId, status) => {
        setUpdatingId(orderId)
        try {
            await updateOrderStatusApi(orderId, status)
            setSuccess('Cập nhật trạng thái thành công')
            setTimeout(() => setSuccess(''), 2500)
            fetchOrders()
        } catch (err) { alert(err.response?.data?.message || 'Lỗi cập nhật') }
        finally { setUpdatingId(null) }
    }

    return (
        <div>
            <Topbar title='Quản lý đơn hàng' />
            <div style={{ padding: isMobile ? '14px 12px' : '20px 24px' }}>

                {/* Search */}
                <input className='admin-search-input' style={{ display: 'block', marginBottom: 10, width: '100%', boxSizing: 'border-box' }}
                    placeholder='Tìm theo mã đơn, tên, email...' value={search} onChange={e => setSearch(e.target.value)} />

                {/* Filter buttons — 2 hàng trên mobile, 1 hàng trên desktop */}
                {isMobile ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 12 }}>
                        <button className={`admin-filter-btn${filterStatus === 'all' ? ' active' : ''}`}
                            style={{ textAlign: 'center', fontSize: 11, padding: '6px 4px', whiteSpace: 'normal', lineHeight: 1.3 }}
                            onClick={() => setFilterStatus('all')}>
                            Tất cả ({orders.length})
                        </button>
                        {Object.entries(STATUS_MAP).map(([key, info]) => (
                            <button key={key} className={`admin-filter-btn${filterStatus === key ? ' active' : ''}`}
                                style={{ textAlign: 'center', fontSize: 11, padding: '6px 4px', whiteSpace: 'normal', lineHeight: 1.3 }}
                                onClick={() => setFilterStatus(key)}>
                                {info.label} ({orders.filter(o => o.status === key).length})
                            </button>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingBottom: 4, marginBottom: 12 }}>
                        <button className={`admin-filter-btn${filterStatus === 'all' ? ' active' : ''}`}
                            style={{ whiteSpace: 'nowrap' }}
                            onClick={() => setFilterStatus('all')}>
                            Tất cả ({orders.length})
                        </button>
                        {Object.entries(STATUS_MAP).map(([key, info]) => (
                            <button key={key} className={`admin-filter-btn${filterStatus === key ? ' active' : ''}`}
                                style={{ whiteSpace: 'nowrap' }}
                                onClick={() => setFilterStatus(key)}>
                                {info.label} ({orders.filter(o => o.status === key).length})
                            </button>
                        ))}
                    </div>
                )}

                {success && <div style={{ background: '#e7f8ec', color: '#1b7f3a', padding: '10px 16px', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>{success}</div>}

                {loading ? <p style={{ color: '#8b7355', textAlign: 'center', padding: 32 }}>Đang tải...</p> :
                    filtered.length === 0 ? <p style={{ color: '#8b7355', textAlign: 'center', padding: 32 }}>Không có đơn hàng nào</p> : (
                        <>
                            {isMobile ? (
                                // Mobile: card list
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {paginated.map(order => {
                                        const status = STATUS_MAP[order.status]
                                        const nextSt = NEXT_STATUS[order.status]
                                        const nextInfo = nextSt ? STATUS_MAP[nextSt] : null
                                        const isUpdating = updatingId === order._id
                                        return (
                                            <div key={order._id} style={s.orderCard}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: 13, color: '#1a0f0a' }}>#{order._id.slice(-8).toUpperCase()}</div>
                                                        <div style={{ fontSize: 11, color: '#8b7355' }}>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                                                    </div>
                                                    <span style={{ fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 20, background: status?.bg, color: status?.color }}>{status?.label}</span>
                                                </div>
                                                <div style={{ fontSize: 12, color: '#8b7355', marginBottom: 4 }}>👤 {order.user?.name || '—'} · {order.user?.email || ''}</div>
                                                <div style={{ fontSize: 12, color: '#1a0f0a', marginBottom: 6 }}>
                                                    {order.items.slice(0, 2).map(i => `${i.name} x${i.quantity}`).join(', ')}
                                                    {order.items.length > 2 && ` +${order.items.length - 2} món`}
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontWeight: 700, color: '#6f4e37', fontSize: 14 }}>{order.totalAmount.toLocaleString('vi-VN')}đ</span>
                                                    <div style={{ display: 'flex', gap: 6 }}>
                                                        {nextInfo && (
                                                            <button className='admin-next-btn' style={{ background: nextInfo.bg, color: nextInfo.color, opacity: isUpdating ? 0.6 : 1, fontSize: 11 }}
                                                                onClick={() => handleUpdateStatus(order._id, nextSt)} disabled={isUpdating}>
                                                                {isUpdating ? '...' : `→ ${nextInfo.label}`}
                                                            </button>
                                                        )}
                                                        {order.status !== 'cancelled' && order.status !== 'completed' && (
                                                            <button className='admin-cancel-btn' style={{ fontSize: 11 }} onClick={() => handleUpdateStatus(order._id, 'cancelled')} disabled={isUpdating}>Huỷ</button>
                                                        )}
                                                        {(order.status === 'completed' || order.status === 'cancelled') && (
                                                            <span style={{ fontSize: 11, color: '#8b7355' }}>{order.status === 'completed' ? '✓ Xong' : '✗ Đã huỷ'}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                // Desktop: table
                                <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ background: '#f7e2cd' }}>
                                                {['Mã đơn', 'Khách hàng', 'Sản phẩm', 'Tổng tiền', 'Trạng thái', 'Thao tác'].map(h => (
                                                    <th key={h} style={s.th}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginated.map(order => {
                                                const status = STATUS_MAP[order.status]
                                                const nextSt = NEXT_STATUS[order.status]
                                                const nextInfo = nextSt ? STATUS_MAP[nextSt] : null
                                                const isUpdating = updatingId === order._id
                                                return (
                                                    <tr key={order._id} className='admin-tr'>
                                                        <td style={s.td}>
                                                            <div style={{ fontWeight: 600 }}>#{order._id.slice(-8).toUpperCase()}</div>
                                                            <div style={{ fontSize: 11, color: '#8b7355' }}>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                                                        </td>
                                                        <td style={s.td}>
                                                            <div style={{ fontWeight: 500 }}>{order.user?.name || '—'}</div>
                                                            <div style={{ fontSize: 11, color: '#8b7355' }}>{order.user?.email || ''}</div>
                                                        </td>
                                                        <td style={s.td}>
                                                            <div style={{ fontSize: 12 }}>{order.items.slice(0, 2).map(i => `${i.name} x${i.quantity}`).join(', ')}{order.items.length > 2 && ` +${order.items.length - 2}`}</div>
                                                        </td>
                                                        <td style={s.td}>
                                                            <div style={{ fontWeight: 600, color: '#6f4e37' }}>{order.totalAmount.toLocaleString('vi-VN')}đ</div>
                                                            <div style={{ fontSize: 11, color: '#8b7355' }}>{order.paymentMethod}</div>
                                                        </td>
                                                        <td style={{ ...s.td, textAlign: 'center' }}>
                                                            <span style={{ fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 20, background: status?.bg, color: status?.color, whiteSpace: 'nowrap' }}>{status?.label}</span>
                                                        </td>
                                                        <td style={{ ...s.td, textAlign: 'center' }}>
                                                            {nextInfo && <button className='admin-next-btn' style={{ background: nextInfo.bg, color: nextInfo.color, opacity: isUpdating ? 0.6 : 1 }} onClick={() => handleUpdateStatus(order._id, nextSt)} disabled={isUpdating}>{isUpdating ? '...' : `→ ${nextInfo.label}`}</button>}
                                                            {order.status !== 'cancelled' && order.status !== 'completed' && <button className='admin-cancel-btn' onClick={() => handleUpdateStatus(order._id, 'cancelled')} disabled={isUpdating}>Huỷ</button>}
                                                            {(order.status === 'completed' || order.status === 'cancelled') && <span style={{ fontSize: 12, color: '#8b7355' }}>{order.status === 'completed' ? '✓ Xong' : '✗ Đã huỷ'}</span>}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        </>
                    )}
            </div>
        </div>
    )
}

const s = {
    orderCard: { background: '#fff', borderRadius: 10, border: '1px solid #e8ddd5', padding: '14px 14px' },
    th: { padding: '11px 14px', fontSize: 11, fontWeight: 700, color: '#5a3e2b', textTransform: 'uppercase', letterSpacing: 0.7, borderBottom: '2px solid #e8ddd5', textAlign: 'left' },
    td: { padding: '12px 14px', fontSize: 13, color: '#1a0f0a', verticalAlign: 'middle', borderBottom: '1px solid #f5f0eb' },
}