import { useState } from 'react'
import { Button, Input, Upload, Space } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

function CommentComposer({ onSubmit, placeholder = 'Write a comment...', submitLabel = 'Comment' }) {
    const [content, setContent] = useState('')
    const [fileList, setFileList] = useState([])
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!content.trim() && fileList.length === 0) return
        setSubmitting(true)
        const formData = new FormData()
        formData.append('content', content)
        if (fileList.length > 0) {
            formData.append('file', fileList[0].originFileObj)
        }
        const ok = await onSubmit(formData)
        if (ok) {
            setContent('')
            setFileList([])
        }
        setSubmitting(false)
    }

    return (
        <div style={{ marginBottom: 16 }}>
            <Input.TextArea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
            />
            <Space style={{ marginTop: 8 }}>
                <Button type="primary" loading={submitting} onClick={handleSubmit}>
                    {submitLabel}
                </Button>
                <Upload
                    beforeUpload={() => false}
                    maxCount={1}
                    fileList={fileList}
                    onChange={({ fileList: list }) => setFileList(list)}
                >
                    <Button icon={<UploadOutlined />}>Image</Button>
                </Upload>
            </Space>
        </div>
    )
}

export default CommentComposer