import {useCallback, useEffect, useState} from 'react'
import {Avatar, Card, Divider, Empty, message, Space, Spin, Typography} from 'antd'
import {useNavigate, useParams} from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import {handleApiError} from '../utils/errorHandler'
import PostMedia from '../components/PostMedia'
import CommentComposer from '../components/CommentComposer'
import CommentNode from '../components/CommentNode'
import RippleVote from '../components/RippleVote'

function PostPage() {
    const {id} = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [comments, setComments] = useState([])
    const [commentsLoading, setCommentsLoading] = useState(true)

    useEffect(() => {
        axiosClient
            .get(`/posts/${id}`)
            .then((response) => setPost(response.data))
            .catch((error) => handleApiError(error, null, 'Failed to load post'))
            .finally(() => setLoading(false))
    }, [id])

    const loadComments = useCallback(() => {
        setCommentsLoading(true)
        axiosClient
            .get(`/posts/${id}/comments`, {params: {size: 50, sort: 'createdOn,desc'}})
            .then((response) => setComments(response.data.content))
            .catch((error) => handleApiError(error, null, 'Failed to load comments'))
            .finally(() => setCommentsLoading(false))
    }, [id])

    useEffect(() => {
        loadComments()
    }, [loadComments])

    const handleCreateComment = async (formData) => {
        try {
            const response = await axiosClient.post(`/posts/${id}/comments`, formData)
            setComments((prev) => [response.data, ...prev])
            message.success('Comment posted')
            return true
        } catch (error) {
            handleApiError(error, null, 'Could not post comment')
            return false
        }
    }

    if (loading) {
        return (
            <div style={{textAlign: 'center', paddingTop: 80}}>
                <Spin size="large"/>
            </div>
        )
    }

    if (!post) {
        return <Empty description="Post not found"/>
    }

    return (
        <div>
            <Card style={{marginBottom: 24}}>
                <Space
                    size={8}
                    style={{marginBottom: 12, cursor: 'pointer'}}
                    onClick={() => navigate(`/communities/${post.communityId}`)}
                >
                    <Avatar size={24} src={post.communityAvatarUrl}/>
                    <Typography.Text type="secondary">{post.communityName}</Typography.Text>
                </Space>
                <Typography.Title level={2} style={{marginTop: 0}}>{post.title}</Typography.Title>
                <Typography.Paragraph>{post.content}</Typography.Paragraph>
                {post.mediaUrl ? (
                    <div style={{marginBottom: 12}}>
                        <PostMedia mediaUrl={post.mediaUrl} mediaType={post.mediaType} alt={post.title}/>
                    </div>
                ) : null}
                <Space size={24} align="center">
                    <RippleVote
                        targetType="posts"
                        targetId={post.id}
                        score={post.rippleScore}
                        myRipple={post.myRipple}
                    />
                    <span>💬 {post.commentCount}</span>
                    <Typography.Text type="secondary">by {post.authorUsername}</Typography.Text>
                </Space>
            </Card>

            <Typography.Title level={4}>Comments</Typography.Title>
            <CommentComposer onSubmit={handleCreateComment} placeholder="Share your thoughts..." submitLabel="Comment"/>
            <Divider/>

            {commentsLoading ? (
                <div style={{textAlign: 'center', padding: 24}}>
                    <Spin/>
                </div>
            ) : comments.length === 0 ? (
                <Empty description="No comments yet. Be the first!"/>
            ) : (
                comments.map((comment) => <CommentNode key={comment.id} comment={comment}/>)
            )}
        </div>
    )
}

export default PostPage