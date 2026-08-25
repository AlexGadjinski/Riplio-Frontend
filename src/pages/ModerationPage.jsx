import { useState } from 'react'
import { Segmented, Typography } from 'antd'
import { useParams } from 'react-router-dom'
import ReportList from '../components/ReportList'

const OPTIONS = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Dismissed', value: 'DISMISSED' },
    { label: 'Removed', value: 'CONTENT_REMOVED' },
    { label: 'All', value: 'ALL' },
]

function ModerationPage() {
    const { id } = useParams()
    const [status, setStatus] = useState('PENDING')

    return (
        <div>
            <Typography.Title level={2}>Reports</Typography.Title>
            <Segmented options={OPTIONS} value={status} onChange={setStatus} style={{ marginBottom: 16 }} />
            <ReportList key={status} communityId={id} status={status} />
        </div>
    )
}

export default ModerationPage