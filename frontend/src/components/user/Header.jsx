// src/components/user/Header.jsx
import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/CartContext.jsx'

export default function Header() {
    const { user, logout } = useAuth()
    const { cartCount } = useCart()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/login')
        setMenuOpen(false)
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setMenuOpen(false)
    }

    return (
        <header style={s.header}>
            {/* Logo */}
            <Link to='/menu' className='header-logo' onClick={scrollToTop}>
                ☕ Coffee Order
            </Link>

            {/* Desktop nav */}
            <nav className='header-nav-desktop'>
                <NavLink to='/menu' className='header-nav-link' onClick={scrollToTop}>Thực đơn</NavLink>
                <NavLink to='/orders' className='header-nav-link'>Đơn hàng</NavLink>
                <NavLink to='/profile' className='header-nav-link'>Hồ sơ</NavLink>
            </nav>

            <div style={s.right}>
                <Link to='/cart' className='header-cart-btn'>
                    🛒
                    {cartCount > 0 && (
                        <span style={s.badge}>{cartCount > 99 ? '99+' : cartCount}</span>
                    )}
                </Link>

                <div className='header-avatar' onClick={() => navigate('/profile')} title='Xem hồ sơ'>
                    {user?.name?.charAt(0).toUpperCase()}
                </div>

                {/* Desktop logout */}
                <button className='header-logout-btn header-logout-desktop' onClick={handleLogout}>
                    Đăng xuất
                </button>

                {/* Mobile hamburger */}
                <button
                    className='header-hamburger'
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label='Menu'
                >
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div style={s.mobileMenu}>
                    <NavLink to='/menu' className='mobile-nav-link' onClick={scrollToTop}>🍵 Thực đơn</NavLink>
                    <NavLink to='/orders' className='mobile-nav-link' onClick={() => setMenuOpen(false)}>📋 Đơn hàng</NavLink>
                    <NavLink to='/profile' className='mobile-nav-link' onClick={() => setMenuOpen(false)}>👤 Hồ sơ</NavLink>
                    <button className='mobile-nav-logout' onClick={handleLogout}>↪ Đăng xuất</button>
                </div>
            )}
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
        padding: '0 20px',
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    right: { display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' },
    badge: {
        position: 'absolute', top: -4, right: -4,
        minWidth: 18, height: 18, borderRadius: 9,
        background: '#6f4e37', color: '#fff',
        fontSize: 10, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 4px', boxSizing: 'border-box',
    },
    mobileMenu: {
        position: 'absolute', top: 60, left: 0, right: 0,
        background: '#fff', borderBottom: '1px solid #e8ddd5',
        boxShadow: '0 8px 24px rgba(111,78,55,0.12)',
        display: 'flex', flexDirection: 'column',
        padding: '12px 0', zIndex: 99,
    },
}