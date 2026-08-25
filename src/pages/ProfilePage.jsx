import { useCallback, useState } from 'react'
import { Avatar, Button, Card, Divider, Empty, Space, Spin, Tabs, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import axiosClient from '../api/axiosClient'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { useAuth } from '../context/AuthContext'
import PostCard from '../components/PostCard'
import EditProfileModal from '../components/EditProfileModal'

function UserPostsTab({ userId }) {
    const navigate = useNavigate()
    const fetchPage = useCallback(
        async (page) => {
            const response = await axiosClient.get(`/users/${userId}/posts`, { params: { page, size: 20 } })
            return response.data
        },
        [userId]
    )
    const { items, hasMore, loadMore, initialLoading } = useInfiniteScroll(fetchPage)

    if (initialLoading) return <div style={{ textAlign: 'center', padding: 24 }}><Spin /></div>
    if (items.length === 0) return <Empty description="No posts yet" />

    return (
        <InfiniteScroll
            dataLength={items.length}
            next={loadMore}
            hasMore={hasMore}
            loader={<div style={{ textAlign: 'center', padding: 16 }}><Spin /></div>}
            endMessage={<Divider plain>End of posts 🌊</Divider>}
        >
            {items.map((post) => (
                <PostCard key={post.id} post={post} onClick={() => navigate(`/posts/${post.id}`)} />
            ))}
        </InfiniteScroll>
    )
}

function UserCommentsTab({ userId }) {
    const navigate = useNavigate()
    const fetchPage = useCallback(
        async (page) => {
            const response = await axiosClient.get(`/users/${userId}/comments`, { params: { page, size: 20 } })
            return response.data
        },
        [userId]
    )
    const { items, hasMore, loadMore, initialLoading } = useInfiniteScroll(fetchPage)

    if (initialLoading) return <div style={{ textAlign: 'center', padding: 24 }}><Spin /></div>
    if (items.length === 0) return <Empty description="No comments yet" />

    return (
        <InfiniteScroll
            dataLength={items.length}
            next={loadMore}
            hasMore={hasMore}
            loader={<div style={{ textAlign: 'center', padding: 16 }}><Spin /></div>}
            endMessage={<Divider plain>End of comments 🌊</Divider>}
        >
            {items.map((comment) => (
                <Card
                    key={comment.id}
                    size="small"
                    hoverable
                    style={{ marginBottom: 8 }}
                    onClick={() => navigate(`/comments/${comment.id}/thread`)}
                >
                    <Space size={8} style={{ marginBottom: 4 }}>
                        <Avatar size={20} src={comment.communityAvatarUrl} />
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            {comment.communityName} · on “{comment.postTitle}”
                        </Typography.Text>
                    </Space>
                    <Typography.Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 8 }}>
                        {comment.content}
                    </Typography.Paragraph>
                    <Space size={16}>
                        <span>🌊 {comment.rippleScore}</span>
                        <span>💬 {comment.replyCount}</span>
                    </Space>
                </Card>
            ))}
        </InfiniteScroll>
    )
}

function ProfilePage() {
    const { user } = useAuth()
    const [editOpen, setEditOpen] = useState(false)

    if (!user) return null

    const items = [
        { key: 'posts', label: 'Posts', children: <UserPostsTab userId={user.id} /> },
        { key: 'comments', label: 'Comments', children: <UserCommentsTab userId={user.id} /> },
    ]

    return (
        <div>
            <Card style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Avatar size={72} src={user.avatarUrl} icon={<UserOutlined />} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <Typography.Title level={3} style={{ margin: 0 }}>{user.username}</Typography.Title>
                        <Typography.Text type="secondary">{user.email}</Typography.Text>
                        {user.createdOn ? (
                            <Typography.Paragraph type="secondary" style={{ margin: 0, fontSize: 12 }}>
                                Joined {new Date(user.createdOn).toLocaleDateString()}
                            </Typography.Paragraph>
                        ) : null}
                    </div>
                    <Button onClick={() => setEditOpen(true)}>Edit profile</Button>
                </div>
            </Card>

            <Tabs items={items} />

            <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
        </div>
    )
}

export default ProfilePage