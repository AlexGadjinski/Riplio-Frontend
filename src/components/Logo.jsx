function Logo({ size = 32, style }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24, ...style }}>
            <span style={{ fontSize: size }}>🌊</span>
            <span style={{ fontSize: size, fontWeight: 700, color: '#0ea5e9' }}>Riplio</span>
        </div>
    )
}

export default Logo