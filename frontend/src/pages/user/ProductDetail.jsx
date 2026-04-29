
// src/pages/user/ProductDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById } from '../../api/productApi'

export default function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        getProductById(id)
            .then(res => setProduct(res.data.data))
            .catch(() => setError('Không tìm thấy sản phẩm'))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <p style={{ padding: 40, color: '#8b7355' }}>Đang tải...</p>
    if (error) return <p style={{ padding: 40, color: '#b42318' }}>{error}</p>

    return (
        <div style={s.page}>
            <div style={s.container}>

                {/* Nút quay lại */}
                <button onClick={() => navigate('/menu')} style={s.backBtn}>
                    ← Quay lại thực đơn
                </button>

                <div style={s.card}>
                    <img
                        src={product.image}
                        alt={product.name}
                        style={s.img}
                        onError={e => { e.target.src = 'https://placehold.co/500x350/f5f0eb/6f4e37?text=Coffee' }}
                    />
                    <div style={s.info}>
                        <div style={s.catTag}>{product.category?.name}</div>
                        <h1 style={s.name}>{product.name}</h1>
                        <p style={s.desc}>{product.description || 'Chưa có mô tả'}</p>
                        <div style={s.price}>
                            {product.price.toLocaleString('vi-VN')}đ
                        </div>

                        {/* Giai đoạn 3 sẽ gắn addToCart */}
                        <button
                            style={s.addBtn}
                            onClick={() => alert('Chức năng giỏ hàng sẽ có ở giai đoạn 3')}
                        >
                            🛒 Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

const s = {
    page: { background: '#f5f0eb', minHeight: '100vh', padding: '32px 0' },
    container: { maxWidth: 900, margin: '0 auto', padding: '0 24px' },
    backBtn: {
        background: 'none', border: 'none',
        color: '#6f4e37', fontSize: 14, cursor: 'pointer',
        marginBottom: 24, padding: 0, fontWeight: 500,
    },
    card: {
        background: '#fff', borderRadius: 16,
        border: '1px solid #e8ddd5', overflow: 'hidden',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
    },
    img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 300 },
    info: { padding: 32 },
    catTag: { fontSize: 12, color: '#6f4e37', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
    name: { fontSize: 28, fontWeight: 600, color: '#1a0f0a', margin: '0 0 12px' },
    desc: { fontSize: 15, color: '#8b7355', lineHeight: 1.6, margin: '0 0 24px' },
    price: { fontSize: 26, fontWeight: 700, color: '#6f4e37', marginBottom: 24 },
    addBtn: {
        width: '100%', padding: '14px',
        background: '#6f4e37', color: '#fff',
        border: 'none', borderRadius: 10,
        fontSize: 15, fontWeight: 600, cursor: 'pointer',
    },
}