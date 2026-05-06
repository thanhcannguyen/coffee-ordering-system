// src/pages/admin/Users.jsx
import { useState, useEffect, useRef } from 'react'
import Topbar from '../../components/admin/Topbar'
import Pagination from '../../components/admin/Pagination'
import { getAllUsers } from '../../api/userApi'

const ITEMS_PER_PAGE = 8

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    useEffect(() => {
        const h = () => setIsMobile(window.innerWidth <= 768)
        window.addEventListener('resize', h)
        return () => window.removeEventListener('resize', h)
    }, [])
    return isMobile
}

function Dropdown({ value, onChange, options, style }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const selected = options.find(o => o.value === value)

    return (
        <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    ...style,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    justifyContent: 'space-between',
                    minWidth: 140,
                }}
            >
                <span>{selected?.label}</span>
                <span style={{ fontSize: 10, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
            </button>
            {open && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    background: '#fff',
                    border: '1.5px solid #e0d3c8',
                    borderRadius: 8,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                    zIndex: 999,
                    minWidth: '100%',
                    width: 'max-content',
                    overflow: 'hidden',
                }}>
                    {options.map(o => (
                        <div
                            key={o.value}
                            onClick={() => { onChange(o.value); setOpen(false) }}
                            style={{
                                padding: '9px 16px',
                                fontSize: 13,
                                color: '#1a0f0a',
                                cursor: 'pointer',
                                background: value === o.value ? '#f7e2cd' : '#fff',
                                fontWeight: value === o.value ? 600 : 400,
                                whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={e => { if (value !== o.value) e.currentTarget.style.background = '#fdf3ea' }}
                            onMouseLeave={e => { e.currentTarget.style.background = value === o.value ? '#f7e2cd' : '#fff' }}
                        >
                            {o.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function Users() {
    const isMobile = useIsMobile()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        getAllUsers().then(res => setUsers(res.data.data)).catch(console.error).finally(() => setLoading(false))
    }, [])

    const filtered = users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
        const matchRole = roleFilter === 'all' || u.role === roleFilter
        const matchStatus = statusFilter === 'all' || String(u.isActive) === statusFilter
        return matchSearch && matchRole && matchStatus
    })
    useEffect(() => { setCurrentPage(1) }, [search, roleFilter, statusFilter])

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    const avatarColor = (name) => {
        const colors = ['#6f4e37', '#2e7d32', '#1565c0', '#6a1b9a', '#c62828', '#00695c', '#ef6c00']
        return colors[name?.charCodeAt(0) % colors.length] || '#6f4e37'
    }
    const initials = (name) => {
        if (!name) return '?'
        const parts = name.trim().split(' ')
        return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.slice(0, 2).toUpperCase()
    }

    const stats = [
        { label: 'Tổng người dùng', value: users.length, color: '#6f4e37', bg: '#f5ece4' },
        { label: 'Đang hoạt động', value: users.filter(u => u.isActive).length, color: '#1b7f3a', bg: '#e7f8ec' },
        { label: 'Đã xác minh', value: users.filter(u => u.isEmailVerified).length, color: '#1565c0', bg: '#e6f1fb' },
        { label: 'Quản trị viên', value: users.filter(u => u.role === 'admin').length, color: '#6a1b9a', bg: '#f3e8ff' },
    ]

    const filterStyle = {
        padding: '7px 14px',
        borderRadius: 8,
        border: '1.5px solid #e0d3c8',
        background: '#fff',
        color: '#6f4e37',
        fontSize: 13,
        cursor: 'pointer',
        fontWeight: 500,
        fontFamily: 'inherit',
        outline: 'none',
        height: 36,
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
    }

    const roleOptions = [
        { value: 'all', label: 'Tất cả vai trò' },
        { value: 'user', label: 'User' },
        { value: 'admin', label: 'Admin' },
    ]

    const statusOptions = [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'true', label: 'Đang hoạt động' },
        { value: 'false', label: 'Đã khóa' },
    ]

    return (
        <div>
            <Topbar title='Quản lý người dùng' />
            <div style={{ padding: isMobile ? '14px 12px' : '20px 24px' }}>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: isMobile ? 8 : 12, marginBottom: 16 }}>
                    {stats.map(stat => (
                        <div key={stat.label} style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8ddd5', padding: isMobile ? '12px 10px' : '12px 10px', textAlign: 'center' }}>
                            <div style={{ fontSize: isMobile ? 20 : 22, fontWeight: 700, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
                            <div style={{ fontSize: 11, color: '#8b7355' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Search — full width */}
                <input
                    style={{ ...filterStyle, width: '100%', boxSizing: 'border-box', marginBottom: 8, borderRadius: 8, color: '#1a0f0a', fontWeight: 400 }}
                    placeholder='Tìm tên, email...' value={search} onChange={e => setSearch(e.target.value)} />

                {/* Filters */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' }}>
                    <Dropdown
                        value={roleFilter}
                        onChange={setRoleFilter}
                        options={roleOptions}
                        style={filterStyle}
                    />
                    <Dropdown
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={statusOptions}
                        style={filterStyle}
                    />
                    <button style={filterStyle} onClick={() => { setSearch(''); setRoleFilter('all'); setStatusFilter('all') }}>↺ Reset</button>
                    <span style={{ fontSize: 12, color: '#8b7355', marginLeft: 'auto' }}>{filtered.length}/{users.length} người dùng</span>
                </div>

                {/* Content */}
                {loading ? <p style={{ color: '#8b7355', textAlign: 'center', padding: 32 }}>Đang tải...</p> :
                    filtered.length === 0 ? <p style={{ color: '#8b7355', textAlign: 'center', padding: 32 }}>Không tìm thấy người dùng nào</p> : (
                        <>
                            {isMobile ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {paginated.map(user => (
                                        <div key={user._id} style={s.userCard}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: avatarColor(user.name), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
                                                    {initials(user.name)}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1a0f0a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                                                    <div style={{ fontSize: 12, color: '#8b7355', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                                                <span style={user.role === 'admin' ? s.badgeAdmin : s.badgeUser}>{user.role === 'admin' ? 'Admin' : 'User'}</span>
                                                <span style={user.isEmailVerified ? s.badgeVerified : s.badgeUnverified}>{user.isEmailVerified ? '✓ Xác minh' : '✗ Chưa'}</span>
                                                <span style={user.isActive ? s.badgeActive : s.badgeLocked}>{user.isActive ? 'Hoạt động' : 'Đã khóa'}</span>
                                                <span style={{ fontSize: 11, color: '#aaa', marginLeft: 'auto' }}>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8ddd5', overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
                                        <thead>
                                            <tr style={{ background: '#f7e2cd' }}>
                                                {['Người dùng', 'Email', 'Vai trò', 'Xác minh', 'Trạng thái', 'Ngày tham gia'].map(h => (
                                                    <th key={h} style={s.th}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginated.map(user => (
                                                <tr key={user._id} className='admin-tr'>
                                                    <td style={s.td}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: avatarColor(user.name), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{initials(user.name)}</div>
                                                            <span style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>{user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ ...s.td, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</td>
                                                    <td style={{ ...s.td, textAlign: 'center' }}><span style={user.role === 'admin' ? s.badgeAdmin : s.badgeUser}>{user.role === 'admin' ? 'Admin' : 'User'}</span></td>
                                                    <td style={{ ...s.td, textAlign: 'center' }}><span style={user.isEmailVerified ? s.badgeVerified : s.badgeUnverified}>{user.isEmailVerified ? '✓ Đã xác minh' : '✗ Chưa'}</span></td>
                                                    <td style={{ ...s.td, textAlign: 'center' }}><span style={user.isActive ? s.badgeActive : s.badgeLocked}>{user.isActive ? 'Hoạt động' : 'Đã khóa'}</span></td>
                                                    <td style={{ ...s.td, textAlign: 'center', whiteSpace: 'nowrap' }}>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        </>
                    )}
            </div>
        </div>
    )
}

const s = {
    th: { padding: '11px 14px', fontSize: 11, fontWeight: 700, color: '#5a3e2b', textTransform: 'uppercase', letterSpacing: 0.7, borderBottom: '2px solid #e8ddd5', textAlign: 'left', whiteSpace: 'nowrap' },
    td: { padding: '12px 14px', fontSize: 13, color: '#1a0f0a', verticalAlign: 'middle', borderBottom: '1px solid #f5f0eb' },
    userCard: { background: '#fff', borderRadius: 10, border: '1px solid #e8ddd5', padding: '14px' },
    badgeAdmin: { background: '#f3e8ff', color: '#6a1b9a', padding: '3px 10px', borderRadius: 20, fontSize: 11, whiteSpace: 'nowrap' },
    badgeUser: { background: '#e6f1fb', color: '#1565c0', padding: '3px 10px', borderRadius: 20, fontSize: 11, whiteSpace: 'nowrap' },
    badgeVerified: { background: '#e7f8ec', color: '#1b7f3a', padding: '3px 10px', borderRadius: 20, fontSize: 11, whiteSpace: 'nowrap' },
    badgeUnverified: { background: '#fde8e8', color: '#b42318', padding: '3px 10px', borderRadius: 20, fontSize: 11, whiteSpace: 'nowrap' },
    badgeActive: { background: '#e7f8ec', color: '#1b7f3a', padding: '3px 10px', borderRadius: 20, fontSize: 11, whiteSpace: 'nowrap' },
    badgeLocked: { background: '#f0f0f0', color: '#888', padding: '3px 10px', borderRadius: 20, fontSize: 11, whiteSpace: 'nowrap' },
}