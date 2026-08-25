import { useRef } from 'react'

function PostMedia({ mediaUrl, mediaType, alt }) {
    const videoRef = useRef(null)

    if (!mediaUrl) return null

    if (mediaType === 'VIDEO') {
        const handleMouseEnter = () => {
            const video = videoRef.current
            if (video) {
                video.play().catch(() => {})
            }
        }

        const handleMouseLeave = () => {
            const video = videoRef.current
            if (video) {
                video.pause()
            }
        }

        return (
            <video
                ref={videoRef}
                src={mediaUrl}
                controls
                muted
                loop
                playsInline
                preload="metadata"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '100%', maxHeight: 360, borderRadius: 8, display: 'block' }}
            />
        )
    }

    return (
        <img
            alt={alt}
            src={mediaUrl}
            style={{ maxWidth: '100%', maxHeight: 360, borderRadius: 8, display: 'block' }}
        />
    )
}

export default PostMedia