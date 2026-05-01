
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function Cart() {
    const navigate = useNavigate()
    const { cart, loading, updateItem, removeItem, clearCart } = useCart()

    const items = cart?.items ?? []
    const totalAmount = cart?.totalAmount ?? 0

    if (loading) return <p style={s.center}>Đang tải giỏ hàng...</p>

    return (
        <div style={s.page}>
            <div style={s.container}>
                <h1 style={s.title}>Giỏ hàng của bạn</h1>

                {items.length === 0 ? (

                    /* Giỏ hàng rỗng */
                    <div style={s.emptyBox}>
                        <div style={s.emptyIcon}>🛒</div>
                        <p style={s.emptyText}>Giỏ hàng đang trống</p>
                        <button style={s.btnPrimary} onClick={() => navigate('/menu')}>
                            Xem thực đơn
                        </button>
                    </div>

                ) : (
                    <div style={s.layout}>

                        {/* Danh sách items */}
                        <div style={s.itemList}>

                            {/* Header bảng */}
                            <div style={s.tableHead}>
                                <span style={{ flex: 3 }}>Sản phẩm</span>
                                <span style={{ flex: 1, textAlign: 'center' }}>Số lượng</span>
                                <span style={{ flex: 1, textAlign: 'right' }}>Thành tiền</span>
                                <span style={{ width: 40 }}></span>
                            </div>

                            {items.map(item => {
                                const product = item.product
                                const subtotal = item.price * item.quantity

                                return (
                                    <div key={product._id} style={s.itemRow}>

                                        {/* Ảnh + tên */}
                                        <div style={{ ...s.itemCell, flex: 3 }}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                style={s.thumb}
                                                onError={e => { e.target.src = 'https://placehold.co/60x60/f5f0eb/6f4e37?text=☕' }}
                                            />
                                            <div>
                                                <div style={s.itemName}>{product.name}</div>
                                                <div style={s.itemPrice}>
                                                    {item.price.toLocaleString('vi-VN')}đ / cái
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tăng giảm số lượng */}
                                        <div style={{ ...s.itemCell, flex: 1, justifyContent: 'center' }}>
                                            <div style={s.qtyRow}>
                                                <button
                                                    style={s.qtyBtn}
                                                    onClick={() => updateItem(product._id, item.quantity - 1)}
                                                >
                                                    −
                                                </button>
                                                <span style={s.qtyNum}>{item.quantity}</span>
                                                <button
                                                    style={s.qtyBtn}
                                                    onClick={() => updateItem(product._id, item.quantity + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Thành tiền */}
                                        <div style={{ flex: 1, textAlign: 'right', fontWeight: 600, color: '#6f4e37', fontSize: 15 }}>
                                            {subtotal.toLocaleString('vi-VN')}đ
                                        </div>

                                        {/* Nút xóa */}
                                        <button
                                            style={s.removeBtn}
                                            onClick={() => removeItem(product._id)}
                                            title='Xóa sản phẩm'
                                        >
                                            ✕
                                        </button>

                                    </div>
                                )
                            })}

                            {/* Nút xóa hết */}
                            <div style={{ padding: '12px 0', textAlign: 'right' }}>
                                <button style={s.clearBtn} onClick={clearCart}>
                                    Xóa toàn bộ giỏ hàng
                                </button>
                            </div>
                        </div>

                        {/* Tóm tắt đơn hàng */}
                        <div style={s.summary}>
                            <h3 style={s.summaryTitle}>Tóm tắt đơn hàng</h3>

                            <div style={s.summaryRow}>
                                <span style={s.summaryLabel}>Số lượng sản phẩm</span>
                                <span>
                                    {items.reduce((sum, i) => sum + i.quantity, 0)} món
                                </span>
                            </div>

                            <div style={s.summaryRow}>
                                <span style={s.summaryLabel}>Tạm tính</span>
                                <span>{totalAmount.toLocaleString('vi-VN')}đ</span>
                            </div>

                            <div style={s.summaryRow}>
                                <span style={s.summaryLabel}>Phí giao hàng</span>
                                <span style={{ color: '#1b7f3a' }}>Miễn phí</span>
                            </div>

                            <div style={s.divider} />

                            <div style={{ ...s.summaryRow, fontWeight: 700, fontSize: 17 }}>
                                <span>Tổng cộng</span>
                                <span style={{ color: '#6f4e37' }}>
                                    {totalAmount.toLocaleString('vi-VN')}đ
                                </span>
                            </div>

                            {/*
                Nút Đặt hàng
                → Giai đoạn 4 sẽ navigate sang /checkout
                → Checkout tạo order rồi clearCart
              */}
                            <button
                                style={s.checkoutBtn}
                                onClick={() => navigate('/checkout')}
                            >
                                Đặt hàng ngay →
                            </button>

                            <button
                                style={s.continueBtn}
                                onClick={() => navigate('/menu')}
                            >
                                Tiếp tục mua hàng
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}

const s = {
    page: { background: '#f5f0eb', minHeight: '100vh', padding: '32px 0' },
    container: { maxWidth: 1000, margin: '0 auto', padding: '0 24px' },
    title: { fontSize: 26, fontWeight: 600, color: '#1a0f0a', marginBottom: 24 },
    center: { textAlign: 'center', padding: 60, color: '#8b7355' },

    // Giỏ rỗng
    emptyBox: { textAlign: 'center', padding: '60px 0' },
    emptyIcon: { fontSize: 56, marginBottom: 16 },
    emptyText: { color: '#8b7355', fontSize: 16, marginBottom: 24 },

    // Layout 2 cột
    layout: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' },

    // Danh sách items
    itemList: { background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', overflow: 'hidden' },
    tableHead: {
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 20px', background: '#f5f0eb',
        fontSize: 12, fontWeight: 600, color: '#8b7355',
        textTransform: 'uppercase', letterSpacing: 0.5,
        borderBottom: '1px solid #e8ddd5',
    },
    itemRow: {
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 20px', borderBottom: '1px solid #f5f0eb',
    },
    itemCell: { display: 'flex', alignItems: 'center', gap: 12 },
    thumb: { width: 56, height: 56, borderRadius: 8, objectFit: 'cover', flexShrink: 0 },
    itemName: { fontSize: 14, fontWeight: 500, color: '#1a0f0a', marginBottom: 4 },
    itemPrice: { fontSize: 12, color: '#8b7355' },

    // Số lượng
    qtyRow: { display: 'flex', alignItems: 'center', gap: 8 },
    qtyBtn: {
        width: 28, height: 28, borderRadius: 6,
        border: '1px solid #e8ddd5', background: '#f5f0eb',
        cursor: 'pointer', fontSize: 16, fontWeight: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#6f4e37',
    },
    qtyNum: { fontSize: 15, fontWeight: 600, minWidth: 24, textAlign: 'center' },
    removeBtn: {
        width: 28, height: 28, borderRadius: 6,
        border: 'none', background: '#fde8e8',
        color: '#b42318', cursor: 'pointer', fontSize: 13,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    clearBtn: {
        background: 'none', border: 'none',
        color: '#b42318', fontSize: 13, cursor: 'pointer',
        textDecoration: 'underline',
    },

    // Summary
    summary: { background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', padding: 24 },
    summaryTitle: { fontSize: 16, fontWeight: 600, color: '#1a0f0a', marginBottom: 20 },
    summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 12 },
    summaryLabel: { color: '#8b7355' },
    divider: { borderTop: '1px solid #e8ddd5', margin: '16px 0' },
    checkoutBtn: {
        width: '100%', padding: '13px', marginTop: 20,
        background: '#6f4e37', color: '#fff',
        border: 'none', borderRadius: 10,
        fontSize: 15, fontWeight: 600, cursor: 'pointer',
        marginBottom: 10,
    },
    continueBtn: {
        width: '100%', padding: '11px',
        background: '#fff', color: '#8b7355',
        border: '1px solid #e8ddd5', borderRadius: 10,
        fontSize: 14, cursor: 'pointer',
    },
    btnPrimary: {
        padding: '12px 32px', background: '#6f4e37',
        color: '#fff', border: 'none', borderRadius: 10,
        fontSize: 15, cursor: 'pointer', fontWeight: 500,
    },
}