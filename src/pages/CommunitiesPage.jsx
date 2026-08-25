import { useCallback } from 'react'
import { Card, Avatar, Spin, Empty, Divider, Typography } from 'antd'
import { TeamOutlined } from '@ant-design/icons'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'

const PAGE_SIZE = 20

function CommunitiesPage() {
    const navigate = useNavigate()

    const fetchPage = useCallback(async (page) => {
        const response = await axiosClient.get('/communities', {
            params: { page, size: PAGE_SIZE, sort: 'createdOn,desc' },
        })
        return response.data
    }, [])

    const { items, hasMore, loadMore, initialLoading } = useInfiniteScroll(fetchPage)

    if (initialLoading) {
        return (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
                <Spin size="large" />
            </div>
        )
    }

    return (
        <div>
            <Typography.Title level={2} style={{ marginBottom: 4 }}>
                Communities
            </Typography.Title>
            <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
                Discover communities and dive in.
            </Typography.Paragraph>

            {items.length === 0 ? (
                <Empty description="No communities yet" />
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
                    {items.map((community) => (
                        <Card
                            key={community.id}
                            hoverable
                            onClick={() => navigate(`/communities/${community.id}`)}
                            style={{ marginBottom: 16, overflow: 'hidden' }}
                            cover={
                                community.bannerUrl ? (
                                    <img
                                        alt={community.name}
                                        src={community.bannerUrl}
                                        style={{ height: 120, objectFit: 'cover' }}
                                    />
                                ) : undefined
                            }
                        >
                            <Card.Meta
                                avatar={<Avatar size={56} src={community.avatarUrl} icon={<TeamOutlined />} />}
                                title={community.name}
                                description={community.description}
                            />
                        </Card>
                    ))}
                </InfiniteScroll>
            )}
        </div>
    )
}

export default CommunitiesPage