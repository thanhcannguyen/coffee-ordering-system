// src/pages/admin/Orders.jsx
import { useState, useEffect } from 'react'
import Topbar from '../../components/admin/Topbar'
import { getAllOrdersApi, updateOrderStatusApi } from '../../api/orderApi'

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

    const fetchOrders = () => {
        setLoading(true)
        getAllOrdersApi()
            .then(res => setOrders(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchOrders() }, [])

    const handleUpdateStatus = async (orderId, status) => {
        setUpdatingId(orderId)
        try {
            await updateOrderStatusApi(orderId, status)
            setSuccess('Cập nhật trạng thái thành công')
            setTimeout(() => setSuccess(''), 2500)
            fetchOrders()
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi cập nhật trạng thái')
        } finally {
            setUpdatingId(null)
        }
    }

    // Filter phía frontend
    const filtered = orders.filter(o => {
        const matchStatus = filterStatus === 'all' || o.status === filterStatus
        const matchSearch = o._id.includes(search)
            || o.user?.name?.toLowerCase().includes(search.toLowerCase())
            || o.user?.email?.toLowerCase().includes(search.toLowerCase())
        return matchStatus && matchSearch
    })

    return (
        <div>
            <Topbar title='Quản lý đơn hàng' />
            <div style={s.body}>

                {/* Filter bar */}
                <div style={s.filterBar}>
                    <input
                        style={s.searchInput}
                        placeholder='Tìm theo mã đơn, tên, email...'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />

                    {/* Filter nhanh theo status */}
                    <div style={s.statusFilters}>
                        <button
                            style={filterStatus === 'all' ? s.filterBtnActive : s.filterBtn}
                            onClick={() => setFilterStatus('all')}
                        >
                            Tất cả ({orders.length})
                        </button>
                        {Object.entries(STATUS_MAP).map(([key, info]) => (
                            <button
                                key={key}
                                style={filterStatus === key ? s.filterBtnActive : s.filterBtn}
                                onClick={() => setFilterStatus(key)}
                            >
                                {info.label} ({orders.filter(o => o.status === key).length})
                            </button>
                        ))}
                    </div>
                </div>

                {success && <div style={s.successBox}>{success}</div>}

                {/* Bảng đơn hàng */}
                <div style={s.tableCard}>
                    {loading ? (
                        <p style={s.center}>Đang tải...</p>
                    ) : filtered.length === 0 ? (
                        <p style={s.center}>Không có đơn hàng nào</p>
                    ) : (
                        <table style={s.table}>
                            <thead>
                                <tr style={s.theadRow}>
                                    {['Mã đơn', 'Khách hàng', 'Sản phẩm', 'Tổng tiền', 'Trạng thái', 'Thao tác'].map(h => (
                                        <th key={h} style={s.th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(order => {
                                    const status = STATUS_MAP[order.status]
                                    const nextSt = NEXT_STATUS[order.status]
                                    const nextInfo = nextSt ? STATUS_MAP[nextSt] : null
                                    const isUpdating = updatingId === order._id

                                    return (
                                        <tr key={order._id} style={s.tr}>

                                            {/* Mã đơn + ngày */}
                                            <td style={s.td}>
                                                <div style={s.orderId}>#{order._id.slice(-8).toUpperCase()}</div>
                                                <div style={s.orderDate}>
                                                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                                </div>
                                            </td>

                                            {/* Khách hàng */}
                                            <td style={s.td}>
                                                <div style={s.userName}>{order.user?.name || '—'}</div>
                                                <div style={s.userEmail}>{order.user?.email || '—'}</div>
                                            </td>

                                            {/* Sản phẩm tóm tắt */}
                                            <td style={s.td}>
                                                <div style={s.itemsText}>
                                                    {order.items.slice(0, 2).map(i => `${i.name} x${i.quantity}`).join(', ')}
                                                    {order.items.length > 2 && ` +${order.items.length - 2} món`}
                                                </div>
                                                <div style={s.itemCount}>{order.items.length} loại</div>
                                            </td>

                                            {/* Tổng tiền */}
                                            <td style={s.td}>
                                                <div style={s.amount}>
                                                    {order.totalAmount.toLocaleString('vi-VN')}đ
                                                </div>
                                                <div style={s.payMethod}>{order.paymentMethod}</div>
                                            </td>

                                            {/* Trạng thái */}
                                            <td style={s.td}>
                                                <span style={{ ...s.badge, background: status?.bg, color: status?.color }}>
                                                    {status?.label}
                                                </span>
                                            </td>

                                            {/* Thao tác */}
                                            <td style={s.td}>
                                                {nextInfo && (
                                                    <button
                                                        style={{
                                                            ...s.nextBtn,
                                                            opacity: isUpdating ? 0.6 : 1,
                                                            background: nextInfo.bg,
                                                            color: nextInfo.color,
                                                        }}
                                                        onClick={() => handleUpdateStatus(order._id, nextSt)}
                                                        disabled={isUpdating}
                                                    >
                                                        {isUpdating ? '...' : `→ ${nextInfo.label}`}
                                                    </button>
                                                )}
                                                {order.status !== 'cancelled' && order.status !== 'completed' && (
                                                    <button
                                                        style={s.cancelBtn}
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
                    )}
                </div>

            </div>
        </div>
    )
}

const s = {
    body: { padding: 28 },
    center: { textAlign: 'center', color: '#8b7355', padding: 32, fontSize: 14 },

    filterBar: { marginBottom: 16 },
    searchInput: { padding: '9px 14px', borderRadius: 8, border: '1px solid #e8ddd5', fontSize: 14, background: '#fff', width: 300, outline: 'none', marginBottom: 12, display: 'block' },
    statusFilters: { display: 'flex', gap: 8, flexWrap: 'wrap' },
    filterBtn: { padding: '6px 14px', borderRadius: 20, border: '1px solid #e8ddd5', background: '#fff', color: '#8b7355', fontSize: 12, cursor: 'pointer' },
    filterBtnActive: { padding: '6px 14px', borderRadius: 20, border: '1px solid #6f4e37', background: '#6f4e37', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 500 },

    successBox: { background: '#e7f8ec', color: '#1b7f3a', padding: '10px 16px', borderRadius: 8, fontSize: 13, marginBottom: 16 },

    tableCard: { background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    theadRow: { background: '#f5f0eb' },
    th: { padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#8b7355', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #e8ddd5' },
    tr: { borderBottom: '1px solid #f5f0eb' },
    td: { padding: '14px 16px', fontSize: 13, verticalAlign: 'middle' },

    orderId: { fontWeight: 600, color: '#1a0f0a', marginBottom: 2 },
    orderDate: { fontSize: 11, color: '#8b7355' },
    userName: { fontWeight: 500, color: '#1a0f0a', marginBottom: 2 },
    userEmail: { fontSize: 11, color: '#8b7355' },
    itemsText: { fontSize: 12, color: '#1a0f0a', marginBottom: 2 },
    itemCount: { fontSize: 11, color: '#8b7355' },
    amount: { fontWeight: 600, color: '#6f4e37', marginBottom: 2 },
    payMethod: { fontSize: 11, color: '#8b7355' },

    badge: { fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 20, whiteSpace: 'nowrap' },
    nextBtn: { display: 'block', padding: '6px 12px', borderRadius: 7, border: 'none', fontSize: 12, cursor: 'pointer', fontWeight: 500, marginBottom: 6, whiteSpace: 'nowrap' },
    cancelBtn: { display: 'block', padding: '5px 12px', borderRadius: 7, border: 'none', background: '#fde8e8', color: '#b42318', fontSize: 12, cursor: 'pointer' },
    finalText: { fontSize: 12, color: '#8b7355' },
}