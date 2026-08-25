import { useCallback, useEffect, useState } from 'react'
import { Avatar, Button, Card, Empty, Spin, Divider, Typography, Space, message } from 'antd'
import { TeamOutlined, UserOutlined } from '@ant-design/icons'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useNavigate, useParams } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import { handleApiError } from '../utils/errorHandler'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { useAuth } from '../context/AuthContext'
import PostCard from '../components/PostCard'

const PAGE_SIZE = 20

function CommunityPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [community, setCommunity] = useState(null)
    const [loadingCommunity, setLoadingCommunity] = useState(true)
    const [moderators, setModerators] = useState([])
    const [isMember, setIsMember] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        axiosClient
            .get(`/communities/${id}`)
            .then((response) => setCommunity(response.data))
            .catch((error) => handleApiError(error, null, 'Failed to load community'))
            .finally(() => setLoadingCommunity(false))
    }, [id])

    useEffect(() => {
        axiosClient
            .get(`/communities/${id}/members`, { params: { size: 100 } })
            .then((response) => {
                const members = response.data.content
                setModerators(members.filter((member) => member.role === 'MODERATOR'))
                setIsMember(members.some((member) => member.userId === user?.id))
            })
            .catch(() => {})
    }, [id, user])

    const fetchPage = useCallback(
        async (page) => {
            const response = await axiosClient.get(`/communities/${id}/posts`, {
                params: { page, size: PAGE_SIZE, sort: 'createdOn,desc' },
            })
            return response.data
        },
        [id]
    )

    const { items, hasMore, loadMore, initialLoading } = useInfiniteScroll(fetchPage)

    const handleMembership = async () => {
        setSubmitting(true)
        try {
            if (isMember) {
                await axiosClient.delete(`/communities/${id}/members/${user.id}`)
                setIsMember(false)
                message.success('Left the community')
            } else {
                await axiosClient.post(`/communities/${id}/members`)
                setIsMember(true)
                message.success('Joined the community!')
            }
        } catch (error) {
            handleApiError(error, null, 'Action failed')
        } finally {
            setSubmitting(false)
        }
    }

    if (loadingCommunity) {
        return (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
                <Spin size="large" />
            </div>
        )
    }

    if (!community) {
        return <Empty description="Community not found" />
    }

    return (
        <div>
            <Card
                style={{ marginBottom: 24, overflow: 'hidden' }}
                cover={
                    community.bannerUrl ? (
                        <img
                            alt={community.name}
                            src={community.bannerUrl}
                            style={{ height: 160, objectFit: 'cover' }}
                        />
                    ) : (
                        <div style={{ height: 160, background: 'linear-gradient(120deg, #0891b2, #2563eb)' }} />
                    )
                }
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Avatar size={72} src={community.avatarUrl} icon={<TeamOutlined />} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <Typography.Title level={2} style={{ margin: 0 }}>
                            {community.name}
                        </Typography.Title>
                        <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
                            {community.description}
                        </Typography.Paragraph>
                    </div>
                    <Button
                        type={isMember ? 'default' : 'primary'}
                        danger={isMember}
                        loading={submitting}
                        onClick={handleMembership}
                    >
                        {isMember ? 'Leave' : 'Join'}
                    </Button>
                </div>
            </Card>

            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    {initialLoading ? (
                        <div style={{ textAlign: 'center', paddingTop: 40 }}>
                            <Spin size="large" />
                        </div>
                    ) : items.length === 0 ? (
                        <Empty description="No posts yet" />
                    ) : (
                        <InfiniteScroll
                            dataLength={items.length}
                            next={loadMore}
                            hasMore={hasMore}
                            loader={
                                <div style={{ textAlign: 'center', padding: 16 }}>
                                    <Spin />
                                </div>
                            }
                            endMessage={<Divider plain>You have reached the end 🌊</Divider>}
                        >
                            {items.map((post) => (
                                <PostCard key={post.id} post={post} onClick={() => navigate(`/posts/${post.id}`)} />
                            ))}
                        </InfiniteScroll>
                    )}
                </div>

                <div style={{ width: 280, flexShrink: 0 }}>
                    <Card title="About">
                        <Typography.Paragraph>
                            {community.description || 'No description.'}
                        </Typography.Paragraph>
                        <Typography.Text type="secondary">
                            Created {new Date(community.createdOn).toLocaleDateString()}
                        </Typography.Text>
                    </Card>

                    <Card title="Moderators" style={{ marginTop: 16 }}>
                        {moderators.length === 0 ? (
                            <Typography.Text type="secondary">No moderators yet.</Typography.Text>
                        ) : (
                            <Space direction="vertical" size={12} style={{ width: '100%' }}>
                                {moderators.map((mod) => (
                                    <Space key={mod.userId} size={8}>
                                        <Avatar size={28} src={mod.avatarUrl} icon={<UserOutlined />} />
                                        <span>{mod.username}</span>
                                    </Space>
                                ))}
                            </Space>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default CommunityPage