
// src/components/admin/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '◈' },
    { path: '/admin/categories', label: 'Danh mục', icon: '◈' },
    { path: '/admin/products', label: 'Sản phẩm', icon: '◈' },
    { path: '/admin/users', label: 'Người dùng', icon: '◈' },
    { path: '/admin/orders', label: 'Đơn hàng', icon: '◈', disabled: false },
]

export default function Sidebar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => { logout(); navigate('/login') }

    return (
        <aside style={s.sidebar}>
            <div style={s.logo}>☕ Coffee Admin</div>

            <nav style={s.nav}>
                {navItems.map(item => (
                    item.disabled ? (
                        <div key={item.path} style={s.navDisabled}>
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                            <span style={s.soon}>Sắp có</span>
                        </div>
                    ) : (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            style={({ isActive }) => isActive ? s.navActive : s.navLink}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    )
                ))}
            </nav>

            <div style={s.footer}>
                <div style={s.userCard}>
                    <div style={s.avatar}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div style={s.userName}>{user?.name}</div>
                        <div style={s.userRole}>Quản trị viên</div>
                    </div>
                </div>
                <button onClick={handleLogout} style={s.logoutBtn}>Đăng xuất</button>
            </div>
        </aside>
    )
}

const base = {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 14px', borderRadius: 8,
    fontSize: 14, textDecoration: 'none',
    marginBottom: 2, transition: 'background 0.15s',
}
const s = {
    sidebar: {
        width: 220, background: '#1a0f0a', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', padding: '24px 16px',
        flexShrink: 0,
    },
    logo: {
        color: '#f5f0eb', fontWeight: 700, fontSize: 16,
        marginBottom: 36, paddingLeft: 4,
    },
    nav: { flex: 1 },
    navLink: { ...base, color: 'rgba(245,240,235,0.6)' },
    navActive: { ...base, color: '#f5f0eb', background: '#6f4e37', fontWeight: 500 },
    navDisabled: {
        ...base, color: 'rgba(245,240,235,0.25)',
        pointerEvents: 'none', justifyContent: 'space-between',
    },
    soon: { fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase' },
    footer: { borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 },
    userCard: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
    avatar: {
        width: 32, height: 32, borderRadius: '50%',
        background: '#6f4e37', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 600,
    },
    userName: { color: '#f5f0eb', fontSize: 13, fontWeight: 500 },
    userRole: { color: 'rgba(245,240,235,0.45)', fontSize: 11 },
    logoutBtn: {
        width: '100%', padding: '8px', borderRadius: 8,
        background: 'rgba(255,255,255,0.06)', border: 'none',
        color: 'rgba(245,240,235,0.5)', fontSize: 13, cursor: 'pointer',
    },
}