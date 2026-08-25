import { Card, Button, Row, Col } from 'antd'
import { TeamOutlined, FireOutlined, RocketOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function HomePage() {
    const { user } = useAuth()

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
                <Link to="/communities">
                    <Button type="primary" size="large" icon={<RocketOutlined />}>
                        Browse communities
                    </Button>
                </Link>
            </div>

            <Row gutter={16}>
                <Col xs={24} sm={8}>
                    <Card hoverable>
                        <TeamOutlined style={{ fontSize: 28, color: '#0891b2' }} />
                        <h3 style={{ marginTop: 12 }}>Communities</h3>
                        <p style={{ color: '#888' }}>Find your people and join the conversation.</p>
                        <Link to="/communities">Explore →</Link>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card hoverable>
                        <FireOutlined style={{ fontSize: 28, color: '#f97316' }} />
                        <h3 style={{ marginTop: 12 }}>Trending</h3>
                        <p style={{ color: '#888' }}>See the posts making the biggest ripples right now.</p>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card hoverable>
                        <RocketOutlined style={{ fontSize: 28, color: '#2563eb' }} />
                        <h3 style={{ marginTop: 12 }}>Get started</h3>
                        <p style={{ color: '#888' }}>Create a post and share your first ripple.</p>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default HomePage