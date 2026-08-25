import { useEffect, useState } from 'react'
import { Avatar, Button, Card, Form, Input, Select, Space, Spin, Typography, Upload, Popconfirm, message } from 'antd'
import { UploadOutlined, TeamOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import { handleApiError } from '../utils/errorHandler'

function CommunitySettingsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [community, setCommunity] = useState(null)
    const [loading, setLoading] = useState(true)
    const [savingInfo, setSavingInfo] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [bannerUrl, setBannerUrl] = useState(null)
    const [moderators, setModerators] = useState([])
    const [newOwnerId, setNewOwnerId] = useState(null)
    const [transferring, setTransferring] = useState(false)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        axiosClient
            .get(`/communities/${id}`)
            .then((response) => {
                setCommunity(response.data)
                setAvatarUrl(response.data.avatarUrl)
                setBannerUrl(response.data.bannerUrl)
                form.setFieldsValue({ name: response.data.name, description: response.data.description })
            })
            .catch((error) => handleApiError(error, null, 'Failed to load community'))
            .finally(() => setLoading(false))
    }, [id, form])

    useEffect(() => {
        axiosClient
            .get(`/communities/${id}/members`, { params: { role: 'MODERATOR', size: 100 } })
            .then((response) => setModerators(response.data.content))
            .catch(() => {})
    }, [id])

    const handleSaveInfo = async (values) => {
        setSavingInfo(true)
        try {
            const response = await axiosClient.put(`/communities/${id}`, values)
            setCommunity(response.data)
            message.success('Community updated')
            navigate(`/communities/${id}`)
        } catch (error) {
            handleApiError(error, form, 'Could not update community')
        } finally {
            setSavingInfo(false)
        }
    }

    const uploadImage = async (file, kind) => {
        const formData = new FormData()
        formData.append('file', file)
        try {
            const response = await axiosClient.put(`/communities/${id}/${kind}`, formData)
            if (kind === 'avatar') {
                setAvatarUrl(response.data.avatarUrl)
            } else {
                setBannerUrl(response.data.bannerUrl)
            }
            message.success(`${kind === 'avatar' ? 'Avatar' : 'Banner'} updated`)
        } catch (error) {
            handleApiError(error, null, 'Could not upload image')
        }
        return false
    }

    const handleTransfer = async () => {
        if (!newOwnerId) {
            message.warning('Select a moderator first')
            return
        }
        setTransferring(true)
        try {
            const response = await axiosClient.put(`/communities/${id}/owner`, { newOwnerId })
            message.success(`Ownership transferred to ${response.data.newOwnerUsername}`)
            setNewOwnerId(null)
        } catch (error) {
            handleApiError(error, null, 'Could not transfer ownership')
        } finally {
            setTransferring(false)
        }
    }

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await axiosClient.delete(`/communities/${id}`)
            message.success('Community deleted')
            navigate('/communities')
        } catch (error) {
            handleApiError(error, null, 'Could not delete community')
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
                <Spin size="large" />
            </div>
        )
    }

    if (!community) {
        return null
    }

    return (
        <div>
            <Typography.Title level={2}>Community settings</Typography.Title>

            <Card title="General" style={{ marginBottom: 16 }}>
                <Form form={form} layout="vertical" onFinish={handleSaveInfo}>
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Description is required' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={savingInfo}>
                        Save changes
                    </Button>
                </Form>
            </Card>

            <Card title="Appearance" style={{ marginBottom: 16 }}>
                <Space size={32} wrap align="start">
                    <div>
                        <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                            Avatar
                        </Typography.Text>
                        <Space>
                            <Avatar size={64} src={avatarUrl} icon={<TeamOutlined />} />
                            <Upload showUploadList={false} maxCount={1} beforeUpload={(file) => uploadImage(file, 'avatar')}>
                                <Button icon={<UploadOutlined />}>Change avatar</Button>
                            </Upload>
                        </Space>
                    </div>
                    <div>
                        <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                            Banner
                        </Typography.Text>
                        <Space direction="vertical">
                            {bannerUrl ? (
                                <img
                                    src={bannerUrl}
                                    alt="banner"
                                    style={{ width: 240, height: 80, objectFit: 'cover', borderRadius: 8 }}
                                />
                            ) : null}
                            <Upload showUploadList={false} maxCount={1} beforeUpload={(file) => uploadImage(file, 'banner')}>
                                <Button icon={<UploadOutlined />}>Change banner</Button>
                            </Upload>
                        </Space>
                    </div>
                </Space>
            </Card>

            <Card title="Transfer ownership" style={{ marginBottom: 16 }}>
                <Space wrap>
                    <Select
                        style={{ minWidth: 240 }}
                        placeholder="Select a moderator"
                        value={newOwnerId}
                        onChange={setNewOwnerId}
                        options={moderators.map((m) => ({ value: m.userId, label: m.username }))}
                    />
                    <Popconfirm
                        title="Transfer ownership to this moderator?"
                        onConfirm={handleTransfer}
                        okText="Transfer"
                        cancelText="Cancel"
                    >
                        <Button loading={transferring}>Transfer</Button>
                    </Popconfirm>
                </Space>
                <Typography.Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
                    Ownership can only be transferred to a moderator.
                </Typography.Paragraph>
            </Card>

            <Card title={<span style={{ color: '#cf1322' }}>Danger zone</span>}>
                <Popconfirm
                    title="Delete this community permanently?"
                    onConfirm={handleDelete}
                    okText="Delete"
                    okButtonProps={{ danger: true }}
                    cancelText="Cancel"
                >
                    <Button danger loading={deleting}>
                        Delete community
                    </Button>
                </Popconfirm>
            </Card>
        </div>
    )
}

export default CommunitySettingsPage