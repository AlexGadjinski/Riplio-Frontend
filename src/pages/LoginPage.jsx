import {useState} from 'react'
import {Button, Card, Form, Input, message} from 'antd'
import {Link, useNavigate} from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import {useAuth} from '../context/AuthContext'
import Logo from '../components/Logo'
import {handleApiError} from '../utils/errorHandler'

function LoginPage() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const {login} = useAuth()

    const onFinish = async (values) => {
        setLoading(true)
        try {
            const loginResponse = await axiosClient.post('/auth/login', values)
            const accessToken = loginResponse.data.accessToken
            localStorage.setItem('token', accessToken)

            const meResponse = await axiosClient.get('/users/me')
            login(accessToken, meResponse.data)

            message.success('Logged in successfully')
            navigate('/')
        } catch (error) {
            localStorage.removeItem('token')
            handleApiError(error, null, 'Invalid username or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60}}>
            <Logo/>
            <Card title="Sign in to Riplio" style={{width: 360}}>
                <Form layout="vertical" onFinish={onFinish} validateTrigger="onSubmit">
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{required: true, message: 'Username is required'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{required: true, message: 'Password is required'}]}
                    >
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Sign in
                        </Button>
                    </Form.Item>
                </Form>
                <div style={{textAlign: 'center'}}>
                    No account? <Link to="/register">Register</Link>
                </div>
            </Card>
        </div>
    )
}

export default LoginPage