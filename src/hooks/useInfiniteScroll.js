import { useState, useEffect, useRef } from 'react'

export function useInfiniteScroll(fetchPage) {
    const [items, setItems] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [initialLoading, setInitialLoading] = useState(true)
    const pageRef = useRef(0)
    const loadingRef = useRef(false)

    const loadMore = async () => {
        if (loadingRef.current) return
        loadingRef.current = true
        try {
            const data = await fetchPage(pageRef.current)
            setItems((prev) => [...prev, ...data.content])
            setHasMore(!data.last)
            pageRef.current += 1
        } catch {
            setHasMore(false)
        } finally {
            loadingRef.current = false
            setInitialLoading(false)
        }
    }

    useEffect(() => {
        loadMore()
    }, [])

    return { items, hasMore, loadMore, initialLoading }
}