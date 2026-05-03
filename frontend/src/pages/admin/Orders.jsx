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

const NEXT_STATUS = {
    pending: 'confirmed',
    confirmed: 'preparing',
    preparing: 'completed',
}

export default function AdminOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')
    const [search, setSearch] = useState('')
    const [updatingId, setUpdatingId] = useState(null)
    const [success, setSuccess] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const fetchOrders = () => {
        setLoading(true)
        getAllOrdersApi()
            .then(res => setOrders(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchOrders() }, [])

    const filtered = orders.filter(o => {
        const matchStatus = filterStatus === 'all' || o.status === filterStatus
        const matchSearch = o._id.includes(search)
            || o.user?.name?.toLowerCase().includes(search.toLowerCase())
            || o.user?.email?.toLowerCase().includes(search.toLowerCase())
        return matchStatus && matchSearch
    })

    useEffect(() => { setCurrentPage(1) }, [search, filterStatus])

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
    const paginated = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const handleUpdateStatus = async (orderId, status) => {
        setUpdatingId(orderId)
        try {
            await updateOrderStatusApi(orderId, status)
            setSuccess('Cập nhật trạng thái thành công')
            setTimeout(() => setSuccess(''), 2500)
            fetchOrders()
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi cập nhật')
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <div>
            <Topbar title='Quản lý đơn hàng' />
            <div style={s.body}>

                <div style={s.filterBar}>
                    <input
                        className='admin-search-input'
                        style={{ display: 'block', marginBottom: 12, width: 300 }}
                        placeholder='Tìm theo mã đơn, tên, email...'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <div style={s.statusFilters}>
                        <button
                            className={`admin-filter-btn${filterStatus === 'all' ? ' active' : ''}`}
                            style={s.filterBtn}
                            onClick={() => setFilterStatus('all')}
                        >
                            Tất cả ({orders.length})
                        </button>
                        {Object.entries(STATUS_MAP).map(([key, info]) => (
                            <button
                                key={key}
                                className={`admin-filter-btn${filterStatus === key ? ' active' : ''}`}
                                style={s.filterBtn}
                                onClick={() => setFilterStatus(key)}
                            >
                                {info.label} ({orders.filter(o => o.status === key).length})
                            </button>
                        ))}
                    </div>
                </div>

                {success && <div style={s.successBox}>{success}</div>}

                <div style={s.tableCard}>
                    {loading ? (
                        <p style={s.center}>Đang tải...</p>
                    ) : filtered.length === 0 ? (
                        <p style={s.center}>Không có đơn hàng nào</p>
                    ) : (
                        <>
                            <table style={s.table}>
                                <thead>
                                    <tr style={s.theadRow}>
                                        <th style={{ ...s.th, width: '15%', textAlign: 'center' }}>Mã đơn</th>
                                        <th style={{ ...s.th, width: '18%', textAlign: 'center' }}>Khách hàng</th>
                                        <th style={{ ...s.th, width: '25%', textAlign: 'center' }}>Sản phẩm</th>
                                        <th style={{ ...s.th, width: '13%', textAlign: 'center' }}>Tổng tiền</th>
                                        <th style={{ ...s.th, width: '14%', textAlign: 'center' }}>Trạng thái</th>
                                        <th style={{ ...s.th, width: '15%', textAlign: 'center' }}>Thao tác</th>
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
                                                <td style={{ ...s.td, minWidth: 130, textAlign: 'center' }}>
                                                    <div style={s.orderId}>#{order._id.slice(-8).toUpperCase()}</div>
                                                    <div style={s.orderDate}>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                                                </td>
                                                <td style={{ ...s.td, minWidth: 160, maxWidth: 180, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    <div style={s.userName}>{order.user?.name || '—'}</div>
                                                    <div style={s.userEmail}>{order.user?.email || '—'}</div>
                                                </td>
                                                <td style={{ ...s.td, minWidth: 180, maxWidth: 220, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    <div style={s.itemsText}>
                                                        {order.items.slice(0, 2).map(i => `${i.name} x${i.quantity}`).join(', ')}
                                                        {order.items.length > 2 && ` +${order.items.length - 2} món`}
                                                    </div>
                                                    <div style={s.itemCount}>{order.items.length} loại</div>
                                                </td>
                                                <td style={{ ...s.td, minWidth: 110, textAlign: 'center' }}>
                                                    <div style={s.amount}>{order.totalAmount.toLocaleString('vi-VN')}đ</div>
                                                    <div style={s.payMethod}>{order.paymentMethod}</div>
                                                </td>
                                                <td style={{ ...s.td, minWidth: 130, textAlign: 'center' }}>
                                                    <span style={{ ...s.badge, background: status?.bg, color: status?.color }}>
                                                        {status?.label}
                                                    </span>
                                                </td>
                                                <td style={{ ...s.td, minWidth: 140, textAlign: 'center' }}>
                                                    {nextInfo && (
                                                        <button
                                                            className='admin-next-btn'
                                                            style={{ background: nextInfo.bg, color: nextInfo.color, opacity: isUpdating ? 0.6 : 1 }}
                                                            onClick={() => handleUpdateStatus(order._id, nextSt)}
                                                            disabled={isUpdating}
                                                        >
                                                            {isUpdating ? '...' : `→ ${nextInfo.label}`}
                                                        </button>
                                                    )}
                                                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                                                        <button
                                                            className='admin-cancel-btn'
                                                            onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                                                            disabled={isUpdating}
                                                        >
                                                            Huỷ
                                                        </button>
                                                    )}
                                                    {(order.status === 'completed' || order.status === 'cancelled') && (
                                                        <span style={s.finalText}>
                                                            {order.status === 'completed' ? '✓ Xong' : '✗ Đã huỷ'}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <div style={{ padding: '0 16px' }}>
                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

const s = {
    body: { padding: '20px 24px' },
    center: { textAlign: 'center', color: '#8b7355', padding: 32, fontSize: 14 },
    filterBar: { marginBottom: 16 },
    statusFilters: { display: 'flex', gap: 8, flexWrap: 'wrap' },
    filterBtn: { fontWeight: 700, fontSize: 13 },
    successBox: { background: '#e7f8ec', color: '#1b7f3a', padding: '10px 16px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
    tableCard: { background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    theadRow: { background: '#f7e2cd' },
    th: { padding: '11px 16px', fontSize: 12, fontWeight: 700, color: '#5a3e2b', textTransform: 'uppercase', letterSpacing: 0.7, borderBottom: '2px solid #e8ddd5' },
    td: { padding: '13px 16px', fontSize: 13, verticalAlign: 'middle', color: '#1a0f0a' },
    orderId: { fontWeight: 600, color: '#1a0f0a', marginBottom: 2 },
    orderDate: { fontSize: 11, color: '#8b7355' },
    userName: { fontWeight: 500, color: '#1a0f0a', marginBottom: 2 },
    userEmail: { fontSize: 11, color: '#8b7355' },
    itemsText: { fontSize: 12, color: '#1a0f0a', marginBottom: 2 },
    itemCount: { fontSize: 11, color: '#8b7355' },
    amount: { fontWeight: 600, color: '#6f4e37', marginBottom: 2 },
    payMethod: { fontSize: 11, color: '#8b7355' },
    badge: { fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 20, whiteSpace: 'nowrap' },
    finalText: { fontSize: 12, color: '#8b7355' },
}