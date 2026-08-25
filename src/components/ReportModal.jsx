import { useState } from 'react'
import { Modal, Select, Input, message } from 'antd'
import axiosClient from '../api/axiosClient'
import { handleApiError } from '../utils/errorHandler'

const REASONS = [
    { value: 'SPAM', label: 'Spam' },
    { value: 'HARASSMENT', label: 'Harassment' },
    { value: 'HATE_SPEECH', label: 'Hate speech' },
    { value: 'MISINFORMATION', label: 'Misinformation' },
    { value: 'OTHER', label: 'Other' },
]

function ReportModal({ open, onClose, targetType, targetId }) {
    const [reason, setReason] = useState(null)
    const [details, setDetails] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!reason) {
            message.warning('Please select a reason')
            return
        }
        setSubmitting(true)
        try {
            await axiosClient.post(`/${targetType}/${targetId}/reports`, { reason, details })
            message.success('Report submitted. Thank you!')
            setReason(null)
            setDetails('')
            onClose()
        } catch (error) {
            handleApiError(error, null, 'Could not submit report')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Modal
            open={open}
            title="Report content"
            onOk={handleSubmit}
            confirmLoading={submitting}
            onCancel={onClose}
            okText="Submit report"
        >
            <Select
                style={{ width: '100%', marginBottom: 12 }}
                placeholder="Select a reason"
                value={reason}
                onChange={setReason}
                options={REASONS}
            />
            <Input.TextArea
                rows={4}
                placeholder="Additional details (optional)"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                maxLength={2000}
                showCount
            />
        </Modal>
    )
}

export default ReportModal