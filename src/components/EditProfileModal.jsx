import { useState } from 'react'
import { Avatar, Button, Form, Input, Modal, Space, Upload, message } from 'antd'
import { UploadOutlined, UserOutlined } from '@ant-design/icons'
import axiosClient from '../api/axiosClient'
import { handleApiError } from '../utils/errorHandler'
import { useAuth } from '../context/AuthContext'

function EditProfileModal({ open, onClose }) {
    const { user, updateUser } = useAuth()
    const [form] = Form.useForm()
    const [saving, setSaving] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl)

    const handleSave = async (values) => {
        setSaving(true)
        try {
            const response = await axiosClient.put('/users/me', values)
            updateUser(response.data)
            message.success('Profile updated')
            onClose()
        } catch (error) {
            handleApiError(error, form, 'Could not update profile')
        } finally {
            setSaving(false)
        }
    }

    const uploadAvatar = async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        try {
            const response = await axiosClient.put('/users/me/avatar', formData)
            setAvatarUrl(response.data.avatarUrl)
            updateUser({ ...user, avatarUrl: response.data.avatarUrl })
            message.success('Avatar updated')
        } catch (error) {
            handleApiError(error, null, 'Could not update avatar')
        }
        return false
    }

    return (
        <Modal
            open={open}
            title="Edit profile"
            onCancel={onClose}
            okText="Save"
            confirmLoading={saving}
            onOk={() => form.submit()}
        >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Space>
                    <Avatar size={64} src={avatarUrl} icon={<UserOutlined />} />
                    <Upload showUploadList={false} maxCount={1} beforeUpload={uploadAvatar}>
                        <Button icon={<UploadOutlined />}>Change avatar</Button>
                    </Upload>
                </Space>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                    initialValues={{ username: user?.username, email: user?.email }}
                >
                    <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Username is required' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Email is required' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Space>
        </Modal>
    )
}

export default EditProfileModal