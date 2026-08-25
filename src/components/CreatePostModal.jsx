import { useState } from 'react'
import { Button, Form, Input, Modal, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import axiosClient from '../api/axiosClient'
import { handleApiError } from '../utils/errorHandler'

function CreatePostModal({ open, onClose, communityId, onCreated }) {
    const [form] = Form.useForm()
    const [saving, setSaving] = useState(false)
    const [fileList, setFileList] = useState([])

    const reset = () => {
        form.resetFields()
        setFileList([])
    }

    const handleCreate = async (values) => {
        setSaving(true)
        const formData = new FormData()
        formData.append('title', values.title)
        if (values.content) {
            formData.append('content', values.content)
        }
        if (fileList[0]?.originFileObj) {
            formData.append('file', fileList[0].originFileObj)
        }
        try {
            const response = await axiosClient.post(`/communities/${communityId}/posts`, formData)
            message.success('Post created')
            reset()
            onCreated(response.data)
        } catch (error) {
            handleApiError(error, form, 'Could not create post')
        } finally {
            setSaving(false)
        }
    }

    return (
        <Modal
            open={open}
            title="Create post"
            okText="Post"
            confirmLoading={saving}
            onCancel={() => {
                reset()
                onClose()
            }}
            onOk={() => form.submit()}
        >
            <Form form={form} layout="vertical" onFinish={handleCreate}>
                <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Title is required' }]}>
                    <Input maxLength={100} showCount placeholder="An interesting title" />
                </Form.Item>
                <Form.Item label="Content" name="content">
                    <Input.TextArea rows={5} placeholder="Share your thoughts... (optional)" />
                </Form.Item>
                <Form.Item label="Media">
                    <Upload
                        beforeUpload={() => false}
                        maxCount={1}
                        fileList={fileList}
                        onChange={({ fileList: fl }) => setFileList(fl)}
                        listType="picture"
                    >
                        <Button icon={<UploadOutlined />}>Select file</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreatePostModal