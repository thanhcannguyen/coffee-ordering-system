// src/pages/user/Cart.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth <= 768)
        window.addEventListener('resize', handler)
        return () => window.removeEventListener('resize', handler)
    }, [])
    return isMobile
}

export default function Cart() {
    const navigate = useNavigate()
    const { cart, loading, updateItem, removeItem, clearCart } = useCart()
    const isMobile = useIsMobile()
    const items = cart?.items ?? []
    const totalAmount = cart?.totalAmount ?? 0

    useEffect(() => { window.scrollTo(0, 0) }, [])

    if (loading) return <p style={s.center}>Đang tải giỏ hàng...</p>

    return (
        <div style={s.page}>
            <div style={s.container}>
                <h1 style={s.title}>Giỏ hàng của bạn</h1>

                {items.length === 0 ? (
                    <div style={s.emptyBox}>
                        <div style={s.emptyIcon}>🛒</div>
                        <p style={s.emptyText}>Giỏ hàng đang trống</p>
                        <button style={s.btnPrimary} onClick={() => navigate('/menu')}>Xem thực đơn</button>
                    </div>
                ) : (
                    <div style={{ ...s.layout, gridTemplateColumns: isMobile ? '1fr' : '1fr 320px' }}>

                        {/* Danh sách items */}
                        <div style={s.itemList}>

                            {/* Header — chỉ hiện trên desktop */}
                            {!isMobile && (
                                <div style={s.tableHead}>
                                    <span style={{ flex: '0 0 45%' }}>Sản phẩm</span>
                                    <span style={{ flex: '0 0 25%', textAlign: 'center' }}>Số lượng</span>
                                    <span style={{ flex: '0 0 20%', textAlign: 'right' }}>Thành tiền</span>
                                    <span style={{ flex: '0 0 10%' }}></span>
                                </div>
                            )}

                            <div style={s.scrollArea}>
                                {items.map(item => {
                                    const product = item.product
                                    const subtotal = item.price * item.quantity
                                    return (
                                        <div key={product._id} style={isMobile ? s.itemRowMobile : s.itemRowDesktop}>

                                            {isMobile ? (
                                                // ── MOBILE layout ──
                                                <>
                                                    {/* Hàng 1: ảnh + tên + nút xóa */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                                                        <img src={product.image} alt={product.name} style={s.thumb}
                                                            onError={e => { e.target.src = 'https://placehold.co/60x60/f5f0eb/6f4e37?text=Coffee' }} />
                                                        <div style={{ flex: 1 }}>
                                                            <div style={s.itemName}>{product.name}</div>
                                                            <div style={s.itemPrice}>{item.price.toLocaleString('vi-VN')}đ / cái</div>
                                                        </div>
                                                        <button style={s.removeBtn} onClick={() => removeItem(product._id)}>✕</button>
                                                    </div>
                                                    {/* Hàng 2: qty + thành tiền */}
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <div style={s.qtyRow}>
                                                            <button style={s.qtyBtn} onClick={() => updateItem(product._id, item.quantity - 1)}>−</button>
                                                            <span style={s.qtyNum}>{item.quantity}</span>
                                                            <button style={s.qtyBtn} onClick={() => updateItem(product._id, item.quantity + 1)}>+</button>
                                                        </div>
                                                        <span style={{ fontWeight: 700, color: '#4a2c17', fontSize: 15 }}>
                                                            {subtotal.toLocaleString('vi-VN')}đ
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                // ── DESKTOP layout — giữ nguyên như cũ ──
                                                <>
                                                    <div style={{ flex: '0 0 45%', display: 'flex', alignItems: 'center', gap: 12 }}>
                                                        <img src={product.image} alt={product.name} style={s.thumb}
                                                            onError={e => { e.target.src = 'https://placehold.co/60x60/f5f0eb/6f4e37?text=Coffee' }} />
                                                        <div>
                                                            <div style={s.itemName}>{product.name}</div>
                                                            <div style={s.itemPrice}>{item.price.toLocaleString('vi-VN')}đ / cái</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ flex: '0 0 25%', display: 'flex', justifyContent: 'center' }}>
                                                        <div style={s.qtyRow}>
                                                            <button style={s.qtyBtn} onClick={() => updateItem(product._id, item.quantity - 1)}>−</button>
                                                            <span style={s.qtyNum}>{item.quantity}</span>
                                                            <button style={s.qtyBtn} onClick={() => updateItem(product._id, item.quantity + 1)}>+</button>
                                                        </div>
                                                    </div>
                                                    <div style={{ flex: '0 0 20%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontWeight: 700, color: '#4a2c17', fontSize: 15 }}>
                                                        {subtotal.toLocaleString('vi-VN')}đ
                                                    </div>
                                                    <div style={{ flex: '0 0 10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <button style={s.removeBtn} onClick={() => removeItem(product._id)}>✕</button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            <div style={s.tableFooter}>
                                <button style={s.clearBtn} onClick={clearCart}>Xóa toàn bộ giỏ hàng</button>
                            </div>
                        </div>

                        {/* Summary */}
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
                                <span style={{ color: '#6f4e37' }}>{totalAmount.toLocaleString('vi-VN')}đ</span>
                            </div>
                            <button style={s.checkoutBtn} onClick={() => navigate('/checkout')}>Đặt hàng ngay →</button>
                            <button style={s.continueBtn} onClick={() => navigate('/menu')}>Tiếp tục mua hàng</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const s = {
    page: { background: '#ede8e2', minHeight: '100vh', padding: '10px 0 40px' },
    container: { maxWidth: 1020, width: '100%', margin: '0 auto', padding: '0 16px', boxSizing: 'border-box' },
    title: { fontSize: 24, fontWeight: 700, color: '#1a0f0a', marginBottom: 20 },
    center: { textAlign: 'center', padding: 60, color: '#8b7355' },
    emptyBox: { textAlign: 'center', padding: '80px 0' },
    emptyIcon: { fontSize: 56, marginBottom: 16 },
    emptyText: { color: '#8b7355', fontSize: 16, marginBottom: 24 },
    layout: { display: 'grid', gap: 20, alignItems: 'start' },
    itemList: { background: '#fff', borderRadius: 14, border: '2px solid #c9b49a', boxShadow: '0 2px 16px rgba(111,78,55,0.10)', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
    tableHead: { display: 'flex', alignItems: 'center', padding: '13px 20px', background: '#e8ddd3', borderBottom: '2px solid #c9b49a', fontSize: 12, fontWeight: 800, color: '#3d2410', textTransform: 'uppercase', letterSpacing: 0.8 },
    scrollArea: { overflowY: 'auto', maxHeight: 'calc(100vh - 280px)' },

    // Desktop row — flex ngang
    itemRowDesktop: { display: 'flex', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #f0e8e0', minHeight: 76 },
    // Mobile row — flex dọc
    itemRowMobile: { display: 'flex', flexDirection: 'column', padding: '14px 16px', borderBottom: '1px solid #f0e8e0' },

    thumb: { width: 56, height: 56, borderRadius: 8, objectFit: 'cover', flexShrink: 0 },
    itemName: { fontSize: 14, fontWeight: 600, color: '#1a0f0a', marginBottom: 4 },
    itemPrice: { fontSize: 12, color: '#8b7355' },
    qtyRow: { display: 'flex', alignItems: 'center', gap: 6 },
    qtyBtn: { width: 28, height: 28, borderRadius: 6, border: '1.5px solid #d4c4b4', background: '#f5f0eb', cursor: 'pointer', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6f4e37' },
    qtyNum: { fontSize: 15, fontWeight: 700, minWidth: 24, textAlign: 'center', color: '#1a0f0a' },
    removeBtn: { width: 30, height: 30, borderRadius: 8, border: 'none', background: '#fde8e8', color: '#b42318', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    tableFooter: { padding: '10px 20px', textAlign: 'right', borderTop: '1px solid #ede5dc', background: '#faf7f4' },
    clearBtn: { background: 'none', border: 'none', color: '#b42318', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' },
    summary: { background: '#fff', borderRadius: 14, border: '2px solid #c9b49a', boxShadow: '0 2px 16px rgba(111,78,55,0.10)', padding: 24, alignSelf: 'flex-start', boxSizing: 'border-box', width: '100%' },
    summaryTitle: { fontSize: 16, fontWeight: 700, color: '#1a0f0a', marginBottom: 20 },
    summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 12, gap: 8 },
    summaryLabel: { color: '#8b7355' },
    divider: { borderTop: '1.5px solid #e8ddd5', margin: '16px 0' },
    checkoutBtn: { width: '100%', padding: '13px', marginTop: 20, background: '#6f4e37', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10 },
    continueBtn: { width: '100%', padding: '11px', background: '#fff', color: '#8b7355', border: '1px solid #d4c4b4', borderRadius: 10, fontSize: 14, cursor: 'pointer' },
    btnPrimary: { padding: '12px 32px', background: '#6f4e37', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, cursor: 'pointer', fontWeight: 600 },
}