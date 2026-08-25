import { Card, Avatar, Typography, Space } from 'antd'
import PostMedia from './PostMedia'

function PostCard({ post, rank, onClick }) {
    const authorLabel = post.communityName || post.authorUsername
    const authorAvatar = post.communityAvatarUrl || post.authorAvatarUrl

    return (
        <Card hoverable onClick={onClick} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 16 }}>
                {rank ? (
                    <div
                        style={{
                            fontSize: 22,
                            fontWeight: 700,
                            color: '#0ea5e9',
                            minWidth: 36,
                            textAlign: 'center',
                        }}
                    >
                        #{rank}
                    </div>
                ) : null}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Space size={8} style={{ marginBottom: 8 }}>
                        <Avatar size={20} src={authorAvatar} />
                        <Typography.Text type="secondary">{authorLabel}</Typography.Text>
                    </Space>
                    <Typography.Title level={4} style={{ marginTop: 0, marginBottom: 8 }}>
                        {post.title}
                    </Typography.Title>
                    <Typography.Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 12 }}>
                        {post.content}
                    </Typography.Paragraph>
                    {post.mediaUrl ? (
                        <div style={{ marginBottom: 12 }}>
                            <PostMedia mediaUrl={post.mediaUrl} mediaType={post.mediaType} alt={post.title} />
                        </div>
                    ) : null}
                    <Space size={24}>
                        <Space size={6}>
                            <span>🌊</span>
                            <span>{post.rippleScore}</span>
                        </Space>
                        <Space size={6}>
                            <span>💬</span>
                            <span>{post.commentCount}</span>
                        </Space>
                    </Space>
                </div>
            </div>
        </Card>
    )
}

export default PostCard