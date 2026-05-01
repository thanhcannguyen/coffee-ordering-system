
import { useEffect, useState } from 'react'
import {
    getAllOrdersApi,
    updateOrderStatusApi
} from '../../api/orderApi'

const AdminOrders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchOrders = async () => {
        try {
            const res = await getAllOrdersApi()
            setOrders(res.data.data)
        } catch (error) {
            console.error(error)
            alert('Lỗi tải danh sách đơn')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    // ===============================
    // Update status
    // ===============================
    const handleUpdateStatus = async (id, status) => {
        try {
            await updateOrderStatusApi(id, status)
            alert('Cập nhật thành công')
            fetchOrders()
        } catch (error) {
            console.error(error)
            alert('Lỗi cập nhật trạng thái')
        }
    }

    if (loading) return <p style={{ padding: 20 }}>Đang tải...</p>

    return (
        <div style={{ padding: 20 }}>
            <h2 style={{ color: '#6f4e37' }}>Quản lý đơn hàng</h2>

            {orders.map(order => (
                <div key={order._id} style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>{order._id.slice(-6)}</strong>
                        <span style={{ color: getStatusColor(order.status) }}>
                            {order.status}
                        </span>
                    </div>

                    <p>User: {order.user?.email || 'N/A'}</p>
                    <p>Tổng: {order.totalAmount} đ</p>

                    <select
                        value={order.status}
                        onChange={(e) =>
                            handleUpdateStatus(order._id, e.target.value)
                        }
                        style={selectStyle}
                    >
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="preparing">preparing</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                    </select>
                </div>
            ))}
        </div>
    )
}

const cardStyle = {
    background: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    border: '1px solid #e8ddd5'
}

const selectStyle = {
    marginTop: 10,
    padding: 8,
    borderRadius: 5,
    border: '1px solid #ccc'
}

const getStatusColor = (status) => {
    switch (status) {
        case 'pending':
            return '#b08968'
        case 'confirmed':
            return '#6f4e37'
        case 'preparing':
            return '#a98467'
        case 'completed':
            return 'green'
        case 'cancelled':
            return 'red'
        default:
            return '#333'
    }
}

export default AdminOrders