import { useEffect, useState } from 'react'
import { Avatar, Card, Empty, Space, Spin, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import { handleApiError } from '../utils/errorHandler'

function CommentThreadPage() {
    const { id } = useParams()
    const [thread, setThread] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosClient
            .get(`/comments/${id}/thread`)
            .then((response) => setThread(response.data))
            .catch((error) => handleApiError(error, null, 'Failed to load thread'))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
                <Spin size="large" />
            </div>
        )
    }

    if (thread.length === 0) {
        return <Empty description="Thread not found" />
    }

    return (
        <div>
            <Typography.Title level={3}>Comment thread</Typography.Title>
            {thread.map((comment, index) => {
                const isActive = comment.status === 'ACTIVE'
                const isTarget = comment.id === id
                return (
                    <Card
                        key={comment.id}
                        size="small"
                        style={{
                            marginBottom: 8,
                            marginLeft: index * 24,
                            borderColor: isTarget ? '#0ea5e9' : undefined,
                        }}
                    >
                        <Space size={8}>
                            <Avatar size={24} src={comment.authorAvatarUrl} icon={<UserOutlined />} />
                            <Typography.Text strong>{comment.authorUsername}</Typography.Text>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                {new Date(comment.createdOn).toLocaleDateString()}
                            </Typography.Text>
                        </Space>
                        <Typography.Paragraph
                            style={{
                                marginTop: 4,
                                marginBottom: 4,
                                ...(isActive ? {} : { fontStyle: 'italic', color: '#999' }),
                            }}
                        >
                            {comment.content}
                        </Typography.Paragraph>
                        <Space size={16}>
                            <span>🌊 {comment.rippleScore}</span>
                            <span>💬 {comment.replyCount}</span>
                        </Space>
                    </Card>
                )
            })}
        </div>
    )
}

export default CommentThreadPage