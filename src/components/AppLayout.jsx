import { Layout, Menu, Avatar, Dropdown } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

const { Header, Content } = Layout

function AppLayout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const navItems = [
        { key: '/', label: <Link to="/">Home</Link> },
        { key: '/communities', label: <Link to="/communities">Communities</Link> },
    ]

    const userMenuItems = [
        { key: 'logout', icon: <LogoutOutlined />, label: 'Log out', onClick: handleLogout },
    ]

    return (
        <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#fff',
                    paddingInline: 24,
                    borderBottom: '1px solid #f0f0f0',
                }}
            >
                <div style={{ marginRight: 32 }}>
                    <Logo size={22} style={{ marginBottom: 0 }} />
                </div>
                <Menu
                    mode="horizontal"
                    selectedKeys={[location.pathname]}
                    items={navItems}
                    style={{ flex: 1, borderBottom: 'none' }}
                />
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar icon={<UserOutlined />} src={user?.avatarUrl} />
                        <span>{user?.username}</span>
                    </div>
                </Dropdown>
            </Header>
            <Content style={{ padding: 24, maxWidth: 900, margin: '0 auto', width: '100%' }}>
                <Outlet />
            </Content>
        </Layout>
    )
}

export default AppLayout