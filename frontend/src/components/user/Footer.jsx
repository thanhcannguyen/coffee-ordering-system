
// src/components/user/Footer.jsx
export default function Footer() {
    return (
        <footer style={s.footer}>
            <span style={s.brand}>☕ Coffee Order</span>
            <span style={s.copy}>© 2026 — Hệ thống đặt cà phê online</span>
        </footer>
    )
}

const s = {
    footer: {
        borderTop: '1px solid #e8ddd5', padding: '20px 32px',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', background: '#fff',
    },
    brand: { fontWeight: 600, color: '#6f4e37', fontSize: 15 },
    copy: { fontSize: 13, color: '#8b7355' },
}