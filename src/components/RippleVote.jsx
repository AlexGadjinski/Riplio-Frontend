import { useState } from 'react'
import { Space, Button } from 'antd'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import axiosClient from '../api/axiosClient'
import { handleApiError } from '../utils/errorHandler'

function RippleVote({ targetType, targetId, score, myRipple }) {
    const [currentScore, setCurrentScore] = useState(score)
    const [currentRipple, setCurrentRipple] = useState(myRipple)
    const [submitting, setSubmitting] = useState(false)

    const sendRipple = async (type) => {
        if (submitting) return
        setSubmitting(true)
        try {
            const response = await axiosClient.post(`/${targetType}/${targetId}/ripples`, { type })
            setCurrentScore(response.data.score)
            setCurrentRipple(response.data.type)
        } catch (error) {
            handleApiError(error, null, 'Could not register your ripple')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Space size={4} align="center">
            <Button
                type="text"
                size="small"
                icon={<CaretUpOutlined style={{ color: currentRipple === 'RISE' ? '#0ea5e9' : undefined }} />}
                onClick={() => sendRipple('RISE')}
            />
            <span style={{ fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{currentScore}</span>
            <Button
                type="text"
                size="small"
                icon={<CaretDownOutlined style={{ color: currentRipple === 'FALL' ? '#ef4444' : undefined }} />}
                onClick={() => sendRipple('FALL')}
            />
        </Space>
    )
}

export default RippleVote