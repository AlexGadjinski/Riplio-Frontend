import { useEffect, useState } from 'react'
import { Spin, Empty, Typography } from 'antd'
import { FireOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import { handleApiError } from '../utils/errorHandler'
import PostCard from '../components/PostCard'

function TrendingPage() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        axiosClient
            .get('/posts/trending')
            .then((response) => setPosts(response.data))
            .catch((error) => handleApiError(error, null, 'Failed to load trending posts'))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
                <Spin size="large" />
            </div>
        )
    }

    return (
        <div>
            <Typography.Title level={2} style={{ marginBottom: 4 }}>
                <FireOutlined style={{ color: '#f97316', marginRight: 8 }} />
                Trending
            </Typography.Title>
            <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
                The posts making the biggest ripples right now.
            </Typography.Paragraph>

            {posts.length === 0 ? (
                <Empty description="No trending posts yet" />
            ) : (
                posts.map((post, index) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        rank={index + 1}
                        onClick={() => navigate(`/posts/${post.id}`)}
                    />
                ))
            )}
        </div>
    )
}

export default TrendingPage