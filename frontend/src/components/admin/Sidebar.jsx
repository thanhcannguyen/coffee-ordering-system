// src/components/admin/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '▣' },
    { path: '/admin/categories', label: 'Danh mục', icon: '◫' },
    { path: '/admin/products', label: 'Sản phẩm', icon: '◈' },
    { path: '/admin/users', label: 'Người dùng', icon: '◎' },
    { path: '/admin/orders', label: 'Đơn hàng', icon: '◉' },
]

export default function Sidebar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const getInitials = (name) => {
        if (!name) return 'AD'
        return name
            .trim()
            .split(' ')
            .map(word => word[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
    }

    return (
        <aside style={s.sidebar}>
            <div style={s.logo}>
                <div style={s.logoIcon}>

                    <span style={s.cup}>☕️</span>
                </div>
                <span style={s.logoText}>Coffee Admin</span>
            </div>

            <nav style={s.nav}>
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'}
                        className={({ isActive }) =>
                            'admin-nav-link' + (isActive ? ' active' : '')
                        }
                    >
                        <span style={s.icon}>{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div style={s.footer}>
                <div style={s.userCard}>
                    <div style={s.avatar}>
                        {getInitials(user?.name)}
                    </div>

                    <div style={s.userInfo}>
                        <div style={s.userName}>{user?.name || 'Admin User'}</div>
                        <div style={s.userRole}>Admin</div>
                    </div>

                    <button
                        type='button'
                        style={s.logoutBtn}
                        onClick={handleLogout}
                        title='Đăng xuất'
                    >
                        ↪
                    </button>
                </div>
            </div>
        </aside>
    )
}

const s = {
    sidebar: {
        width: 220,
        background: 'linear-gradient(180deg, #5a4033 0%, #3f2b23 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '22px 14px',
        flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.1)',
    },

    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        marginBottom: 32,
        paddingLeft: 2
    },

    logoIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        background: '#7a5645',
        color: '#fff7ef',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 18px rgba(0,0,0,0.18)',
        lineHeight: 1,
    },

    steam: {
        fontSize: 12,
        transform: 'translateY(2px)',
        opacity: 0.85,
    },

    cup: {
        fontSize: 22,
        transform: 'translateY(-1px)',
    },

    logoText: {
        color: '#fff8f0',
        fontWeight: 700,
        fontSize: 15,
        letterSpacing: 0.3
    },

    nav: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 5
    },

    icon: {
        fontSize: 13,
        width: 16,
        textAlign: 'center',
        flexShrink: 0
    },

    footer: {
        marginTop: 'auto',
        paddingTop: 16,
    },

    userCard: {
        width: '100%',
        background: '#6f5041',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 16,
        padding: '11px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        boxShadow: '0 10px 24px rgba(0,0,0,0.22)',
        boxSizing: 'border-box',
    },

    avatar: {
        width: 38,
        height: 38,
        borderRadius: '50%',
        background: '#8fb7d8',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 700,
        flexShrink: 0,
    },

    userInfo: {
        flex: 1,
        minWidth: 0,
    },

    userName: {
        color: '#fffaf5',
        fontSize: 13,
        fontWeight: 700,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },

    userRole: {
        color: '#d8c7bc',
        fontSize: 11,
        marginTop: 3,
        fontWeight: 500,
    },

    logoutBtn: {
        width: 28,
        height: 28,
        border: 'none',
        borderRadius: 9,
        background: 'rgba(255,255,255,0.08)',
        color: '#f7ede5',
        fontSize: 17,
        lineHeight: 1,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
}