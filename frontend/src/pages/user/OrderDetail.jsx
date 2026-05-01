
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getOrderByIdApi } from '../../api/orderApi'

const OrderDetail = () => {
    const { id } = useParams()

    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchOrderDetail = async () => {
        try {
            const res = await getOrderByIdApi(id)
            setOrder(res.data.data)
        } catch (error) {
            console.error(error)
            alert(error.response?.data?.message || 'Lỗi tải chi tiết đơn hàng')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrderDetail()
    }, [id])

    if (loading) return <p style={{ padding: 20 }}>Đang tải...</p>
    if (!order) return <p style={{ padding: 20 }}>Không tìm thấy đơn hàng</p>

    return (
        <div style={{ padding: 20, maxWidth: 1000, margin: 'auto' }}>
            <h2 style={{ color: '#6f4e37' }}>Chi tiết đơn hàng</h2>

            <div style={cardStyle}>
                <h3>Thông tin đơn hàng</h3>
                <p><strong>Mã đơn:</strong> {order._id}</p>
                <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                <p>
                    <strong>Trạng thái:</strong>{' '}
                    <span style={{ color: getStatusColor(order.status), fontWeight: 600 }}>
                        {order.status}
                    </span>
                </p>
                <p><strong>Thanh toán:</strong> {order.paymentMethod}</p>
                {order.note && <p><strong>Ghi chú:</strong> {order.note}</p>}
            </div>

            <div style={cardStyle}>
                <h3>Thông tin nhận hàng</h3>
                <p><strong>Tên:</strong> {order.shippingInfo?.name}</p>
                <p><strong>SĐT:</strong> {order.shippingInfo?.phone}</p>
                <p><strong>Địa chỉ:</strong> {order.shippingInfo?.address}</p>
            </div>

            <div style={cardStyle}>
                <h3>Sản phẩm đã đặt</h3>

                {order.items.map((item, index) => (
                    <div key={index} style={itemStyle}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{
                                        width: 70,
                                        height: 70,
                                        objectFit: 'cover',
                                        borderRadius: 8,
                                        border: '1px solid #e8ddd5'
                                    }}
                                />
                            )}

                            <div>
                                <strong>{item.name}</strong>
                                <p style={{ margin: '4px 0', color: '#8b7355' }}>
                                    {item.price} đ x {item.quantity}
                                </p>
                            </div>
                        </div>

                        <strong>{item.price * item.quantity} đ</strong>
                    </div>
                ))}

                <hr />

                <h3 style={{ textAlign: 'right', color: '#6f4e37' }}>
                    Tổng tiền: {order.totalAmount} đ
                </h3>
            </div>
        </div>
    )
}

const cardStyle = {
    background: '#fff',
    padding: 20,
    borderRadius: 10,
    border: '1px solid #e8ddd5',
    marginBottom: 20
}

const itemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f0e6df'
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

export default OrderDetail