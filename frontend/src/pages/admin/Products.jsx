// src/pages/admin/Products.jsx
import { useState, useEffect } from 'react'
import Topbar from '../../components/admin/Topbar'
import Pagination from '../../components/admin/Pagination'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/productApi'
import { getCategories } from '../../api/categoryApi'

const ITEMS_PER_PAGE = 5

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    useEffect(() => {
        const h = () => setIsMobile(window.innerWidth <= 768)
        window.addEventListener('resize', h)
        return () => window.removeEventListener('resize', h)
    }, [])
    return isMobile
}

export default function Products() {
    const isMobile = useIsMobile()
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState({ name: '', description: '', price: '', image: '', category: '' })
    const [editId, setEditId] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [showForm, setShowForm] = useState(false)

    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
    const paginated = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    const fetchData = () => {
        setLoading(true)
        Promise.all([getProducts(), getCategories()])
            .then(([pRes, cRes]) => { setProducts(pRes.data.data); setCategories(cRes.data.data) })
            .catch(console.error)
            .finally(() => setLoading(false))
    }
    useEffect(() => { fetchData() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setSuccess('')
        const payload = { ...form, price: Number(form.price) }
        try {
            if (editId) { await updateProduct(editId, payload); setSuccess('Cập nhật sản phẩm thành công') }
            else { await createProduct(payload); setSuccess('Tạo sản phẩm thành công') }
            setForm({ name: '', description: '', price: '', image: '', category: categories[0]?._id || '' })
            setEditId(null); setShowForm(false); fetchData()
        } catch (err) { setError(err.response?.data?.message || 'Có lỗi xảy ra') }
    }

    const handleEdit = (p) => {
        setEditId(p._id); setForm({ name: p.name, description: p.description, price: p.price, image: p.image, category: p.category?._id || p.category })
        setError(''); setSuccess(''); setShowForm(true)
        window.scrollTo(0, 0)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Ẩn sản phẩm này?')) return
        try { await deleteProduct(id); setSuccess('Đã ẩn sản phẩm'); fetchData() }
        catch (err) { setError(err.response?.data?.message || 'Có lỗi xảy ra') }
    }

    const FormCard = (
        <div style={s.formCard}>
            <h3 style={s.formTitle}>{editId ? '✏️ Chỉnh sửa sản phẩm' : '➕ Thêm sản phẩm mới'}</h3>
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
                        <input className='admin-input' style={{ marginBottom: 12 }} type={field.type}
                            value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                            placeholder={field.placeholder} required={field.key !== 'description'} min={field.key === 'price' ? 0 : undefined} />
                    </div>
                ))}
                <label style={s.label}>Danh mục</label>
                <select className='admin-input' style={{ marginBottom: 14 }} value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })} required>
                    <option value=''>-- Chọn danh mục --</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
                <button type='submit' className='admin-btn-primary'>{editId ? 'Cập nhật' : 'Tạo sản phẩm'}</button>
                {editId && (
                    <button type='button' onClick={() => { setEditId(null); setForm({ name: '', description: '', price: '', image: '', category: categories[0]?._id || '' }); setError(''); setSuccess(''); setShowForm(false) }} className='admin-btn-secondary'>Hủy</button>
                )}
            </form>
        </div>
    )

    return (
        <div>
            <Topbar title='Quản lý sản phẩm' />
            <div style={{ padding: isMobile ? '14px 12px' : '20px 24px' }}>

                {isMobile && !showForm && (
                    <button className='admin-btn-primary' style={{ marginBottom: 14, width: '100%' }} onClick={() => setShowForm(true)}>➕ Thêm sản phẩm mới</button>
                )}
                {isMobile && showForm && FormCard}

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '280px 1fr', gap: 20 }}>
                    {!isMobile && FormCard}

                    <div style={s.tableCard}>
                        <h3 style={s.formTitle}>Danh sách sản phẩm ({products.length})</h3>
                        {loading ? <p style={s.muted}>Đang tải...</p> : products.length === 0 ? <p style={s.muted}>Chưa có sản phẩm nào</p> : (
                            <>
                                {isMobile ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {paginated.map(p => (
                                            <div key={p._id} style={s.productCard}>
                                                <img src={p.image} alt={p.name} style={s.thumb}
                                                    onError={e => { e.target.src = 'https://placehold.co/48x48/f5f0eb/6f4e37?text=☕' }} />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1a0f0a', marginBottom: 2 }}>{p.name}</div>
                                                    <div style={{ fontSize: 12, color: '#8b7355', marginBottom: 4 }}>{p.category?.name || '—'}</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <span style={{ fontWeight: 600, color: '#6f4e37', fontSize: 13 }}>{p.price.toLocaleString('vi-VN')}đ</span>
                                                        <span style={p.isAvailable ? s.badgeGreen : s.badgeGray}>{p.isAvailable ? 'Đang bán' : 'Đã ẩn'}</span>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                                                    <button className='admin-btn-edit' onClick={() => handleEdit(p)}>Sửa</button>
                                                    {p.isAvailable && <button className='admin-btn-del' onClick={() => handleDelete(p._id)}>Ẩn</button>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <table style={s.table}>
                                        <thead style={{ background: '#f5f0eb' }}>
                                            <tr>
                                                {['Ảnh', 'Tên', 'Danh mục', 'Giá', 'Trạng thái', 'Thao tác'].map(h => (
                                                    <th key={h} style={s.th}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginated.map(p => (
                                                <tr key={p._id} className='admin-tr'>
                                                    <td style={{ ...s.td, textAlign: 'center' }}>
                                                        <img src={p.image} alt={p.name} style={{ ...s.thumb, margin: '0 auto' }} onError={e => { e.target.src = 'https://placehold.co/48x48/f5f0eb/6f4e37?text=☕' }} />
                                                    </td>
                                                    <td style={s.td}><strong>{p.name}</strong></td>
                                                    <td style={{ ...s.td, textAlign: 'center' }}>{p.category?.name || '—'}</td>
                                                    <td style={{ ...s.td, textAlign: 'center' }}>{p.price.toLocaleString('vi-VN')}đ</td>
                                                    <td style={{ ...s.td, textAlign: 'center' }}><span style={p.isAvailable ? s.badgeGreen : s.badgeGray}>{p.isAvailable ? 'Đang bán' : 'Đã ẩn'}</span></td>
                                                    <td style={{ ...s.td, textAlign: 'center' }}>
                                                        <button onClick={() => handleEdit(p)} className='admin-btn-edit'>Sửa</button>
                                                        {p.isAvailable && <button onClick={() => handleDelete(p._id)} className='admin-btn-del'>Ẩn</button>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const s = {
    formCard: { background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', padding: 20, marginBottom: 14 },
    tableCard: { background: '#fff', borderRadius: 12, border: '1px solid #e8ddd5', padding: 20 },
    formTitle: { fontSize: 15, fontWeight: 700, color: '#1a0f0a', margin: '0 0 16px', textAlign: 'center' },
    label: { display: 'block', fontSize: 11, fontWeight: 700, color: '#5a3e2b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.7 },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '11px 14px', fontSize: 11, fontWeight: 700, color: '#5a3e2b', borderBottom: '2px solid #e8ddd5', textTransform: 'uppercase', letterSpacing: 0.7, textAlign: 'center' },
    td: { padding: '12px 14px', fontSize: 13, color: '#1a0f0a', verticalAlign: 'middle', borderBottom: '1px solid #f5f0eb' },
    thumb: { width: 44, height: 44, borderRadius: 8, objectFit: 'cover', display: 'block', flexShrink: 0 },
    productCard: { display: 'flex', alignItems: 'center', gap: 12, background: '#faf7f4', borderRadius: 10, border: '1px solid #e8ddd5', padding: '12px 14px' },
    badgeGreen: { background: '#e7f8ec', color: '#1b7f3a', padding: '3px 10px', borderRadius: 20, fontSize: 11 },
    badgeGray: { background: '#f0f0f0', color: '#888', padding: '3px 10px', borderRadius: 20, fontSize: 11 },
    alertErr: { background: '#fde8e8', color: '#b42318', padding: '10px 12px', borderRadius: 8, fontSize: 12, marginBottom: 14 },
    alertOk: { background: '#e7f8ec', color: '#1b7f3a', padding: '10px 12px', borderRadius: 8, fontSize: 12, marginBottom: 14 },
    muted: { color: '#8b7355', fontSize: 13 },
}