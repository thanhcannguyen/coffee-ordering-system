// src/pages/admin/Categories.jsx
import { useState, useEffect } from 'react'
import Topbar from '../../components/admin/Topbar'
import Pagination from '../../components/admin/Pagination'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categoryApi'

// ITEMS_PER_PAGE handled dynamically in component

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    useEffect(() => {
        const h = () => setIsMobile(window.innerWidth <= 768)
        window.addEventListener('resize', h)
        return () => window.removeEventListener('resize', h)
    }, [])
    return isMobile
}

export default function Categories() {
    const isMobile = useIsMobile()
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState({ name: '', description: '' })
    const [editId, setEditId] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [showForm, setShowForm] = useState(false)

    const fetchData = () => {
        setLoading(true)
        getCategories().then(res => setCategories(res.data.data)).catch(console.error).finally(() => setLoading(false))
    }
    useEffect(() => { fetchData() }, [])
    useEffect(() => { setCurrentPage(1) }, [categories.length])

    const itemsPerPage = isMobile ? 4 : 6
    const totalPages = Math.ceil(categories.length / itemsPerPage)
    const paginated = categories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setSuccess('')
        try {
            if (editId) { await updateCategory(editId, form); setSuccess('Cập nhật danh mục thành công') }
            else { await createCategory(form); setSuccess('Tạo danh mục thành công') }
            setForm({ name: '', description: '' }); setEditId(null); setShowForm(false); fetchData()
        } catch (err) { setError(err.response?.data?.message || 'Có lỗi xảy ra') }
    }

    const handleEdit = (cat) => {
        setEditId(cat._id); setForm({ name: cat.name, description: cat.description })
        setError(''); setSuccess(''); setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Ẩn danh mục này?')) return
        try { await deleteCategory(id); setSuccess('Đã ẩn danh mục'); fetchData() }
        catch (err) { setError(err.response?.data?.message || 'Có lỗi xảy ra') }
    }

    const FormCard = (
        <div style={s.formCard}>
            <h3 style={s.formTitle}>{editId ? '✏️ Chỉnh sửa' : '➕ Thêm danh mục mới'}</h3>
            {error && <div style={s.alertErr}>{error}</div>}
            {success && <div style={s.alertOk}>{success}</div>}
            <form onSubmit={handleSubmit}>
                <label style={s.label}>Tên danh mục</label>
                <input className='admin-input' style={{ marginBottom: 14 }} value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} placeholder='VD: Coffee, Tea...' required />
                <label style={s.label}>Mô tả</label>
                <textarea className='admin-input' style={{ height: 80, resize: 'vertical', marginBottom: 16 }}
                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder='Mô tả ngắn về danh mục' />
                <button type='submit' className='admin-btn-primary'>{editId ? 'Cập nhật' : 'Tạo danh mục'}</button>
                {editId && (
                    <button type='button' className='admin-btn-secondary'
                        onClick={() => { setEditId(null); setForm({ name: '', description: '' }); setError(''); setSuccess(''); setShowForm(false) }}>Hủy</button>
                )}
            </form>
        </div>
    )

    return (
        <div>
            <Topbar title='Quản lý danh mục' subtitle='Thêm, chỉnh sửa và ẩn danh mục sản phẩm' />
            <div style={{ padding: isMobile ? '14px 12px' : '20px 24px' }}>

                {/* Mobile: toggle form button */}
                {isMobile && !showForm && (
                    <button className='admin-btn-primary' style={{ marginBottom: 14, width: '100%' }}
                        onClick={() => setShowForm(true)}>➕ Thêm danh mục mới</button>
                )}
                {isMobile && showForm && FormCard}

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '280px 1fr', gap: 20 }}>
                    {/* Desktop form */}
                    {!isMobile && FormCard}

                    {/* Table / Cards */}
                    <div style={s.tableCard}>
                        <h3 style={s.tableTitle}>Danh sách danh mục ({categories.length})</h3>
                        {loading ? <p style={s.muted}>Đang tải...</p> : categories.length === 0 ? <p style={s.muted}>Chưa có danh mục</p> : (
                            <>
                                {isMobile ? (
                                    // Mobile: card list
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {paginated.map(cat => (
                                            <div key={cat._id} style={s.mobileCard}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1a0f0a', marginBottom: 4 }}>{cat.name}</div>
                                                    <div style={{ fontSize: 12, color: '#8b7355', marginBottom: 6 }}>{cat.description || '—'}</div>
                                                    <span style={cat.isActive ? s.badgeGreen : s.badgeGray}>{cat.isActive ? 'Đang hoạt động' : 'Đã ẩn'}</span>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                                                    <button className='admin-btn-edit' onClick={() => handleEdit(cat)}>Sửa</button>
                                                    {cat.isActive && <button className='admin-btn-del' onClick={() => handleDelete(cat._id)}>Ẩn</button>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    // Desktop: table
                                    <table style={s.table}>
                                        <thead>
                                            <tr style={s.thead}>
                                                <th style={{ ...s.th, textAlign: 'center' }}>Tên danh mục</th>
                                                <th style={{ ...s.th, textAlign: 'center' }}>Mô tả</th>
                                                <th style={{ ...s.th, textAlign: 'center' }}>Trạng thái</th>
                                                <th style={{ ...s.th, textAlign: 'center' }}>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginated.map(cat => (
                                                <tr key={cat._id} className='admin-tr'>
                                                    <td style={{ ...s.td, fontWeight: 600, textAlign: 'center' }}>{cat.name}</td>
                                                    <td style={{ ...s.td, textAlign: 'center' }}>{cat.description || '—'}</td>
                                                    <td style={{ ...s.td, textAlign: 'center' }}>
                                                        <span style={cat.isActive ? s.badgeGreen : s.badgeGray}>{cat.isActive ? 'Đang hoạt động' : 'Đã ẩn'}</span>
                                                    </td>
                                                    <td style={{ ...s.td, textAlign: 'center' }}>
                                                        <button className='admin-btn-edit' onClick={() => handleEdit(cat)}>Sửa</button>
                                                        {cat.isActive && <button className='admin-btn-del' onClick={() => handleDelete(cat._id)}>Ẩn</button>}
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
    tableTitle: { fontSize: 15, fontWeight: 700, color: '#1a0f0a', margin: '0 0 16px', textAlign: 'center' },
    label: { display: 'block', fontSize: 11, fontWeight: 700, color: '#5a3e2b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.7 },
    alertErr: { background: '#fde8e8', color: '#b42318', padding: '10px 12px', borderRadius: 8, fontSize: 12, marginBottom: 14 },
    alertOk: { background: '#e7f8ec', color: '#1b7f3a', padding: '10px 12px', borderRadius: 8, fontSize: 12, marginBottom: 14 },
    table: { width: '100%', borderCollapse: 'collapse' },
    thead: { background: '#f5f0eb' },
    th: { padding: '11px 14px', fontSize: 11, fontWeight: 700, color: '#5a3e2b', borderBottom: '2px solid #e8ddd5', textTransform: 'uppercase', letterSpacing: 0.7 },
    td: { padding: '12px 14px', fontSize: 13, color: '#1a0f0a', verticalAlign: 'middle', borderBottom: '1px solid #f5f0eb' },
    mobileCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#faf7f4', borderRadius: 10, border: '1px solid #e8ddd5', padding: '12px 14px', gap: 10 },
    badgeGreen: { background: '#e7f8ec', color: '#1b7f3a', padding: '3px 10px', borderRadius: 20, fontSize: 11 },
    badgeGray: { background: '#f0f0f0', color: '#888', padding: '3px 10px', borderRadius: 20, fontSize: 11 },
    muted: { color: '#8b7355', fontSize: 13 },
}