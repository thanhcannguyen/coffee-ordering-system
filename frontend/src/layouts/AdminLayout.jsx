// src/layouts/AdminLayout.jsx
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/admin/Sidebar'

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    useEffect(() => {
        const h = () => setIsMobile(window.innerWidth <= 768)
        window.addEventListener('resize', h)
        return () => window.removeEventListener('resize', h)
    }, [])
    return isMobile
}

export default function AdminLayout() {
    const isMobile = useIsMobile()
    return (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', width: '100vw', height: isMobile ? 'auto' : '100vh', minHeight: '100vh', overflow: isMobile ? 'auto' : 'hidden', background: '#f5f0eb' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: isMobile ? 'visible' : 'hidden', minWidth: 0, paddingBottom: isMobile ? 64 : 0 }}>
                <main style={{ flex: 1, overflowY: isMobile ? 'visible' : 'auto', background: '#f5f0eb' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}