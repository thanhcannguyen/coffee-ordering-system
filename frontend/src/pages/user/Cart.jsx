
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function Cart() {
    const navigate = useNavigate()
    const { cart, loading, updateItem, removeItem, clearCart } = useCart()

    const items = cart?.items ?? []
    const totalAmount = cart?.totalAmount ?? 0

    // Scroll lên đầu trang + khóa scroll ngoài
    useEffect(() => {
        window.scrollTo(0, 0)
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    if (loading) return <p style={s.center}>Đang tải giỏ hàng...</p>

    return (
        <div style={s.page}>
            <div style={s.container}>
                <h1 style={s.title}>Giỏ hàng của bạn</h1>

                {items.length === 0 ? (
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

                            {/* Header bảng — cố định, không cuộn */}
                            <div style={s.tableHead}>
                                <span style={s.colProduct}>Sản phẩm</span>
                                <span style={s.colQty}>Số lượng</span>
                                <span style={s.colPrice}>Thành tiền</span>
                                <span style={s.colAction}></span>
                            </div>

                            {/* Vùng cuộn */}
                            <div style={s.scrollArea}>
                                {items.map(item => {
                                    const product = item.product
                                    const subtotal = item.price * item.quantity

                                    return (
                                        <div key={product._id} style={s.itemRow}>

                                            {/* Ảnh + tên */}
                                            <div style={{ ...s.itemCell, ...s.colProduct }}>
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    style={s.thumb}
                                                    onError={e => { e.target.src = 'https://placehold.co/60x60/f5f0eb/6f4e37?text=Coffee' }}
                                                />
                                                <div>
                                                    <div style={s.itemName}>{product.name}</div>
                                                    <div style={s.itemPrice}>
                                                        {item.price.toLocaleString('vi-VN')}đ / cái
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Số lượng */}
                                            <div style={{ ...s.itemCell, ...s.colQty, justifyContent: 'center' }}>
                                                <div style={s.qtyRow}>
                                                    <button
                                                        style={s.qtyBtn}
                                                        onClick={() => updateItem(product._id, item.quantity - 1)}
                                                    >−</button>
                                                    <span style={s.qtyNum}>{item.quantity}</span>
                                                    <button
                                                        style={s.qtyBtn}
                                                        onClick={() => updateItem(product._id, item.quantity + 1)}
                                                    >+</button>
                                                </div>
                                            </div>

                                            {/* Thành tiền */}
                                            <div style={{ ...s.colPrice, fontWeight: 700, color: '#4a2c17', fontSize: 15 }}>
                                                {subtotal.toLocaleString('vi-VN')}đ
                                            </div>

                                            {/* Xóa */}
                                            <div style={s.colAction}>
                                                <button
                                                    style={s.removeBtn}
                                                    onClick={() => removeItem(product._id)}
                                                    title="Xóa sản phẩm"
                                                >✕</button>
                                            </div>

                                        </div>
                                    )
                                })}
                            </div>

                            {/* Footer xóa hết */}
                            <div style={s.tableFooter}>
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
                                <span>{items.reduce((sum, i) => sum + i.quantity, 0)} món</span>
                            </div>

                            <div style={s.summaryRow}>
                                <span style={s.summaryLabel}>Tạm tính</span>
                                <span>{totalAmount.toLocaleString('vi-VN')}đ</span>
                            </div>

                            <div style={s.summaryRow}>
                                <span style={s.summaryLabel}>Phí giao hàng</span>
                                <span style={{ color: '#1b7f3a', fontWeight: 600 }}>Miễn phí</span>
                            </div>

                            <div style={s.divider} />

                            <div style={{ ...s.summaryRow, fontWeight: 700, fontSize: 17 }}>
                                <span>Tổng cộng</span>
                                <span style={{ color: '#6f4e37' }}>
                                    {totalAmount.toLocaleString('vi-VN')}đ
                                </span>
                            </div>

                            <button style={s.checkoutBtn} onClick={() => navigate('/checkout')}>
                                Đặt hàng ngay →
                            </button>

                            <button style={s.continueBtn} onClick={() => navigate('/menu')}>
                                Tiếp tục mua hàng
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}

// Định nghĩa chiều rộng cột dùng chung cho header và row
const COL = {
    product: { flex: '0 0 45%', display: 'flex', alignItems: 'center' },
    qty: { flex: '0 0 25%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
    price: { flex: '0 0 20%', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
    action: { flex: '0 0 10%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
}

const s = {
    page: {
        background: '#ede8e2',
        minHeight: '100vh',
        padding: '10px 0 40px',
    },
    container: {
        maxWidth: 1020,
        width: '100%',
        margin: '0 auto',
        padding: '0 24px',
    },
    title: { fontSize: 26, fontWeight: 700, color: '#1a0f0a', marginBottom: 20, flexShrink: 0, paddingTop: 0 },
    center: { textAlign: 'center', padding: 60, color: '#8b7355' },

    // Rỗng
    emptyBox: { textAlign: 'center', padding: '80px 0' },
    emptyIcon: { fontSize: 56, marginBottom: 16 },
    emptyText: { color: '#8b7355', fontSize: 16, marginBottom: 24 },

    layout: {
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: 20,
        alignItems: 'start',
    },

    itemList: {
        background: '#fff',
        borderRadius: 14,
        border: '2px solid #c9b49a',
        boxShadow: '0 2px 16px rgba(111,78,55,0.10)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },

    // Header cố định
    tableHead: {
        display: 'flex',
        alignItems: 'center',
        padding: '13px 20px',
        background: '#e8ddd3',              // nền header đậm hơn
        borderBottom: '2px solid #c9b49a',  // border đậm
        fontSize: 12,
        fontWeight: 800,                    // đậm hơn
        color: '#3d2410',                   // chữ tối hơn
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        flexShrink: 0,
    },

    // Cột — dùng COL object (gán bên dưới)
    colProduct: COL.product,
    colQty: COL.qty,
    colPrice: COL.price,
    colAction: COL.action,

    scrollArea: {
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 280px)',
    },

    itemRow: {
        display: 'flex',
        alignItems: 'center',
        padding: '14px 20px',
        borderBottom: '1px solid #f0e8e0',
        minHeight: 76,
    },
    itemCell: { display: 'flex', alignItems: 'center', gap: 12 },
    thumb: { width: 56, height: 56, borderRadius: 8, objectFit: 'cover', flexShrink: 0 },
    itemName: { fontSize: 14, fontWeight: 600, color: '#1a0f0a', marginBottom: 4 },
    itemPrice: { fontSize: 12, color: '#8b7355' },

    qtyRow: { display: 'flex', alignItems: 'center', gap: 6 },
    qtyBtn: {
        width: 28, height: 28, borderRadius: 6,
        border: '1.5px solid #d4c4b4', background: '#f5f0eb',
        cursor: 'pointer', fontSize: 16, fontWeight: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#6f4e37',
    },
    qtyNum: { fontSize: 15, fontWeight: 700, minWidth: 24, textAlign: 'center', color: '#1a0f0a' },

    removeBtn: {
        width: 30, height: 30, borderRadius: 8,
        border: 'none', background: '#fde8e8',
        color: '#b42318', cursor: 'pointer', fontSize: 13,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },

    tableFooter: {
        padding: '10px 20px',
        textAlign: 'right',
        borderTop: '1px solid #ede5dc',
        background: '#faf7f4',
        flexShrink: 0,
    },
    clearBtn: {
        background: 'none', border: 'none',
        color: '#b42318', fontSize: 13, cursor: 'pointer',
        textDecoration: 'underline',
    },

    // Summary
    summary: {
        background: '#fff', borderRadius: 14,
        border: '2px solid #c9b49a',
        boxShadow: '0 2px 16px rgba(111,78,55,0.10)',
        padding: 24,
        width: 320,
        flexShrink: 0,
        alignSelf: 'flex-start',
    },
    summaryTitle: { fontSize: 16, fontWeight: 700, color: '#1a0f0a', marginBottom: 20 },
    summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 12 },
    summaryLabel: { color: '#8b7355' },
    divider: { borderTop: '1.5px solid #e8ddd5', margin: '16px 0' },
    checkoutBtn: {
        width: '100%', padding: '13px', marginTop: 20,
        background: '#6f4e37', color: '#fff',
        border: 'none', borderRadius: 10,
        fontSize: 15, fontWeight: 700, cursor: 'pointer',
        marginBottom: 10,
    },
    continueBtn: {
        width: '100%', padding: '11px',
        background: '#fff', color: '#8b7355',
        border: '1px solid #d4c4b4', borderRadius: 10,
        fontSize: 14, cursor: 'pointer',
    },
    btnPrimary: {
        padding: '12px 32px', background: '#6f4e37',
        color: '#fff', border: 'none', borderRadius: 10,
        fontSize: 15, cursor: 'pointer', fontWeight: 600,
    },
}