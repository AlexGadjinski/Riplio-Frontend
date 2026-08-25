import { useParams } from 'react-router-dom'
import { Typography } from 'antd'

function PostPage() {
    const { id } = useParams()

    return (
        <div>
            <Typography.Title level={2}>Post page (coming soon)</Typography.Title>
            <p>ID: {id}</p>
        </div>
    )
}

export default PostPage