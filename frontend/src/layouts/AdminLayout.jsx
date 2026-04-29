
// src/layouts/AdminLayout.jsx
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/admin/Sidebar'

export default function AdminLayout() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f0eb' }}>
            <Sidebar />
            <main style={{ flex: 1, overflow: 'auto' }}>
                <Outlet />
            </main>
        </div>
    )
}