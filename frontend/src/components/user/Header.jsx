
// src/components/user/Header.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <header style={s.header}>
            <Link to='/menu' style={s.logo}>☕ Coffee Order</Link>

            <nav style={s.nav}>
                <Link to='/menu' style={s.navLink}>Thực đơn</Link>
                <Link to='/orders' style={s.navLink}>Đơn hàng</Link>
                <Link to='/profile' style={s.navLink}>Hồ sơ</Link>
            </nav>

            <div style={s.right}>
                {/* Giỏ hàng — giai đoạn 3 sẽ gắn số lượng vào */}
                <Link to='/cart' style={s.cartBtn}>🛒</Link>

                <div style={s.avatar}>
                    {user?.name?.charAt(0).toUpperCase()}
                </div>

                <button onClick={handleLogout} style={s.logoutBtn}>
                    Đăng xuất
                </button>
            </div>
        </header>
    )
}

const s = {
    header: {
        height: 60, background: '#fff',
        borderBottom: '1px solid #e8ddd5',
        display: 'flex', alignItems: 'center',
        padding: '0 32px', gap: 24,
        position: 'sticky', top: 0, zIndex: 100,
    },
    logo: {
        fontWeight: 600, fontSize: 18,
        color: '#6f4e37', textDecoration: 'none',
        marginRight: 16,
    },
    nav: { display: 'flex', gap: 4, flex: 1 },
    navLink: {
        padding: '6px 14px', borderRadius: 8,
        color: '#8b7355', textDecoration: 'none',
        fontSize: 14, fontWeight: 500,
    },
    right: { display: 'flex', alignItems: 'center', gap: 12 },
    cartBtn: {
        fontSize: 20, textDecoration: 'none',
        padding: '4px 8px', borderRadius: 8,
    },
    avatar: {
        width: 34, height: 34, borderRadius: '50%',
        background: '#6f4e37', color: '#fff',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontWeight: 600, fontSize: 14,
    },
    logoutBtn: {
        padding: '6px 14px', borderRadius: 8,
        border: '1px solid #e8ddd5', background: '#fff',
        color: '#8b7355', fontSize: 13, cursor: 'pointer',
    },
}