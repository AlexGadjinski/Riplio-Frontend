import { useCallback } from 'react'
import { Avatar, Button, Card, Empty, Spin, Typography, Divider, Popconfirm, message } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useParams } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import { handleApiError } from '../utils/errorHandler'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'

const PAGE_SIZE = 20

function BansPage() {
    const { id } = useParams()

    const fetchPage = useCallback(
        async (page) => {
            const response = await axiosClient.get(`/communities/${id}/bans`, {
                params: { page, size: PAGE_SIZE },
            })
            return response.data
        },
        [id]
    )

    const { items, setItems, hasMore, loadMore, initialLoading } = useInfiniteScroll(fetchPage)

    const unban = async (ban) => {
        try {
            await axiosClient.delete(`/communities/${id}/bans/${ban.bannedUserId}`)
            setItems((prev) => prev.filter((b) => b.bannedUserId !== ban.bannedUserId))
            message.success('Member unbanned')
        } catch (error) {
            handleApiError(error, null, 'Could not unban member')
        }
    }

    return (
        <div>
            <Typography.Title level={2}>Banned users</Typography.Title>

            {initialLoading ? (
                <div style={{ textAlign: 'center', paddingTop: 40 }}>
                    <Spin size="large" />
                </div>
            ) : items.length === 0 ? (
                <Empty description="No banned users" />
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
                    endMessage={<Divider plain>End of list 🌊</Divider>}
                >
                    {items.map((ban) => (
                        <Card key={ban.bannedUserId} size="small" style={{ marginBottom: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                <Avatar src={ban.bannedAvatarUrl} icon={<UserOutlined />} />
                                <div>
                                    <div style={{ fontWeight: 500 }}>{ban.bannedUsername}</div>
                                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                        {ban.reason}
                                    </Typography.Text>
                                </div>
                                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                    <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                                        by {ban.bannedByUsername} · {new Date(ban.bannedOn).toLocaleDateString()}
                                    </Typography.Text>
                                    <Popconfirm
                                        title="Unban this member?"
                                        onConfirm={() => unban(ban)}
                                        okText="Unban"
                                        cancelText="Cancel"
                                    >
                                        <Button size="small" style={{ marginTop: 4 }}>Unban</Button>
                                    </Popconfirm>
                                </div>
                            </div>
                        </Card>
                    ))}
                </InfiniteScroll>
            )}
        </div>
    )
}

export default BansPage