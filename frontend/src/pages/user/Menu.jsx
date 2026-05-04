
// src/pages/user/Menu.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategories } from '../../api/categoryApi'
import { getProducts } from '../../api/productApi'
import { useCart } from '../../context/CartContext'

// ─── Banner data ────────────────────────────────────────────────────────────
const BANNERS = [
    {
        id: 1,
        tag: 'Ưu đãi hôm nay',
        title: 'Mua 2 tặng 1',
        subtitle: 'Áp dụng cho tất cả các loại cà phê – chỉ hôm nay!',
        cta: 'Đặt ngay',
        bg: 'linear-gradient(120deg, #4a2c17 0%, #6f4e37 55%, #a0714f 100%)',
        accent: '#f5c97a',
        imgUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    },
    {
        id: 2,
        tag: 'Mới ra mắt',
        title: 'Trà sữa Matcha\nTrân châu',
        subtitle: 'Vị trà xanh Nhật Bản hoà quyện kem béo, thơm dịu.',
        cta: 'Khám phá',
        bg: 'linear-gradient(120deg, #1a3a2a 0%, #2d6a4f 55%, #52b788 100%)',
        accent: '#d8f3dc',
        imgUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
    },
    {
        id: 3,
        tag: 'Bestseller',
        title: 'Cà phê Sữa\nĐá Thượng Hạng',
        subtitle: 'Hạt Arabica cao nguyên, phin truyền thống – hương vị khó quên.',
        cta: 'Thử ngay',
        bg: 'linear-gradient(120deg, #1a0f0a 0%, #3d1f0f 55%, #6f4e37 100%)',
        accent: '#f5c97a',
        imgUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
    },
]

// ─── BannerSlider ─────────────────────────────────────────────────────────
function BannerSlider() {
    const [current, setCurrent] = useState(0)
    const [animating, setAnimating] = useState(false)
    const timerRef = useRef(null)

    const goTo = (index) => {
        if (animating) return
        setAnimating(true)
        setTimeout(() => {
            setCurrent(index)
            setAnimating(false)
        }, 350)
    }

    // Auto-slide mỗi 6 giây
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setCurrent(prev => (prev + 1) % BANNERS.length)
        }, 6000)
        return () => clearInterval(timerRef.current)
    }, [])

    // Reset timer khi user bấm dot
    const manualGoTo = (index) => {
        clearInterval(timerRef.current)
        goTo(index)
        timerRef.current = setInterval(() => {
            setCurrent(prev => (prev + 1) % BANNERS.length)
        }, 6000)
    }

    const b = BANNERS[current]

    return (
        <div style={bs.wrapper}>
            {/* Slide */}
            <div
                style={{
                    ...bs.slide,
                    background: b.bg,
                    opacity: animating ? 0 : 1,
                    transform: animating ? 'translateY(6px)' : 'translateY(0)',
                    transition: 'opacity 0.35s ease, transform 0.35s ease',
                }}
            >
                {/* Text content */}
                <div style={bs.content}>
                    <span style={{ ...bs.tag, color: b.accent, borderColor: b.accent }}>
                        {b.tag}
                    </span>
                    <h2 style={bs.title}>
                        {b.title.split('\n').map((line, i) => (
                            <span key={i}>{line}<br /></span>
                        ))}
                    </h2>
                    <p style={bs.subtitle}>{b.subtitle}</p>
                    <button style={{ ...bs.cta, background: b.accent, color: '#1a0f0a' }}>
                        {b.cta} →
                    </button>
                </div>

                {/* Image */}
                <div style={bs.imgWrap}>
                    <img
                        src={b.imgUrl}
                        alt={b.title}
                        style={bs.img}
                        onError={e => { e.target.style.display = 'none' }}
                    />
                    {/* Gradient overlay trái */}
                    <div style={{
                        ...bs.imgOverlay,
                        background: `linear-gradient(to right, ${b.bg.match(/#[a-f0-9]{6}/i)?.[0] || '#1a0f0a'} 0%, transparent 100%)`,
                    }} />
                </div>


            </div>

            {/* Dot indicators */}
            <div style={bs.dots}>
                {BANNERS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => manualGoTo(i)}
                        style={{
                            ...bs.dot,
                            width: i === current ? 24 : 8,
                            background: i === current ? '#6f4e37' : '#c9b99a',
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

const bs = {
    wrapper: {
        maxWidth: 1100,
        margin: '0 auto',
        padding: '28px 24px 0',
    },
    slide: {
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        height: 260,
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 4px 24px rgba(111,78,55,0.18)',
    },
    content: {
        position: 'relative',
        zIndex: 2,
        padding: '0 40px',
        flex: '0 0 55%',
    },
    tag: {
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        border: '1px solid',
        borderRadius: 20,
        padding: '3px 10px',
        display: 'inline-block',
        marginBottom: 10,
    },
    title: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 700,
        margin: '0 0 8px',
        lineHeight: 1.25,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.72)',
        fontSize: 13,
        margin: '0 0 16px',
        lineHeight: 1.55,
        maxWidth: 360,
    },
    cta: {
        display: 'inline-block',
        padding: '8px 22px',
        borderRadius: 20,
        border: 'none',
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
        letterSpacing: 0.3,
    },
    imgWrap: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: '55%',
        height: '100%',
    },
    img: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
    imgOverlay: {
        position: 'absolute',
        inset: 0,
        zIndex: 1,
    },
    dots: {
        display: 'flex',
        justifyContent: 'center',
        gap: 6,
        marginTop: 12,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        border: 'none',
        cursor: 'pointer',
        transition: 'width 0.3s ease, background 0.3s ease',
        padding: 0,
    },
}

