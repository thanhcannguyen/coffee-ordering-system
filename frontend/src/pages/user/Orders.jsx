
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyOrdersApi } from '../../api/orderApi'

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const fetchOrders = async () => {
        try {
            const res = await getMyOrdersApi()
            setOrders(res.data.data)
        } catch (error) {
            console.error(error)
            alert('Lỗi tải đơn hàng')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    if (loading) return <p style={{ padding: 20 }}>Đang tải...</p>

    return (
        <div style={{ padding: 20, maxWidth: 1000, margin: 'auto' }}>
            <h2 style={{ color: '#6f4e37' }}>Lịch sử đơn hàng</h2>

            {orders.length === 0 ? (
                <p>Chưa có đơn hàng nào</p>
            ) : (
                orders.map(order => (
                    <div
                        key={order._id}
                        style={{
                            background: '#fff',
                            padding: 20,
                            marginBottom: 15,
                            borderRadius: 10,
                            border: '1px solid #e8ddd5',
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate(`/orders/${order._id}`)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>Mã đơn: {order._id.slice(-6)}</strong>
                            <span style={{ color: getStatusColor(order.status) }}>
                                {order.status}
                            </span>
                        </div>

                        <p>Ngày đặt: {new Date(order.createdAt).toLocaleString()}</p>
                        <p>Tổng tiền: {order.totalAmount} đ</p>
                    </div>
                ))
            )}
        </div>
    )
}

// ===============================
// Status color helper
// ===============================
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

export default Orders