import {useState} from 'react'
import {Avatar, Button, Input, message, Popconfirm, Space, Typography} from 'antd'
import {UserOutlined} from '@ant-design/icons'
import axiosClient from '../api/axiosClient'
import {handleApiError} from '../utils/errorHandler'
import {useAuth} from '../context/AuthContext'
import CommentComposer from './CommentComposer'
import PostMedia from './PostMedia'
import RippleVote from './RippleVote'
import ReportModal from './ReportModal'

function CommentNode({comment}) {
    const {user} = useAuth()
    const [replies, setReplies] = useState([])
    const [repliesLoaded, setRepliesLoaded] = useState(false)
    const [showReplies, setShowReplies] = useState(false)
    const [replyCount, setReplyCount] = useState(comment.replyCount)
    const [showReplyBox, setShowReplyBox] = useState(false)
    const [editing, setEditing] = useState(false)
    const [content, setContent] = useState(comment.content)
    const [editValue, setEditValue] = useState(comment.content)
    const [status, setStatus] = useState(comment.status)
    const [reportOpen, setReportOpen] = useState(false)

    const isActive = status === 'ACTIVE'
    const isOwner = user?.username === comment.authorUsername

    const loadReplies = async () => {
        try {
            const response = await axiosClient.get(`/comments/${comment.id}/replies`, {
                params: {size: 50, sort: 'createdOn,desc'},
            })
            setReplies(response.data.content)
            setRepliesLoaded(true)
        } catch (error) {
            handleApiError(error, null, 'Failed to load replies')
        }
    }

    const toggleReplies = async () => {
        if (!repliesLoaded) {
            await loadReplies()
        }
        setShowReplies((prev) => !prev)
    }

    const handleReply = async (formData) => {
        try {
            const response = await axiosClient.post(`/comments/${comment.id}/replies`, formData)
            setReplies((prev) => [response.data, ...prev])
            setReplyCount((prev) => prev + 1)
            setRepliesLoaded(true)
            setShowReplies(true)
            setShowReplyBox(false)
            message.success('Reply posted')
            return true
        } catch (error) {
            handleApiError(error, null, 'Could not post reply')
            return false
        }
    }

    const handleEdit = async () => {
        const formData = new FormData()
        formData.append('content', editValue)
        try {
            const response = await axiosClient.put(`/comments/${comment.id}`, formData)
            setContent(response.data.content)
            setEditing(false)
            message.success('Comment updated')
        } catch (error) {
            handleApiError(error, null, 'Could not update comment')
        }
    }

    const handleDelete = async () => {
        try {
            await axiosClient.delete(`/comments/${comment.id}`)
            setStatus('DELETED')
            setContent('[deleted]')
            message.success('Comment deleted')
        } catch (error) {
            handleApiError(error, null, 'Could not delete comment')
        }
    }

    return (
        <div style={{marginBottom: 16}}>
            <Space align="start" size={8}>
                <Avatar size={28} src={comment.authorAvatarUrl} icon={<UserOutlined/>}/>
                <div>
                    <Typography.Text strong>{comment.authorUsername}</Typography.Text>
                    <Typography.Text type="secondary" style={{marginLeft: 8, fontSize: 12}}>
                        {new Date(comment.createdOn).toLocaleDateString()}
                    </Typography.Text>
                </div>
            </Space>

            <div style={{marginLeft: 36}}>
                {editing ? (
                    <div style={{marginTop: 8}}>
                        <Input.TextArea rows={3} value={editValue} onChange={(e) => setEditValue(e.target.value)}/>
                        <Space style={{marginTop: 8}}>
                            <Button type="primary" size="small" onClick={handleEdit}>Save</Button>
                            <Button size="small" onClick={() => setEditing(false)}>Cancel</Button>
                        </Space>
                    </div>
                ) : (
                    <Typography.Paragraph
                        style={{
                            marginTop: 4,
                            marginBottom: 8,
                            ...(isActive ? {} : {fontStyle: 'italic', color: '#999'}),
                        }}
                    >
                        {content}
                    </Typography.Paragraph>
                )}

                {comment.imageUrl && isActive ? (
                    <div style={{marginBottom: 8}}>
                        <PostMedia mediaUrl={comment.imageUrl} mediaType="IMAGE" alt="comment image"/>
                    </div>
                ) : null}

                <Space size={16} style={{marginBottom: 8}} align="center">
                    {isActive ? (
                        <RippleVote
                            targetType="comments"
                            targetId={comment.id}
                            score={comment.rippleScore}
                            myRipple={comment.myRipple}
                        />
                    ) : null}
                    {isActive ? (
                        <Button type="link" size="small" style={{padding: 0}}
                                onClick={() => setShowReplyBox((p) => !p)}>
                            Reply
                        </Button>
                    ) : null}
                    {isActive && isOwner ? (
                        <Button
                            type="link"
                            size="small"
                            style={{padding: 0}}
                            onClick={() => {
                                setEditing(true)
                                setEditValue(content)
                            }}
                        >
                            Edit
                        </Button>
                    ) : null}
                    {isActive && isOwner ? (
                        <Popconfirm title="Delete this comment?" onConfirm={handleDelete} okText="Delete"
                                    cancelText="Cancel">
                            <Button type="link" size="small" danger style={{padding: 0}}>Delete</Button>
                        </Popconfirm>
                    ) : null}
                    {isActive && !isOwner ? (
                        <Button type="link" size="small" style={{padding: 0}} onClick={() => setReportOpen(true)}>
                            Report
                        </Button>
                    ) : null}
                </Space>

                {showReplyBox ? (
                    <CommentComposer onSubmit={handleReply} placeholder="Write a reply..." submitLabel="Reply"/>
                ) : null}

                {replyCount > 0 ? (
                    <div style={{marginTop: 4}}>
                        <Button type="link" size="small" style={{padding: 0}} onClick={toggleReplies}>
                            {showReplies ? 'Hide replies' : `Show replies (${replyCount})`}
                        </Button>
                    </div>
                ) : null}

                {showReplies ? (
                    <div style={{marginLeft: 16, borderLeft: '2px solid #f0f0f0', paddingLeft: 16, marginTop: 12}}>
                        {replies.map((reply) => (
                            <CommentNode key={reply.id} comment={reply}/>
                        ))}
                    </div>
                ) : null}
            </div>

            <ReportModal
                open={reportOpen}
                onClose={() => setReportOpen(false)}
                targetType="comments"
                targetId={comment.id}
            />
        </div>
    )
}

export default CommentNode