// ─── Menu page ───────────────────────────────────────────────────────────────
export default function Menu() {
    const navigate = useNavigate()
    const { addToCart } = useCart()

    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [loading, setLoading] = useState(true)
    const [addingId, setAddingId] = useState(null)
    const [hoveredCat, setHoveredCat] = useState(null)
    const [hoveredCard, setHoveredCard] = useState(null)

    useEffect(() => {
        getCategories()
            .then(res => setCategories(res.data.data))
            .catch(console.error)
    }, [])

    useEffect(() => {
        setLoading(true)
        const params = selectedCategory ? { category: selectedCategory } : {}
        getProducts(params)
            .then(res => setProducts(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [selectedCategory])

    const handleAddToCart = async (e, productId) => {
        e.stopPropagation()
        setAddingId(productId)
        const success = await addToCart(productId, 1)
        if (!success) alert('Không thể thêm vào giỏ hàng')
        setAddingId(null)
    }

    return (
        <div style={s.page}>

            {/* ── Banner Slider ── */}
            <BannerSlider />

            <div style={s.body}>

                {/* Filter category */}
                <div style={s.filterRow}>
                    <button
                        style={
                            selectedCategory === null
                                ? s.filterBtnActive
                                : hoveredCat === 'all'
                                    ? s.filterBtnHover
                                    : s.filterBtn
                        }
                        onClick={() => setSelectedCategory(null)}
                        onMouseEnter={() => setHoveredCat('all')}
                        onMouseLeave={() => setHoveredCat(null)}
                    >
                        Tất cả
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat._id}
                            style={
                                selectedCategory === cat._id
                                    ? s.filterBtnActive
                                    : hoveredCat === cat._id
                                        ? s.filterBtnHover
                                        : s.filterBtn
                            }
                            onClick={() => setSelectedCategory(cat._id)}
                            onMouseEnter={() => setHoveredCat(cat._id)}
                            onMouseLeave={() => setHoveredCat(null)}
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
                                style={hoveredCard === product._id ? s.cardHover : s.card}
                                onClick={() => navigate(`/product/${product._id}`)}
                                onMouseEnter={() => setHoveredCard(product._id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    style={s.img}
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
                                            onClick={e => handleAddToCart(e, product._id)}
                                            disabled={addingId === product._id}
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
    page: { minHeight: '100vh', background: '#ede8e2' },
    body: { maxWidth: 1100, margin: '0 auto', padding: '28px 24px' },
    filterRow: { display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap' },
    filterBtn: {
        padding: '8px 20px', borderRadius: 20,
        border: '1px solid #ddd3c8', background: '#f0ebe5',
        color: '#8b7355', fontSize: 14, cursor: 'pointer',
        fontWeight: 500,
        transition: 'all 0.18s ease',
    },
    filterBtnHover: {
        padding: '8px 20px', borderRadius: 20,
        border: '1px solid #a07850', background: '#e8ddd3',
        color: '#5a3820', fontSize: 14, cursor: 'pointer',
        fontWeight: 600,
        transition: 'all 0.18s ease',
        boxShadow: '0 2px 8px rgba(111,78,55,0.13)',
    },
    filterBtnActive: {
        padding: '8px 20px', borderRadius: 20,
        border: '1px solid #6f4e37', background: '#6f4e37',
        color: '#fff', fontSize: 14, cursor: 'pointer', fontWeight: 600,
        boxShadow: '0 2px 8px rgba(111,78,55,0.22)',
        transition: 'all 0.18s ease',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 20,
    },
    card: {
        background: '#fff', borderRadius: 12,
        border: '1px solid #e8ddd5', overflow: 'hidden',
        cursor: 'pointer',
        transition: 'box-shadow 0.22s ease, transform 0.22s ease, border-color 0.22s ease',
    },
    cardHover: {
        background: '#fff', borderRadius: 12,
        border: '1px solid #c4a882', overflow: 'hidden',
        cursor: 'pointer',
        transition: 'box-shadow 0.22s ease, transform 0.22s ease, border-color 0.22s ease',
        boxShadow: '0 8px 28px rgba(111,78,55,0.16)',
        transform: 'translateY(-3px)',
    },
    img: { width: '100%', height: 180, objectFit: 'cover', display: 'block' },
    cardBody: { padding: 16 },
    catTag: {
        fontSize: 11, color: '#6f4e37', fontWeight: 500,
        textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6,
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