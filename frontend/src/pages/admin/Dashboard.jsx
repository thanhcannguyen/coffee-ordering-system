
// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react'
import Topbar from '../../components/admin/Topbar'
import { getCategories } from '../../api/categoryApi'
import { getProducts } from '../../api/productApi'

export default function Dashboard() {
    const [stats, setStats] = useState({ categories: 0, products: 0 })

    useEffect(() => {
        Promise.all([getCategories(), getProducts()])
            .then(([catRes, proRes]) => {
                setStats({
                    categories: catRes.data.total,
                    products: proRes.data.total,
                })
            })
            .catch(console.error)
    }, [])

    const cards = [
        { label: 'Danh mục', value: stats.categories, icon: '◇', note: 'Đang hoạt động' },
        { label: 'Sản phẩm', value: stats.products, icon: '◈', note: 'Đang bán' },
        { label: 'Đơn hàng', value: '—', icon: '◎', note: 'Giai đoạn 4' },
        { label: 'Người dùng', value: '—', icon: '○', note: 'Giai đoạn 5' },
    ]

    return (
        <div>
            <Topbar title='Dashboard' />
            <div style={s.body}>
                <div style={s.grid}>
                    {cards.map(c => (
                        <div key={c.label} style={s.card}>
                            <div style={s.cardIcon}>{c.icon}</div>
                            <div style={s.cardLabel}>{c.label}</div>
                            <div style={s.cardValue}>{c.value}</div>
                            <div style={s.cardNote}>{c.note}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const s = {
    body: { padding: 28 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 },
    card: {
        background: '#fff', borderRadius: 12,
        border: '1px solid #e8ddd5', padding: '20px 22px',
    },
    cardIcon: { fontSize: 20, marginBottom: 10 },
    cardLabel: { fontSize: 12, color: '#8b7355', marginBottom: 6 },
    cardValue: { fontSize: 28, fontWeight: 600, color: '#1a0f0a', marginBottom: 4 },
    cardNote: { fontSize: 11, color: '#8b7355' },
}