
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrderApi } from '../../api/orderApi'
import { getCartApi } from '../../api/cartApi'

const Checkout = () => {
    const navigate = useNavigate()

    const [cart, setCart] = useState(null)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        name: '',
        phone: '',
        address: '',
        paymentMethod: 'COD',
        note: ''
    })

    // ===============================
    // Fetch cart
    // ===============================
    const fetchCart = async () => {
        try {
            const res = await getCartApi()
            setCart(res.data.cart)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchCart()
    }, [])

    // ===============================
    // Handle input
    // ===============================
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    // ===============================
    // Handle submit
    // ===============================
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!cart || cart.items.length === 0) {
            alert('Giỏ hàng trống')
            return
        }

        try {
            setLoading(true)

            const res = await createOrderApi({
                shippingInfo: {
                    fullName: form.name,
                    phone: form.phone,
                    address: form.address
                },
                paymentMethod: form.paymentMethod,
                note: form.note
            })

            alert('Đặt hàng thành công')

            const orderId = res.data.data._id

            navigate(`/orders/${orderId}`)

        } catch (error) {
            console.error(error)
            alert(error.response?.data?.message || 'Lỗi tạo đơn')
        } finally {
            setLoading(false)
        }
    }

    if (!cart) return <p style={{ padding: 20 }}>Đang tải...</p>

    return (
        <div style={{ padding: 20, maxWidth: 1000, margin: 'auto' }}>
            <h2 style={{ color: '#6f4e37' }}>Thanh toán</h2>

            {/* CART */}
            <div style={{
                background: '#fff',
                padding: 20,
                borderRadius: 10,
                marginBottom: 20,
                border: '1px solid #e8ddd5'
            }}>
                <h3>Giỏ hàng</h3>

                {cart.items.map(item => (
                    <div key={item.product} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 10
                    }}>
                        <span>{item.name} x {item.quantity}</span>
                        <span>{item.price * item.quantity} đ</span>
                    </div>
                ))}

                <hr />

                <h4>Tổng: {cart.totalAmount} đ</h4>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} style={{
                background: '#fff',
                padding: 20,
                borderRadius: 10,
                border: '1px solid #e8ddd5'
            }}>
                <h3>Thông tin nhận hàng</h3>

                <input
                    name="name"
                    placeholder="Tên"
                    value={form.name}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <input
                    name="phone"
                    placeholder="SĐT"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <input
                    name="address"
                    placeholder="Địa chỉ"
                    value={form.address}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                    style={inputStyle}
                >
                    <option value="COD">Thanh toán khi nhận hàng</option>
                    <option value="BANKING">Chuyển khoản</option>
                </select>

                <textarea
                    name="note"
                    placeholder="Ghi chú"
                    value={form.note}
                    onChange={handleChange}
                    style={{ ...inputStyle, height: 80 }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        marginTop: 10,
                        padding: '10px 20px',
                        background: '#6f4e37',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 5,
                        cursor: 'pointer'
                    }}
                >
                    {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                </button>
            </form>
        </div>
    )
}

const inputStyle = {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    border: '1px solid #ccc'
}

export default Checkout