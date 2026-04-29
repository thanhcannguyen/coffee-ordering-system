
// src/pages/admin/Products.jsx
import { useState, useEffect } from 'react'
import Topbar from '../../components/admin/Topbar'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/productApi'
import { getCategories } from '../../api/categoryApi'

export default function Products() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [editId, setEditId] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [form, setForm] = useState({
        name: '', description: '', price: '', image: '', category: ''
    })

    const fetchData = () => {
        setLoading(true)
        Promise.all([getProducts(), getCategories()])
            .then(([proRes, catRes]) => {
                setProducts(proRes.data.data)
                setCategories(catRes.data.data)
                // Set category mặc định cho form
                if (!form.category && catRes.data.data.length > 0) {
                    setForm(f => ({ ...f, category: catRes.data.data[0]._id }))
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchData() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(''); setSuccess('')
        try {
            const payload = { ...form, price: Number(form.price) }
            if (editId) {
                await updateProduct(editId, payload)
                setSuccess('Cập nhật sản phẩm thành công')
            } else {
                await createProduct(payload)
                setSuccess('Tạo sản phẩm thành công')
            }
            setForm({ name: '', description: '', price: '', image: '', category: categories[0]?._id || '' })
            setEditId(null)
            fetchData()
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra')
        }
    }

    const handleEdit = (p) => {
        setEditId(p._id)
        setForm({
            name: p.name, description: p.description,
            price: p.price, image: p.image,
            category: p.category?._id || p.category,
        })
        setError(''); setSuccess('')
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Ẩn sản phẩm này?')) return
        try {
            await deleteProduct(id)
            setSuccess('Đã ẩn sản phẩm')
            fetchData()
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra')
        }
    }

    const handleCancel = () => {
        setEditId(null)
        setForm({ name: '', description: '', price: '', image: '', category: categories[0]?._id || '' })
        setError(''); setSuccess('')
    }

    return (
        <div>
            <Topbar title='Quản lý sản phẩm' />
            <div style={s.body}>
                <div style={s.layout}>

                    {/* Form */}
                    <div style={s.formCard}>
                        <h3 style={s.formTitle}>
                            {editId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                        </h3>

                        {error && <div style={s.error}>{error}</div>}
                        {success && <div style={s.success}>{success}</div>}

                        <form onSubmit={handleSubmit}>
                            {[
                                { label: 'Tên sản phẩm', key: 'name', type: 'text', placeholder: 'VD: Latte' },
                                { label: 'Giá (VNĐ)', key: 'price', type: 'number', placeholder: '45000' },
                                { label: 'Link ảnh', key: 'image', type: 'text', placeholder: 'https://...' },
                                { label: 'Mô tả', key: 'description', type: 'text', placeholder: 'Mô tả ngắn' },
                            ].map(field => (
                                <div key={field.key}>
                                    <label style={s.label}>{field.label}</label>
                                    <input
                                        style={s.input}
                                        type={field.type}
                                        value={form[field.key]}
                                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                        placeholder={field.placeholder}
                                        required={field.key !== 'description'}
                                        min={field.key === 'price' ? 0 : undefined}
                                    />
                                </div>
                            ))}

                            <label style={s.label}>Danh mục</label>
                            <select
                                style={s.input}
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                                required
                            >
                                <option value=''>-- Chọn danh mục --</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>

                            <button type='submit' style={s.btnPrimary}>
                                {editId ? 'Cập nhật' : 'Tạo sản phẩm'}
                            </button>
                            {editId && (
                                <button type='button' onClick={handleCancel} style={s.btnSecondary}>
                                    Hủy
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Danh sách */}
                    <div style={s.tableCard}>
                        <h3 style={s.formTitle}>Danh sách sản phẩm ({products.length})</h3>
                        {loading ? (
                            <p style={s.muted}>Đang tải...</p>
                        ) : products.length === 0 ? (
                            <p style={s.muted}>Chưa có sản phẩm nào</p>
                        ) : (
                            <table style={s.table}>
                                <thead>
                                    <tr>
                                        {['Ảnh', 'Tên', 'Danh mục', 'Giá', 'Trạng thái', 'Thao tác'].map(h => (
                                            <th key={h} style={s.th}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p._id}>
                                            <td style={s.td}>
                                                <img
                                                    src={p.image}
                                                    alt={p.name}
                                                    style={s.thumb}
                                                    onError={e => { e.target.src = 'https://placehold.co/48x48/f5f0eb/6f4e37?text=☕' }}
                                                />
                                            </td>
                                            <td style={s.td}><strong>{p.name}</strong></td>
                                            <td style={s.td}>{p.category?.name || '—'}</td>
                                            <td style={s.td}>{p.price.toLocaleString('vi-VN')}đ</td>
                                            <td style={s.td}>
                                                <span style={p.isAvailable ? s.badgeGreen : s.badgeGray}>
                                                    {p.isAvailable ? 'Đang bán' : 'Đã ẩn'}
                                                </span>
                                            </td>
                                            <td style={s.td}>
                                                <button onClick={() => handleEdit(p)} style={s.btnEdit}>Sửa</button>
                                                {p.isAvailable && (
                                                    <button onClick={() => handleDelete(p._id)} style={s.btnDel}>Ẩn</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const s = {
    body: { padding: 28 },
    layout: { display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 },
    formCard: { background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', padding: 24 },
    tableCard: { background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', padding: 24 },
    formTitle: { fontSize: 15, fontWeight: 600, color: '#1a0f0a', margin: '0 0 16px' },
    label: { display: 'block', fontSize: 12, fontWeight: 500, color: '#8b7355', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
    input: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e8ddd5', fontSize: 14, marginBottom: 14, boxSizing: 'border-box', background: '#f5f0eb' },
    btnPrimary: { width: '100%', padding: '11px', background: '#6f4e37', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontWeight: 500, marginBottom: 8 },
    btnSecondary: { width: '100%', padding: '10px', background: '#fff', color: '#8b7355', border: '1px solid #e8ddd5', borderRadius: 8, fontSize: 14, cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#8b7355', borderBottom: '1px solid #e8ddd5', textTransform: 'uppercase' },
    td: { padding: '12px', fontSize: 14, color: '#1a0f0a', borderBottom: '1px solid #f5f0eb', verticalAlign: 'middle' },
    thumb: { width: 44, height: 44, borderRadius: 8, objectFit: 'cover', display: 'block' },
    badgeGreen: { background: '#e7f8ec', color: '#1b7f3a', padding: '3px 10px', borderRadius: 20, fontSize: 12 },
    badgeGray: { background: '#f0f0f0', color: '#888', padding: '3px 10px', borderRadius: 20, fontSize: 12 },
    btnEdit: { padding: '5px 12px', borderRadius: 6, background: '#f5f0eb', color: '#6f4e37', border: 'none', fontSize: 13, cursor: 'pointer', marginRight: 6, fontWeight: 500 },
    btnDel: { padding: '5px 12px', borderRadius: 6, background: '#fde8e8', color: '#b42318', border: 'none', fontSize: 13, cursor: 'pointer' },
    error: { background: '#fde8e8', color: '#b42318', padding: '10px 12px', borderRadius: 8, fontSize: 13, marginBottom: 14 },
    success: { background: '#e7f8ec', color: '#1b7f3a', padding: '10px 12px', borderRadius: 8, fontSize: 13, marginBottom: 14 },
    muted: { color: '#8b7355', fontSize: 14 },
}