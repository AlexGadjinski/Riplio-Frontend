import { Button } from 'antd'
import { useAuth } from '../context/AuthContext'

function HomePage() {
    const { user, logout } = useAuth()

    return (
        <div style={{ padding: 24 }}>
            <h1>Welcome, {user?.username} 👋</h1>
            <Button onClick={logout}>Log out</Button>
        </div>
    )
}

export default HomePage