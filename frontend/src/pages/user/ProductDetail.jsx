// src/pages/user/ProductDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById } from '../../api/productApi'
import { useCart } from '../../context/CartContext'

export default function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToCart } = useCart()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [adding, setAdding] = useState(false)
    const [added, setAdded] = useState(false)
    const [qty, setQty] = useState(1)
    const [imgLoaded, setImgLoaded] = useState(false)

    useEffect(() => {
        getProductById(id)
            .then(res => setProduct(res.data.data))
            .catch(() => setError('Không tìm thấy sản phẩm'))
            .finally(() => setLoading(false))
    }, [id])

    const handleAddToCart = async () => {
        setAdding(true)
        const success = await addToCart(product._id, qty)
        if (success) { setAdded(true); setTimeout(() => navigate('/cart'), 800) }
        setAdding(false)
    }

    if (loading) return (
        <div style={s.page}>
            <div style={s.loadingWrap}>
                <div style={s.spinner} />
                <p style={{ color: '#8b7355', marginTop: 16 }}>Đang tải sản phẩm...</p>
            </div>
        </div>
    )
    if (error) return <div style={s.page}><p style={{ padding: 40, color: '#b42318', textAlign: 'center' }}>{error}</p></div>

    return (
        <div style={s.page}>
            <div style={s.container}>
                <button onClick={() => navigate('/menu')} style={s.backBtn}>← Quay lại thực đơn</button>

                {/* Card — 2 cột desktop, 1 cột mobile */}
                <div className='product-detail-card' style={s.card}>
                    <div className='product-detail-img' style={s.imgWrap}>
                        {!imgLoaded && <div style={s.imgSkeleton} />}
                        <img src={product.image} alt={product.name}
                            style={{ ...s.img, opacity: imgLoaded ? 1 : 0 }}
                            onLoad={() => setImgLoaded(true)}
                            onError={e => { e.target.src = 'https://placehold.co/560x420/f5f0eb/6f4e37?text=Coffee'; setImgLoaded(true) }} />
                    </div>

                    <div style={s.info}>
                        <span style={s.catBadge}>{product.category?.name || 'Sản phẩm'}</span>
                        <h1 style={s.name}>{product.name}</h1>
                        <div style={s.divider} />
                        <p style={{ ...s.desc, fontStyle: product.description ? 'normal' : 'italic', opacity: product.description ? 1 : 0.6 }}>
                            {product.description || 'Chưa có mô tả cho sản phẩm này.'}
                        </p>
                        <div style={s.priceRow}>
                            <span style={s.priceLabel}>Đơn giá</span>
                            <span style={s.price}>{product.price.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div style={s.qtySection}>
                            <span style={s.qtyLabel}>Số lượng</span>
                            <div style={s.qtyControl}>
                                <button style={s.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
                                <span style={s.qtyNum}>{qty}</span>
                                <button style={s.qtyBtn} onClick={() => setQty(q => q + 1)}>+</button>
                            </div>
                        </div>
                        <button style={{ ...s.addBtn, background: added ? '#4a7c4e' : '#6f4e37', opacity: adding ? 0.8 : 1 }}
                            onClick={handleAddToCart} disabled={adding || added}>
                            {added ? 'Đã thêm — đang chuyển...' : adding ? 'Đang thêm...' : qty > 1 ? `Thêm vào giỏ hàng (×${qty})` : 'Thêm vào giỏ hàng'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const s = {
    page: { background: '#ede8e2', minHeight: '100vh', padding: '24px 0 60px' },
    container: { maxWidth: 980, margin: '0 auto', padding: '0 16px' },
    loadingWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' },
    spinner: { width: 36, height: 36, border: '3px solid #e8ddd5', borderTop: '3px solid #6f4e37', borderRadius: '50%' },
    backBtn: { background: 'none', border: 'none', color: '#6f4e37', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 16, padding: '8px 0', display: 'flex', alignItems: 'center', gap: 6 },
    card: { background: '#fff', borderRadius: 20, border: '1px solid #e3d8cf', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', boxShadow: '0 4px 32px rgba(111,78,55,0.10)', minHeight: 400 },
    imgWrap: { position: 'relative', overflow: 'hidden', background: '#f5f0eb', minHeight: 300 },
    imgSkeleton: { position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #ede8e2 25%, #f5f0eb 50%, #ede8e2 75%)' },
    img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0, transition: 'opacity 0.4s ease' },
    info: { padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    catBadge: { display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#6f4e37', background: '#f5ede4', border: '1px solid #e8d5c0', borderRadius: 20, padding: '4px 12px', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, alignSelf: 'flex-start' },
    name: { fontSize: 26, fontWeight: 700, color: '#1a0f0a', margin: '0 0 14px', lineHeight: 1.25 },
    divider: { height: 1, background: 'linear-gradient(to right, #e8ddd5, transparent)', marginBottom: 14 },
    desc: { fontSize: 14, color: '#7a6248', lineHeight: 1.7, margin: '0 0 20px' },
    priceRow: { display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 18 },
    priceLabel: { fontSize: 13, color: '#a09080', fontWeight: 500 },
    price: { fontSize: 28, fontWeight: 800, color: '#6f4e37', letterSpacing: -0.5 },
    qtySection: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 },
    qtyLabel: { fontSize: 14, color: '#7a6248', fontWeight: 500, minWidth: 70 },
    qtyControl: { display: 'flex', alignItems: 'center', border: '1.5px solid #e0d3c8', borderRadius: 10, overflow: 'hidden' },
    qtyBtn: { width: 36, height: 36, border: 'none', background: '#f5f0eb', color: '#6f4e37', fontSize: 18, cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    qtyNum: { width: 40, textAlign: 'center', fontSize: 15, fontWeight: 700, color: '#1a0f0a', borderLeft: '1.5px solid #e0d3c8', borderRight: '1.5px solid #e0d3c8', lineHeight: '36px' },
    addBtn: { width: '100%', padding: '14px', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'background 0.3s ease' },
}