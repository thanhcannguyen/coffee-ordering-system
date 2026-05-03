// src/pages/admin/Products.jsx
import { useState, useEffect } from 'react'
import Topbar from '../../components/admin/Topbar'
import Pagination from '../../components/admin/Pagination'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/productApi'
import { getCategories } from '../../api/categoryApi'

const ITEMS_PER_PAGE = 5

export default function Products() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [editId, setEditId] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [form, setForm] = useState({
        name: '', description: '', price: '', image: '', category: ''
    })

    const fetchData = () => {
        setLoading(true)
        Promise.all([getProducts(), getCategories()])
            .then(([proRes, catRes]) => {
                setProducts(proRes.data.data)
                setCategories(catRes.data.data)
                if (!form.category && catRes.data.data.length > 0) {
                    setForm(f => ({ ...f, category: catRes.data.data[0]._id }))
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchData() }, [])
    useEffect(() => { setCurrentPage(1) }, [products.length])

    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
    const paginated = products.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
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
            name: p.name,
            description: p.description,
            price: p.price,
            image: p.image,
            category: p.category?._id || p.category,
        })
        setError('')
        setSuccess('')
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
        setError('')
        setSuccess('')
    }

    return (
        <div>
            <Topbar title='Quản lý sản phẩm' />
            <div style={s.body}>
                <div style={s.layout}>

                    <div style={s.formCard}>
                        <h3 style={s.formTitle}>
                            {editId ? '✏️ Chỉnh sửa sản phẩm' : '➕ Thêm sản phẩm mới'}
                        </h3>

                        {error && <div style={s.alertErr}>{error}</div>}
                        {success && <div style={s.alertOk}>{success}</div>}

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
                                        className='admin-input'
                                        style={{ marginBottom: 14 }}
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
                                className='admin-input'
                                style={{ marginBottom: 14 }}
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                                required
                            >
                                <option value=''>-- Chọn danh mục --</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>

                            <button type='submit' className='admin-btn-primary'>
                                {editId ? 'Cập nhật' : 'Tạo sản phẩm'}
                            </button>

                            {editId && (
                                <button type='button' onClick={handleCancel} className='admin-btn-secondary'>
                                    Hủy
                                </button>
                            )}
                        </form>
                    </div>

                    <div style={s.tableCard}>
                        <h3 style={s.tableTitle}>
                            Danh sách sản phẩm ({products.length})
                        </h3>

                        {loading ? (
                            <p style={s.muted}>Đang tải...</p>
                        ) : products.length === 0 ? (
                            <p style={s.muted}>Chưa có sản phẩm nào</p>
                        ) : (
                            <>
                                <table style={s.table}>
                                    <thead style={s.thead}>
                                        <tr>
                                            <th style={{ ...s.th, width: '7%', textAlign: 'center' }}>Ảnh</th>
                                            <th style={{ ...s.th, width: '25%', textAlign: 'center' }}>Tên</th>
                                            <th style={{ ...s.th, width: '18%', textAlign: 'center' }}>Danh mục</th>
                                            <th style={{ ...s.th, width: '15%', textAlign: 'center' }}>Giá</th>
                                            <th style={{ ...s.th, width: '15%', textAlign: 'center' }}>Trạng thái</th>
                                            <th style={{ ...s.th, width: '20%', textAlign: 'center' }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginated.map(p => (
                                            <tr key={p._id} className='admin-tr'>
                                                <td style={{ ...s.td, textAlign: 'center' }}>
                                                    <img
                                                        src={p.image}
                                                        alt={p.name}
                                                        style={{ ...s.thumb, margin: '0 auto' }}
                                                        onError={e => {
                                                            e.target.src = 'https://placehold.co/48x48/f5f0eb/6f4e37?text=☕'
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ ...s.td, textAlign: 'center', minWidth: 140, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    <strong>{p.name}</strong>
                                                </td>
                                                <td style={{ ...s.td, textAlign: 'center', minWidth: 100 }}>
                                                    {p.category?.name || '—'}
                                                </td>
                                                <td style={{ ...s.td, textAlign: 'center', minWidth: 100 }}>
                                                    {p.price.toLocaleString('vi-VN')}đ
                                                </td>
                                                <td style={{ ...s.td, textAlign: 'center', minWidth: 100 }}>
                                                    <span style={p.isAvailable ? s.badgeGreen : s.badgeGray}>
                                                        {p.isAvailable ? 'Đang bán' : 'Đã ẩn'}
                                                    </span>
                                                </td>
                                                <td style={{ ...s.td, textAlign: 'center', minWidth: 110 }}>
                                                    <button onClick={() => handleEdit(p)} className='admin-btn-edit'>Sửa</button>
                                                    {p.isAvailable && (
                                                        <button onClick={() => handleDelete(p._id)} className='admin-btn-del'>Ẩn</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const s = {
    body: { padding: '20px 24px' },
    layout: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 },
    formCard: { background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', padding: 24 },
    tableCard: { background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', padding: 24 },
    formTitle: { fontSize: 16, fontWeight: 700, color: '#1a0f0a', margin: '0 0 18px', textAlign: 'center', letterSpacing: 0.3 },
    tableTitle: { fontSize: 16, fontWeight: 700, color: '#1a0f0a', margin: '0 0 18px', textAlign: 'center', letterSpacing: 0.3 },
    label: { display: 'block', fontSize: 12, fontWeight: 700, color: '#5a3e2b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.7 },
    table: { width: '100%', borderCollapse: 'collapse' },
    thead: { background: '#f5f0eb' },
    th: { padding: '11px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#5a3e2b', borderBottom: '2px solid #e8ddd5', textTransform: 'uppercase', letterSpacing: 0.7 },
    td: { padding: '12px 14px', fontSize: 13, color: '#1a0f0a', borderBottom: '1px solid #f5f0eb', verticalAlign: 'middle' },
    thumb: { width: 42, height: 42, borderRadius: 8, objectFit: 'cover', display: 'block' },
    badgeGreen: { background: '#e7f8ec', color: '#1b7f3a', padding: '3px 10px', borderRadius: 20, fontSize: 11 },
    badgeGray: { background: '#f0f0f0', color: '#888', padding: '3px 10px', borderRadius: 20, fontSize: 11 },
    alertErr: { background: '#fde8e8', color: '#b42318', padding: '10px 12px', borderRadius: 8, fontSize: 12, marginBottom: 14 },
    alertOk: { background: '#e7f8ec', color: '#1b7f3a', padding: '10px 12px', borderRadius: 8, fontSize: 12, marginBottom: 14 },
    muted: { color: '#8b7355', fontSize: 13 },
}