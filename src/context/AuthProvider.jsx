import { useCallback, useEffect, useMemo, useState } from 'react'
import axiosClient, { setUnauthorizedHandler } from '../api/axiosClient'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'))
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user')
        return stored ? JSON.parse(stored) : null
    })

    const clearSession = useCallback(() => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        setAccessToken(null)
        setUser(null)
    }, [])

    useEffect(() => {
        setUnauthorizedHandler(clearSession)
    }, [clearSession])

    const login = useCallback((tokens, newUser) => {
        localStorage.setItem('accessToken', tokens.accessToken)
        localStorage.setItem('refreshToken', tokens.refreshToken)
        localStorage.setItem('user', JSON.stringify(newUser))
        setAccessToken(tokens.accessToken)
        setUser(newUser)
    }, [])

    const logout = useCallback(() => {
        const storedRefreshToken = localStorage.getItem('refreshToken')
        clearSession()
        if (storedRefreshToken) {
            axiosClient.post('/auth/logout', { refreshToken: storedRefreshToken }).catch(() => {})
        }
    }, [clearSession])

    const updateUser = useCallback((newUser) => {
        localStorage.setItem('user', JSON.stringify(newUser))
        setUser(newUser)
    }, [])

    const value = useMemo(
        () => ({ accessToken, user, isAuthenticated: !!accessToken, login, logout, updateUser }),
        [accessToken, user, login, logout, updateUser]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}