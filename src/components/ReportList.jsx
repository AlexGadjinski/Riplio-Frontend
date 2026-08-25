import { useCallback } from 'react'
import { Avatar, Button, Card, Divider, Empty, Popconfirm, Space, Spin, Tag, Typography, message } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Link } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import { handleApiError } from '../utils/errorHandler'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'

const PAGE_SIZE = 20

const REASON_LABELS = {
    SPAM: 'Spam',
    HARASSMENT: 'Harassment',
    HATE_SPEECH: 'Hate speech',
    MISINFORMATION: 'Misinformation',
    OTHER: 'Other',
}

const STATUS_COLORS = {
    PENDING: 'gold',
    DISMISSED: 'default',
    CONTENT_REMOVED: 'red',
}

function ReportList({ communityId, status }) {
    const fetchPage = useCallback(
        async (page) => {
            const params = { page, size: PAGE_SIZE }
            if (status !== 'ALL') {
                params.status = status
            }
            const response = await axiosClient.get(`/communities/${communityId}/reports`, { params })
            return response.data
        },
        [communityId, status]
    )

    const { items, setItems, hasMore, loadMore, initialLoading } = useInfiniteScroll(fetchPage)

    const resolve = async (report, resolution) => {
        try {
            await axiosClient.put(`/communities/${communityId}/reports/${report.id}`, { status: resolution })
            setItems((prev) => prev.filter((r) => r.id !== report.id))
            message.success(resolution === 'DISMISSED' ? 'Report dismissed' : 'Content removed')
        } catch (error) {
            handleApiError(error, null, 'Could not resolve report')
        }
    }

    if (initialLoading) {
        return (
            <div style={{ textAlign: 'center', paddingTop: 40 }}>
                <Spin size="large" />
            </div>
        )
    }

    if (items.length === 0) {
        return <Empty description="No reports" />
    }

    return (
        <InfiniteScroll
            dataLength={items.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
                <div style={{ textAlign: 'center', padding: 16 }}>
                    <Spin />
                </div>
            }
            endMessage={<Divider plain>End of reports 🌊</Divider>}
        >
            {items.map((report) => (
                <Card key={report.id} size="small" style={{ marginBottom: 12 }}>
                    <Space wrap style={{ marginBottom: 8 }}>
                        <Tag>{report.targetType}</Tag>
                        <Tag color="volcano">{REASON_LABELS[report.reason] || report.reason}</Tag>
                        <Tag color={STATUS_COLORS[report.status]}>{report.status}</Tag>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            {new Date(report.createdOn).toLocaleString()}
                        </Typography.Text>
                    </Space>

                    <div style={{ marginBottom: 8 }}>
                        <Space size={8}>
                            <Avatar size={24} src={report.reporterAvatarUrl} icon={<UserOutlined />} />
                            <Typography.Text type="secondary">reported by {report.reporterUsername}</Typography.Text>
                        </Space>
                    </div>

                    {report.details ? (
                        <Typography.Paragraph style={{ marginBottom: 8 }}>“{report.details}”</Typography.Paragraph>
                    ) : null}

                    <Card size="small" type="inner" style={{ marginBottom: 8, background: '#fafafa' }}>
                        {!report.contentAvailable ? (
                            <Typography.Text type="secondary" italic>[content no longer available]</Typography.Text>
                        ) : report.targetType === 'POST' && report.post ? (
                            <div>
                                <Link to={`/posts/${report.post.id}`}>
                                    <Typography.Text strong>{report.post.title}</Typography.Text>
                                </Link>
                                <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 0 }}>
                                    {report.post.content}
                                </Typography.Paragraph>
                            </div>
                        ) : report.targetType === 'COMMENT' && report.comment ? (
                            <div>
                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                    comment by {report.comment.authorUsername}
                                </Typography.Text>
                                <Typography.Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 0 }}>
                                    {report.comment.content}
                                </Typography.Paragraph>
                            </div>
                        ) : (
                            <Typography.Text type="secondary" italic>[content unavailable]</Typography.Text>
                        )}
                    </Card>

                    {report.status === 'PENDING' ? (
                        <Space>
                            <Popconfirm
                                title="Dismiss this report?"
                                onConfirm={() => resolve(report, 'DISMISSED')}
                                okText="Dismiss"
                                cancelText="Cancel"
                            >
                                <Button size="small">Dismiss</Button>
                            </Popconfirm>
                            <Popconfirm
                                title="Remove the reported content?"
                                onConfirm={() => resolve(report, 'CONTENT_REMOVED')}
                                okText="Remove"
                                okButtonProps={{ danger: true }}
                                cancelText="Cancel"
                            >
                                <Button size="small" danger>Remove content</Button>
                            </Popconfirm>
                        </Space>
                    ) : (
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            Resolved{report.resolvedByUsername ? ` by ${report.resolvedByUsername}` : ''}
                            {report.resolvedOn ? ` · ${new Date(report.resolvedOn).toLocaleDateString()}` : ''}
                        </Typography.Text>
                    )}
                </Card>
            ))}
        </InfiniteScroll>
    )
}

export default ReportList