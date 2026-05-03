// src/components/admin/Topbar.jsx
export default function Topbar({ title, subtitle }) {
    return (
        <div style={s.topbar}>
            <div>
                <h2 style={s.title}>{title}</h2>
                {subtitle && <p style={s.subtitle}>{subtitle}</p>}
            </div>
        </div>
    )
}

const s = {
    topbar: {
        background: '#fff',
        borderBottom: '1px solid #e8ddd5',
        padding: '14px 24px',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 10,
    },
    title: { fontSize: 17, fontWeight: 600, color: '#1a0f0a', margin: 0 },
    subtitle: { fontSize: 12, color: '#8b7355', margin: '2px 0 0' },
}