
// src/layouts/UserLayout.jsx
import { Outlet } from 'react-router-dom'
import Header from '../components/user/Header'
import Footer from '../components/user/Footer'

export default function UserLayout() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f0eb' }}>
            <Header />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}