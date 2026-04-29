
// src/pages/user/Menu.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategories } from '../../api/categoryApi'
import { getProducts } from '../../api/productApi'

export default function Menu() {
    const navigate = useNavigate()
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [loading, setLoading] = useState(true)

    // Lấy danh sách category khi vào trang
    useEffect(() => {
        getCategories()
            .then(res => setCategories(res.data.data))
            .catch(console.error)
    }, [])

    // Lấy sản phẩm — chạy lại khi selectedCategory thay đổi
    useEffect(() => {
        setLoading(true)
        const params = selectedCategory ? { category: selectedCategory } : {}
        getProducts(params)
            .then(res => setProducts(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [selectedCategory])

    return (
        <div style={s.page}>

            {/* Tiêu đề */}
            <div style={s.hero}>
                <h1 style={s.heroTitle}>Thực đơn của chúng tôi</h1>
                <p style={s.heroSub}>Chọn món yêu thích và đặt hàng ngay</p>
            </div>

            <div style={s.body}>

                {/* Filter category */}
                <div style={s.filterRow}>
                    <button
                        style={selectedCategory === null ? s.filterBtnActive : s.filterBtn}
                        onClick={() => setSelectedCategory(null)}
                    >
                        Tất cả
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat._id}
                            style={selectedCategory === cat._id ? s.filterBtnActive : s.filterBtn}
                            onClick={() => setSelectedCategory(cat._id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Danh sách sản phẩm */}
                {loading ? (
                    <p style={s.loading}>Đang tải sản phẩm...</p>
                ) : products.length === 0 ? (
                    <p style={s.empty}>Không có sản phẩm nào trong danh mục này</p>
                ) : (
                    <div style={s.grid}>
                        {products.map(product => (
                            <div
                                key={product._id}
                                style={s.card}
                                onClick={() => navigate(`/product/${product._id}`)}
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    style={s.img}
                                    // Ảnh lỗi thì hiện placeholder
                                    onError={e => { e.target.src = 'https://placehold.co/300x200/f5f0eb/6f4e37?text=Coffee' }}
                                />
                                <div style={s.cardBody}>
                                    <div style={s.catTag}>{product.category?.name}</div>
                                    <h3 style={s.cardName}>{product.name}</h3>
                                    <p style={s.cardDesc}>{product.description}</p>
                                    <div style={s.cardFooter}>
                                        <span style={s.price}>
                                            {product.price.toLocaleString('vi-VN')}đ
                                        </span>
                                        <button
                                            style={s.addBtn}
                                            // Giai đoạn 3 sẽ gắn addToCart vào đây
                                            onClick={e => {
                                                e.stopPropagation()
                                                alert('Chức năng giỏ hàng sẽ có ở giai đoạn 3')
                                            }}
                                        >
                                            + Thêm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

const s = {
    page: { minHeight: '100vh', background: '#f5f0eb' },
    hero: { background: '#6f4e37', padding: '48px 32px', textAlign: 'center' },
    heroTitle: { color: '#fff', fontSize: 32, fontWeight: 600, margin: '0 0 8px' },
    heroSub: { color: 'rgba(255,255,255,0.75)', fontSize: 15, margin: 0 },
    body: { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' },
    filterRow: { display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap' },
    filterBtn: {
        padding: '8px 20px', borderRadius: 20,
        border: '1px solid #e8ddd5', background: '#fff',
        color: '#8b7355', fontSize: 14, cursor: 'pointer',
    },
    filterBtnActive: {
        padding: '8px 20px', borderRadius: 20,
        border: '1px solid #6f4e37', background: '#6f4e37',
        color: '#fff', fontSize: 14, cursor: 'pointer', fontWeight: 500,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 20,
    },
    card: {
        background: '#fff', borderRadius: 12,
        border: '1px solid #e8ddd5', overflow: 'hidden',
        cursor: 'pointer', transition: 'box-shadow 0.2s',
    },
    img: { width: '100%', height: 180, objectFit: 'cover', display: 'block' },
    cardBody: { padding: 16 },
    catTag: {
        fontSize: 11, color: '#6f4e37', fontWeight: 500,
        textTransform: 'uppercase', letterSpacing: 0.5,
        marginBottom: 6,
    },
    cardName: { fontSize: 16, fontWeight: 600, color: '#1a0f0a', margin: '0 0 6px' },
    cardDesc: { fontSize: 13, color: '#8b7355', margin: '0 0 14px', lineHeight: 1.5 },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    price: { fontSize: 17, fontWeight: 600, color: '#6f4e37' },
    addBtn: {
        padding: '7px 16px', borderRadius: 8,
        background: '#6f4e37', color: '#fff',
        border: 'none', fontSize: 13, cursor: 'pointer', fontWeight: 500,
    },
    loading: { textAlign: 'center', color: '#8b7355', padding: 40 },
    empty: { textAlign: 'center', color: '#8b7355', padding: 40 },
}