
// src/components/admin/Topbar.jsx
export default function Topbar({ title }) {
    return (
        <div style={s.topbar}>
            <h2 style={s.title}>{title}</h2>
        </div>
    )
}

const s = {
    topbar: {
        height: 56, background: '#fff',
        borderBottom: '1px solid #e8ddd5',
        display: 'flex', alignItems: 'center',
        padding: '0 28px',
    },
    title: { fontSize: 17, fontWeight: 600, color: '#1a0f0a', margin: 0 },
}