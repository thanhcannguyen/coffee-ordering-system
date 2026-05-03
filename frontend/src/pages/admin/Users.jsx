// src/pages/admin/Users.jsx
import { useState, useEffect } from 'react'
import Topbar from '../../components/admin/Topbar'
import Pagination from '../../components/admin/Pagination'
import { getAllUsers } from '../../api/userApi'

const ITEMS_PER_PAGE = 8

export default function Users() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        getAllUsers()
            .then(res => setUsers(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const filtered = users.filter(u => {
        const matchSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        const matchRole = roleFilter === 'all' || u.role === roleFilter
        const matchStatus = statusFilter === 'all' || String(u.isActive) === statusFilter
        return matchSearch && matchRole && matchStatus
    })

    useEffect(() => { setCurrentPage(1) }, [search, roleFilter, statusFilter])

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
    const paginated = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const avatarColor = (name) => {
        const colors = ['#6f4e37', '#2e7d32', '#1565c0', '#6a1b9a', '#c62828', '#00695c', '#ef6c00']
        return colors[name?.charCodeAt(0) % colors.length] || '#6f4e37'
    }

    const initials = (name) => {
        if (!name) return '?'
        const parts = name.trim().split(' ')
        return parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : name.slice(0, 2).toUpperCase()
    }

    const stats = [
        { label: 'Tổng người dùng', value: users.length, color: '#6f4e37', bg: '#f5ece4' },
        { label: 'Đang hoạt động', value: users.filter(u => u.isActive).length, color: '#1b7f3a', bg: '#e7f8ec' },
        { label: 'Đã xác minh', value: users.filter(u => u.isEmailVerified).length, color: '#1565c0', bg: '#e6f1fb' },
        { label: 'Quản trị viên', value: users.filter(u => u.role === 'admin').length, color: '#6a1b9a', bg: '#f3e8ff' },
    ]

    return (
        <div>
            <Topbar title='Quản lý người dùng' />
            <div style={s.body}>

                {/* Stats */}
                <div style={s.statsRow}>
                    {stats.map(stat => (
                        <div
                            key={stat.label}
                            style={s.statCard}
                            onMouseEnter={e => {
                                e.currentTarget.style.boxShadow = `0 6px 20px ${stat.color}28`
                                e.currentTarget.style.transform = 'translateY(-3px)'
                                e.currentTarget.style.borderColor = stat.color
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.boxShadow = 'none'
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.borderColor = '#e8ddd5'
                            }}
                        >
                            <div style={{ ...s.statValue, color: stat.color }}>{stat.value}</div>
                            <div style={s.statLabel}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filter */}
                <div style={s.filterBar}>
                    <input
                        className='admin-search-input'
                        style={{ width: 320, minWidth: 200 }}
                        placeholder='Tìm theo tên hoặc email...'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <select style={s.select} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                        <option value='all'>Tất cả vai trò</option>
                        <option value='user'>User</option>
                        <option value='admin'>Admin</option>
                    </select>
                    <select style={s.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value='all'>Tất cả trạng thái</option>
                        <option value='true'>Đang hoạt động</option>
                        <option value='false'>Đã khóa</option>
                    </select>
                    <button className='admin-filter-btn' style={{ fontWeight: 700 }} onClick={() => { setSearch(''); setRoleFilter('all'); setStatusFilter('all') }}>
                        ↺ Reset
                    </button>
                    <span style={s.resultCount}>{filtered.length} / {users.length} người dùng</span>
                </div>

                {/* Table */}
                <div style={s.tableCard}>
                    {loading ? (
                        <p style={s.muted}>Đang tải...</p>
                    ) : filtered.length === 0 ? (
                        <p style={s.muted}>Không tìm thấy người dùng nào</p>
                    ) : (
                        <>
                            <table style={s.table}>
                                <thead>
                                    <tr style={s.theadRow}>
                                        <th style={s.th}>Người dùng</th>
                                        <th style={{ ...s.th, textAlign: 'center' }}>Email</th>
                                        <th style={{ ...s.th, textAlign: 'center' }}>Vai trò</th>
                                        <th style={{ ...s.th, textAlign: 'center' }}>Xác minh</th>
                                        <th style={{ ...s.th, textAlign: 'center' }}>Trạng thái</th>
                                        <th style={{ ...s.th, textAlign: 'center' }}>Ngày tham gia</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginated.map(user => (
                                        <tr key={user._id} className='admin-tr'>
                                            <td style={s.td}>
                                                <div style={s.userCell}>
                                                    <div style={{ ...s.avatar, background: avatarColor(user.name) }}>
                                                        {initials(user.name)}
                                                    </div>
                                                    <span style={s.userName}>{user.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ ...s.td, textAlign: 'center' }}>{user.email}</td>
                                            <td style={{ ...s.td, textAlign: 'center' }}>
                                                <span style={user.role === 'admin' ? s.badgeAdmin : s.badgeUser}>
                                                    {user.role === 'admin' ? 'Admin' : 'User'}
                                                </span>
                                            </td>
                                            <td style={{ ...s.td, textAlign: 'center' }}>
                                                <span style={user.isEmailVerified ? s.badgeVerified : s.badgeUnverified}>
                                                    {user.isEmailVerified ? '✓ Đã xác minh' : '✗ Chưa xác minh'}
                                                </span>
                                            </td>
                                            <td style={{ ...s.td, textAlign: 'center' }}>
                                                <span style={user.isActive ? s.badgeActive : s.badgeLocked}>
                                                    {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                                                </span>
                                            </td>
                                            <td style={{ ...s.td, textAlign: 'center' }}>
                                                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ padding: '4px 20px 4px' }}>
                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

const s = {
    body: { padding: '20px 24px' },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 },
    statCard: { background: '#fff', borderRadius: 10, border: '1px solid #e8ddd5', padding: '20px 20px 16px', textAlign: 'center', transition: 'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease', cursor: 'default' },
    statValue: { fontSize: 28, fontWeight: 700, marginBottom: 6 },
    statLabel: { fontSize: 12, color: '#8b7355', fontWeight: 500 },
    filterBar: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' },
    select: { padding: '8px 12px', borderRadius: 8, border: '1px solid #e8ddd5', fontSize: 13, background: '#fff', cursor: 'pointer', outline: 'none' },
    resultCount: { fontSize: 13, color: '#8b7355', whiteSpace: 'nowrap' },
    tableCard: { background: '#fff', borderRadius: 10, border: '1px solid #e8ddd5', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    theadRow: { background: '#f7e2cd' },
    th: { padding: '11px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#5a3e2b', textTransform: 'uppercase', letterSpacing: 0.7, borderBottom: '2px solid #e8ddd5' },
    td: { padding: '13px 16px', fontSize: 13, color: '#1a0f0a', verticalAlign: 'middle' },
    userCell: { display: 'flex', alignItems: 'center', gap: 10 },
    avatar: { width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600, flexShrink: 0 },
    userName: { fontSize: 13, fontWeight: 500, color: '#1a0f0a' },
    badgeAdmin: { background: '#f3e8ff', color: '#6a1b9a', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
    badgeUser: { background: '#e6f1fb', color: '#1565c0', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
    badgeVerified: { background: '#e7f8ec', color: '#1b7f3a', padding: '3px 10px', borderRadius: 20, fontSize: 11 },
    badgeUnverified: { background: '#fde8e8', color: '#b42318', padding: '3px 10px', borderRadius: 20, fontSize: 11 },
    badgeActive: { background: '#e7f8ec', color: '#1b7f3a', padding: '3px 10px', borderRadius: 20, fontSize: 11 },
    badgeLocked: { background: '#f0f0f0', color: '#888', padding: '3px 10px', borderRadius: 20, fontSize: 11 },
    muted: { color: '#8b7355', fontSize: 13, padding: 20 },
}