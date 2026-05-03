// src/layouts/AdminLayout.jsx
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/admin/Sidebar'

export default function AdminLayout() {
    return (
        <div style={{
            display: 'flex',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            background: '#f5f0eb',
        }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
                <main style={{ flex: 1, overflowY: 'auto', background: '#f5f0eb' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}