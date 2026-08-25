import { useState } from 'react'
import { Form, Input, Modal, message } from 'antd'
import axiosClient from '../api/axiosClient'
import { handleApiError } from '../utils/errorHandler'

function CreateCommunityModal({ open, onClose, onCreated }) {
    const [form] = Form.useForm()
    const [saving, setSaving] = useState(false)

    const handleCreate = async (values) => {
        setSaving(true)
        try {
            const response = await axiosClient.post('/communities', values)
            message.success('Community created')
            form.resetFields()
            onCreated(response.data)
        } catch (error) {
            handleApiError(error, form, 'Could not create community')
        } finally {
            setSaving(false)
        }
    }

    return (
        <Modal
            open={open}
            title="Create community"
            okText="Create"
            confirmLoading={saving}
            onCancel={() => {
                form.resetFields()
                onClose()
            }}
            onOk={() => form.submit()}
        >
            <Form form={form} layout="vertical" onFinish={handleCreate}>
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
                    <Input placeholder="e.g. web-developers" maxLength={30} showCount />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Description is required' }]}
                >
                    <Input.TextArea rows={4} maxLength={500} showCount placeholder="What is this community about?" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreateCommunityModal