import { Card, Button, Row, Col } from 'antd'
import { TeamOutlined, FireOutlined, UserOutlined, RocketOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function HomePage() {
    const { user } = useAuth()
    const navigate = useNavigate()

    return (
        <div>
            <div
                style={{
                    borderRadius: 16,
                    padding: '48px 40px',
                    color: '#fff',
                    backgroundImage:
                        'linear-gradient(120deg, rgba(8,145,178,0.85), rgba(37,99,235,0.85)), url(https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1600&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    marginBottom: 32,
                }}
            >
                <h1 style={{ color: '#fff', fontSize: 34, marginBottom: 8 }}>
                    Welcome back, {user?.username} 👋
                </h1>
                <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 24 }}>
                    Dive into communities, share posts and send ripples across Riplio.
                </p>
                <Button
                    type="primary"
                    size="large"
                    icon={<RocketOutlined />}
                    onClick={() => navigate('/communities')}
                >
                    Browse communities
                </Button>
            </div>

            <Row gutter={16}>
                <Col xs={24} sm={8}>
                    <Card hoverable onClick={() => navigate('/communities')}>
                        <TeamOutlined style={{ fontSize: 28, color: '#0891b2' }} />
                        <h3 style={{ marginTop: 12 }}>Communities</h3>
                        <p style={{ color: '#888' }}>Find your people and join the conversation.</p>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card hoverable onClick={() => navigate('/trending')}>
                        <FireOutlined style={{ fontSize: 28, color: '#f97316' }} />
                        <h3 style={{ marginTop: 12 }}>Trending</h3>
                        <p style={{ color: '#888' }}>See the posts making the biggest ripples right now.</p>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card hoverable onClick={() => navigate('/profile')}>
                        <UserOutlined style={{ fontSize: 28, color: '#2563eb' }} />
                        <h3 style={{ marginTop: 12 }}>Your profile</h3>
                        <p style={{ color: '#888' }}>View your posts, comments and edit your profile.</p>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default HomePage