
// src/pages/admin/Categories.jsx
import { useState, useEffect } from 'react'
import Topbar from '../../components/admin/Topbar'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categoryApi'

export default function Categories() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState({ name: '', description: '' })
    const [editId, setEditId] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const fetchData = () => {
        setLoading(true)
        getCategories()
            .then(res => setCategories(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchData() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(''); setSuccess('')
        try {
            if (editId) {
                await updateCategory(editId, form)
                setSuccess('Cập nhật danh mục thành công')
            } else {
                await createCategory(form)
                setSuccess('Tạo danh mục thành công')
            }
            setForm({ name: '', description: '' })
            setEditId(null)
            fetchData()
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra')
        }
    }

    const handleEdit = (cat) => {
        setEditId(cat._id)
        setForm({ name: cat.name, description: cat.description })
        setError(''); setSuccess('')
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Ẩn danh mục này?')) return
        try {
            await deleteCategory(id)
            setSuccess('Đã ẩn danh mục')
            fetchData()
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra')
        }
    }

    const handleCancel = () => {
        setEditId(null)
        setForm({ name: '', description: '' })
        setError(''); setSuccess('')
    }

    return (
        <div>
            <Topbar title='Quản lý danh mục' />
            <div style={s.body}>
                <div style={s.layout}>

                    {/* Form thêm/sửa */}
                    <div style={s.formCard}>
                        <h3 style={s.formTitle}>
                            {editId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                        </h3>

                        {error && <div style={s.error}>{error}</div>}
                        {success && <div style={s.success}>{success}</div>}

                        <form onSubmit={handleSubmit}>
                            <label style={s.label}>Tên danh mục</label>
                            <input
                                style={s.input}
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder='VD: Coffee, Tea...'
                                required
                            />
                            <label style={s.label}>Mô tả</label>
                            <textarea
                                style={{ ...s.input, height: 80, resize: 'vertical' }}
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                placeholder='Mô tả ngắn về danh mục'
                            />
                            <button type='submit' style={s.btnPrimary}>
                                {editId ? 'Cập nhật' : 'Tạo danh mục'}
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
                        <h3 style={s.formTitle}>Danh sách danh mục ({categories.length})</h3>
                        {loading ? (
                            <p style={s.muted}>Đang tải...</p>
                        ) : categories.length === 0 ? (
                            <p style={s.muted}>Chưa có danh mục nào</p>
                        ) : (
                            <table style={s.table}>
                                <thead>
                                    <tr>
                                        {['Tên', 'Mô tả', 'Trạng thái', 'Thao tác'].map(h => (
                                            <th key={h} style={s.th}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map(cat => (
                                        <tr key={cat._id} style={s.tr}>
                                            <td style={s.td}><strong>{cat.name}</strong></td>
                                            <td style={s.td}>{cat.description || '—'}</td>
                                            <td style={s.td}>
                                                <span style={cat.isActive ? s.badgeGreen : s.badgeGray}>
                                                    {cat.isActive ? 'Đang hoạt động' : 'Đã ẩn'}
                                                </span>
                                            </td>
                                            <td style={s.td}>
                                                <button onClick={() => handleEdit(cat)} style={s.btnEdit}>Sửa</button>
                                                {cat.isActive && (
                                                    <button onClick={() => handleDelete(cat._id)} style={s.btnDel}>Ẩn</button>
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
    td: { padding: '12px', fontSize: 14, color: '#1a0f0a', borderBottom: '1px solid #f5f0eb' },
    tr: { transition: 'background 0.1s' },
    badgeGreen: { background: '#e7f8ec', color: '#1b7f3a', padding: '3px 10px', borderRadius: 20, fontSize: 12 },
    badgeGray: { background: '#f0f0f0', color: '#888', padding: '3px 10px', borderRadius: 20, fontSize: 12 },
    btnEdit: { padding: '5px 12px', borderRadius: 6, background: '#f5f0eb', color: '#6f4e37', border: 'none', fontSize: 13, cursor: 'pointer', marginRight: 6, fontWeight: 500 },
    btnDel: { padding: '5px 12px', borderRadius: 6, background: '#fde8e8', color: '#b42318', border: 'none', fontSize: 13, cursor: 'pointer' },
    error: { background: '#fde8e8', color: '#b42318', padding: '10px 12px', borderRadius: 8, fontSize: 13, marginBottom: 14 },
    success: { background: '#e7f8ec', color: '#1b7f3a', padding: '10px 12px', borderRadius: 8, fontSize: 13, marginBottom: 14 },
    muted: { color: '#8b7355', fontSize: 14 },
}