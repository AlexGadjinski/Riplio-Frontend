import axios from 'axios'

const axiosClient = axios.create({
    baseURL: '/api/v1',
})

let unauthorizedHandler = null
export function setUnauthorizedHandler(handler) {
    unauthorizedHandler = handler
}

let refreshPromise = null

function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
        return Promise.reject(new Error('No refresh token available'))
    }
    return axios.post('/api/v1/auth/refresh', { refreshToken }).then((response) => {
        const { accessToken, refreshToken: newRefreshToken } = response.data
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)
        return accessToken
    })
}

axiosClient.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        const isAuthEndpoint = originalRequest?.url?.startsWith('/auth/')

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            originalRequest._retry = true
            try {
                if (!refreshPromise) {
                    refreshPromise = refreshAccessToken().finally(() => {
                        refreshPromise = null
                    })
                }
                const newAccessToken = await refreshPromise
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return axiosClient(originalRequest)
            } catch (refreshError) {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('user')
                unauthorizedHandler?.()
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default axiosClient