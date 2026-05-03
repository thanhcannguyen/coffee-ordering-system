// src/pages/admin/Categories.jsx
import { useState, useEffect } from 'react'
import Topbar from '../../components/admin/Topbar'
import Pagination from '../../components/admin/Pagination'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categoryApi'

const ITEMS_PER_PAGE = 8

export default function Categories() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState({ name: '', description: '' })
    const [editId, setEditId] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const fetchData = () => {
        setLoading(true)
        getCategories()
            .then(res => setCategories(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchData() }, [])
    useEffect(() => { setCurrentPage(1) }, [categories.length])

    const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE)
    const paginated = categories.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setSuccess('')
        try {
            if (editId) { await updateCategory(editId, form); setSuccess('Cập nhật danh mục thành công') }
            else { await createCategory(form); setSuccess('Tạo danh mục thành công') }
            setForm({ name: '', description: '' }); setEditId(null); fetchData()
        } catch (err) { setError(err.response?.data?.message || 'Có lỗi xảy ra') }
    }

    const handleEdit = (cat) => {
        setEditId(cat._id); setForm({ name: cat.name, description: cat.description })
        setError(''); setSuccess('')
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Ẩn danh mục này?')) return
        try { await deleteCategory(id); setSuccess('Đã ẩn danh mục'); fetchData() }
        catch (err) { setError(err.response?.data?.message || 'Có lỗi xảy ra') }
    }

    return (
        <div>
            <Topbar title='Quản lý danh mục' subtitle='Thêm, chỉnh sửa và ẩn danh mục sản phẩm' />
            <div style={s.body}>
                <div style={s.layout}>

                    {/* Form */}
                    <div style={s.formCard}>
                        <h3 style={s.formTitle}>{editId ? '✏️ Chỉnh sửa' : '➕ Thêm danh mục mới'}</h3>
                        {error && <div style={s.alertErr}>{error}</div>}
                        {success && <div style={s.alertOk}>{success}</div>}
                        <form onSubmit={handleSubmit}>
                            <label style={s.label}>Tên danh mục</label>
                            <input
                                className='admin-input' style={{ marginBottom: 14 }}
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder='VD: Coffee, Tea...' required
                            />
                            <label style={s.label}>Mô tả</label>
                            <textarea
                                className='admin-input'
                                style={{ height: 80, resize: 'vertical', marginBottom: 16 }}
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                placeholder='Mô tả ngắn về danh mục'
                            />
                            <button type='submit' className='admin-btn-primary'>
                                {editId ? 'Cập nhật' : 'Tạo danh mục'}
                            </button>
                            {editId && (
                                <button type='button' className='admin-btn-secondary'
                                    onClick={() => { setEditId(null); setForm({ name: '', description: '' }); setError(''); setSuccess('') }}>
                                    Hủy
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Bảng */}
                    <div style={s.tableCard}>
                        <h3 style={s.tableTitle}>Danh sách danh mục ({categories.length})</h3>
                        {loading ? <p style={s.muted}>Đang tải...</p> : categories.length === 0 ? <p style={s.muted}>Chưa có danh mục</p> : (
                            <>
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
                                                    <span style={cat.isActive ? s.badgeGreen : s.badgeGray}>
                                                        {cat.isActive ? 'Đang hoạt động' : 'Đã ẩn'}
                                                    </span>
                                                </td>
                                                <td style={{ ...s.td, textAlign: 'center' }}>
                                                    <button className='admin-btn-edit' onClick={() => handleEdit(cat)}>Sửa</button>
                                                    {cat.isActive && <button className='admin-btn-del' onClick={() => handleDelete(cat._id)}>Ẩn</button>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div style={{ padding: '4px 0' }}>
                                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                                </div>
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
    alertErr: { background: '#fde8e8', color: '#b42318', padding: '10px 12px', borderRadius: 8, fontSize: 12, marginBottom: 14 },
    alertOk: { background: '#e7f8ec', color: '#1b7f3a', padding: '10px 12px', borderRadius: 8, fontSize: 12, marginBottom: 14 },
    table: { width: '100%', borderCollapse: 'collapse' },
    thead: { background: '#f5f0eb' },
    th: { padding: '11px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#5a3e2b', borderBottom: '2px solid #e8ddd5', textTransform: 'uppercase', letterSpacing: 0.7 },
    td: { padding: '13px 14px', fontSize: 13, color: '#1a0f0a', verticalAlign: 'middle' },
    badgeGreen: { background: '#e7f8ec', color: '#1b7f3a', padding: '3px 10px', borderRadius: 20, fontSize: 11 },
    badgeGray: { background: '#f0f0f0', color: '#888', padding: '3px 10px', borderRadius: 20, fontSize: 11 },
    muted: { color: '#8b7355', fontSize: 13 },
}