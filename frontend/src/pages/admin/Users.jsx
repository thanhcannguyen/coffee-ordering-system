
// src/pages/admin/Users.jsx
import { useState, useEffect } from 'react'
import Topbar from '../../components/admin/Topbar'
import { getAllUsers } from '../../api/userApi'

export default function Users() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    useEffect(() => {
        getAllUsers()
            .then(res => setUsers(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    // Lọc phía frontend — đơn giản, không cần gọi API thêm
    const filtered = users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase())
            || u.email.toLowerCase().includes(search.toLowerCase())
        const matchRole = roleFilter === 'all' || u.role === roleFilter
        const matchStatus = statusFilter === 'all' || String(u.isActive) === statusFilter
        return matchSearch && matchRole && matchStatus
    })

    const handleReset = () => {
        setSearch('')
        setRoleFilter('all')
        setStatusFilter('all')
    }

    // Tạo màu avatar từ tên — mỗi user có màu khác nhau
    const avatarColor = (name) => {
        const colors = ['#6f4e37', '#2e7d32', '#1565c0', '#6a1b9a', '#c62828', '#00695c', '#ef6c00']
        const idx = name?.charCodeAt(0) % colors.length
        return colors[idx] || '#6f4e37'
    }

    // Lấy 2 chữ cái đầu của tên
    const initials = (name) => {
        if (!name) return '?'
        const parts = name.trim().split(' ')
        return parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : name.slice(0, 2).toUpperCase()
    }

    return (
        <div>
            <Topbar title='Quản lý người dùng' />
            <div style={s.body}>

                {/* Stats row */}
                <div style={s.statsRow}>
                    {[
                        { label: 'Tổng người dùng', value: users.length, color: '#6f4e37' },
                        { label: 'Đang hoạt động', value: users.filter(u => u.isActive).length, color: '#1b7f3a' },
                        { label: 'Đã xác minh', value: users.filter(u => u.isEmailVerified).length, color: '#1565c0' },
                        { label: 'Quản trị viên', value: users.filter(u => u.role === 'admin').length, color: '#6a1b9a' },
                    ].map(stat => (
                        <div key={stat.label} style={s.statCard}>
                            <div style={{ ...s.statValue, color: stat.color }}>{stat.value}</div>
                            <div style={s.statLabel}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filter bar */}
                <div style={s.filterBar}>
                    <input
                        style={s.searchInput}
                        placeholder='Tìm theo tên hoặc email...'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <select
                        style={s.select}
                        value={roleFilter}
                        onChange={e => setRoleFilter(e.target.value)}
                    >
                        <option value='all'>Tất cả vai trò</option>
                        <option value='user'>User</option>
                        <option value='admin'>Admin</option>
                    </select>
                    <select
                        style={s.select}
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value='all'>Tất cả trạng thái</option>
                        <option value='true'>Đang hoạt động</option>
                        <option value='false'>Đã khóa</option>
                    </select>
                    <button style={s.resetBtn} onClick={handleReset}>↺ Reset</button>

                    <span style={s.resultCount}>
                        Hiển thị {filtered.length} / {users.length} người dùng
                    </span>
                </div>

                {/* Table */}
                <div style={s.tableCard}>
                    {loading ? (
                        <p style={s.muted}>Đang tải danh sách người dùng...</p>
                    ) : filtered.length === 0 ? (
                        <p style={s.muted}>Không tìm thấy người dùng nào</p>
                    ) : (
                        <table style={s.table}>
                            <thead>
                                <tr style={s.theadRow}>
                                    {['Người dùng', 'Email', 'Vai trò', 'Xác minh', 'Trạng thái', 'Ngày tham gia'].map(h => (
                                        <th key={h} style={s.th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(user => (
                                    <tr key={user._id} style={s.tr}>

                                        {/* Avatar + tên */}
                                        <td style={s.td}>
                                            <div style={s.userCell}>
                                                <div style={{
                                                    ...s.avatar,
                                                    background: avatarColor(user.name)
                                                }}>
                                                    {initials(user.name)}
                                                </div>
                                                <div>
                                                    <div style={s.userName}>{user.name}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td style={s.td}>
                                            <span style={s.emailText}>{user.email}</span>
                                        </td>

                                        {/* Vai trò */}
                                        <td style={s.td}>
                                            <span style={user.role === 'admin' ? s.badgeAdmin : s.badgeUser}>
                                                {user.role === 'admin' ? 'Admin' : 'User'}
                                            </span>
                                        </td>

                                        {/* Xác minh email */}
                                        <td style={s.td}>
                                            <span style={user.isEmailVerified ? s.badgeVerified : s.badgeUnverified}>
                                                {user.isEmailVerified ? '✓ Đã xác minh' : '✗ Chưa xác minh'}
                                            </span>
                                        </td>

                                        {/* Trạng thái */}
                                        <td style={s.td}>
                                            <span style={user.isActive ? s.badgeActive : s.badgeLocked}>
                                                {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                                            </span>
                                        </td>

                                        {/* Ngày tham gia */}
                                        <td style={s.td}>
                                            <span style={s.dateText}>
                                                {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                                                    day: '2-digit', month: '2-digit', year: 'numeric'
                                                })}
                                            </span>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </div>
    )
}

const s = {
    body: { padding: 28 },

    // Stats
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 },
    statCard: {
        background: '#fff', borderRadius: 12,
        border: '1px solid #e8ddd5', padding: '18px 22px',
    },
    statValue: { fontSize: 28, fontWeight: 700, marginBottom: 4 },
    statLabel: { fontSize: 12, color: '#8b7355' },

    // Filter
    filterBar: {
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 16, flexWrap: 'wrap',
    },
    searchInput: {
        padding: '9px 14px', borderRadius: 8,
        border: '1px solid #e8ddd5', fontSize: 14,
        background: '#fff', width: 260, outline: 'none',
    },
    select: {
        padding: '9px 12px', borderRadius: 8,
        border: '1px solid #e8ddd5', fontSize: 14,
        background: '#fff', cursor: 'pointer', outline: 'none',
    },
    resetBtn: {
        padding: '9px 16px', borderRadius: 8,
        border: '1px solid #e8ddd5', background: '#fff',
        fontSize: 14, cursor: 'pointer', color: '#8b7355',
    },
    resultCount: { marginLeft: 'auto', fontSize: 13, color: '#8b7355' },

    // Table
    tableCard: {
        background: '#fff', borderRadius: 12,
        border: '1px solid #e8ddd5', overflow: 'hidden',
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    theadRow: { background: '#f5f0eb' },
    th: {
        padding: '12px 16px', textAlign: 'left',
        fontSize: 12, fontWeight: 600, color: '#8b7355',
        textTransform: 'uppercase', letterSpacing: 0.5,
        borderBottom: '1px solid #e8ddd5',
    },
    tr: { borderBottom: '1px solid #f5f0eb', transition: 'background 0.1s' },
    td: { padding: '14px 16px', fontSize: 14, color: '#1a0f0a', verticalAlign: 'middle' },

    // User cell
    userCell: { display: 'flex', alignItems: 'center', gap: 12 },
    avatar: {
        width: 38, height: 38, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 13, fontWeight: 600, flexShrink: 0,
    },
    userName: { fontSize: 14, fontWeight: 500, color: '#1a0f0a' },
    userEmail: { fontSize: 12, color: '#8b7355', marginTop: 2 },
    emailText: { fontSize: 13, color: '#8b7355' },
    dateText: { fontSize: 13, color: '#8b7355' },

    // Badges
    badgeAdmin: { background: '#f3e8ff', color: '#6a1b9a', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 },
    badgeUser: { background: '#e6f1fb', color: '#1565c0', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 },
    badgeVerified: { background: '#e7f8ec', color: '#1b7f3a', padding: '3px 10px', borderRadius: 20, fontSize: 12 },
    badgeUnverified: { background: '#fde8e8', color: '#b42318', padding: '3px 10px', borderRadius: 20, fontSize: 12 },
    badgeActive: { background: '#e7f8ec', color: '#1b7f3a', padding: '3px 10px', borderRadius: 20, fontSize: 12 },
    badgeLocked: { background: '#f0f0f0', color: '#888', padding: '3px 10px', borderRadius: 20, fontSize: 12 },
    muted: { color: '#8b7355', fontSize: 14, padding: 24 },
}