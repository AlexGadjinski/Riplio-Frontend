import { useCallback, useState } from 'react'
import { Avatar, Button, Card, Empty, Modal, Input, Space, Spin, Tag, Typography, Divider, message } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useParams } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import { handleApiError } from '../utils/errorHandler'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { useAuth } from '../context/AuthContext'

const PAGE_SIZE = 20

function MembersPage() {
    const { id } = useParams()
    const { user } = useAuth()
    const [banTarget, setBanTarget] = useState(null)
    const [banReason, setBanReason] = useState('')
    const [banning, setBanning] = useState(false)

    const fetchPage = useCallback(
        async (page) => {
            const response = await axiosClient.get(`/communities/${id}/members`, {
                params: { page, size: PAGE_SIZE },
            })
            return response.data
        },
        [id]
    )

    const { items, setItems, hasMore, loadMore, initialLoading } = useInfiniteScroll(fetchPage)

    const updateRole = async (member, role) => {
        try {
            await axiosClient.patch(`/communities/${id}/members/${member.userId}`, { role })
            setItems((prev) => prev.map((m) => (m.userId === member.userId ? { ...m, role } : m)))
            message.success('Member updated')
        } catch (error) {
            handleApiError(error, null, 'Could not update member')
        }
    }

    const removeMember = async (member) => {
        try {
            await axiosClient.delete(`/communities/${id}/members/${member.userId}`)
            setItems((prev) => prev.filter((m) => m.userId !== member.userId))
            message.success('Member removed')
        } catch (error) {
            handleApiError(error, null, 'Could not remove member')
        }
    }

    const submitBan = async () => {
        if (!banReason.trim()) {
            message.warning('Please provide a reason')
            return
        }
        setBanning(true)
        try {
            await axiosClient.post(`/communities/${id}/bans/${banTarget.userId}`, { reason: banReason })
            setItems((prev) => prev.filter((m) => m.userId !== banTarget.userId))
            message.success('Member banned')
            setBanTarget(null)
            setBanReason('')
        } catch (error) {
            handleApiError(error, null, 'Could not ban member')
        } finally {
            setBanning(false)
        }
    }

    return (
        <div>
            <Typography.Title level={2}>Manage members</Typography.Title>

            {initialLoading ? (
                <div style={{ textAlign: 'center', paddingTop: 40 }}>
                    <Spin size="large" />
                </div>
            ) : items.length === 0 ? (
                <Empty description="No members" />
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
                    endMessage={<Divider plain>End of members 🌊</Divider>}
                >
                    {items.map((member) => (
                        <Card key={member.userId} size="small" style={{ marginBottom: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                <Avatar src={member.avatarUrl} icon={<UserOutlined />} />
                                <span style={{ fontWeight: 500 }}>{member.username}</span>
                                <Tag color={member.role === 'MODERATOR' ? 'blue' : 'default'}>{member.role}</Tag>
                                <div style={{ marginLeft: 'auto' }}>
                                    {member.userId === user?.id ? (
                                        <Tag color="green">You</Tag>
                                    ) : (
                                        <Space wrap>
                                            {member.role === 'MEMBER' ? (
                                                <Button size="small" onClick={() => updateRole(member, 'MODERATOR')}>
                                                    Make moderator
                                                </Button>
                                            ) : (
                                                <Button size="small" onClick={() => updateRole(member, 'MEMBER')}>
                                                    Demote
                                                </Button>
                                            )}
                                            <Button size="small" onClick={() => removeMember(member)}>
                                                Remove
                                            </Button>
                                            <Button size="small" danger onClick={() => setBanTarget(member)}>
                                                Ban
                                            </Button>
                                        </Space>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </InfiniteScroll>
            )}

            <Modal
                open={!!banTarget}
                title={banTarget ? `Ban ${banTarget.username}` : 'Ban member'}
                onOk={submitBan}
                confirmLoading={banning}
                onCancel={() => {
                    setBanTarget(null)
                    setBanReason('')
                }}
                okText="Ban"
                okButtonProps={{ danger: true }}
            >
                <Input.TextArea
                    rows={3}
                    placeholder="Reason for ban"
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                />
            </Modal>
        </div>
    )
}

export default MembersPage