// src/components/user/Header.jsx
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/CartContext.jsx'

export default function Header() {
    const { user, logout } = useAuth()
    const { cartCount } = useCart()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    // Scroll lên đầu trang khi click
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <header style={s.header}>

            {/* Logo — click scroll lên đầu */}
            <Link to='/menu' className='header-logo' onClick={scrollToTop}>
                ☕ Coffee Order
            </Link>

            <nav style={s.nav}>
                {/* Thực đơn — click scroll lên đầu */}
                <NavLink
                    to='/menu'
                    className='header-nav-link'
                    onClick={scrollToTop}
                >
                    Thực đơn
                </NavLink>

                <NavLink to='/orders' className='header-nav-link'>Đơn hàng</NavLink>
                <NavLink to='/profile' className='header-nav-link'>Hồ sơ</NavLink>
            </nav>

            <div style={s.right}>

                <Link to='/cart' className='header-cart-btn'>
                    🛒
                    {cartCount > 0 && (
                        <span style={s.badge}>
                            {cartCount > 99 ? '99+' : cartCount}
                        </span>
                    )}
                </Link>

                <div
                    className='header-avatar'
                    onClick={() => navigate('/profile')}
                    title='Xem hồ sơ'
                >
                    {user?.name?.charAt(0).toUpperCase()}
                </div>

                <button className='header-logout-btn' onClick={handleLogout}>
                    Đăng xuất
                </button>
            </div>
        </header>
    )
}

const s = {
    header: {
        height: 60,
        background: '#fff',
        borderBottom: '1px solid #e8ddd5',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        gap: 24,
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    nav: { display: 'flex', gap: 4, flex: 1 },
    right: { display: 'flex', alignItems: 'center', gap: 12 },
    badge: {
        position: 'absolute',
        top: -4, right: -4,
        minWidth: 18, height: 18,
        borderRadius: 9,
        background: '#6f4e37',
        color: '#fff',
        fontSize: 10, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 4px',
        boxSizing: 'border-box',
    },
}