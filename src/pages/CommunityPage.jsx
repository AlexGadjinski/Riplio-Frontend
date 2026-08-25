import { useParams } from 'react-router-dom'
import { Typography } from 'antd'

function CommunityPage() {
    const { id } = useParams()

    return (
        <div>
            <Typography.Title level={2}>Community page (coming soon)</Typography.Title>
            <p>ID: {id}</p>
        </div>
    )
}

export default CommunityPage