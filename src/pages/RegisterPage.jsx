import {useState} from 'react'
import {Button, Card, Form, Input, message} from 'antd'
import {Link, useNavigate} from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import Logo from '../components/Logo'
import {handleApiError} from '../utils/errorHandler'

function RegisterPage() {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const onFinish = async (values) => {
        setLoading(true)
        try {
            await axiosClient.post('/auth/register', values)
            message.success('Registration successful, please sign in')
            navigate('/login')
        } catch (error) {
            handleApiError(error, form, 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60}}>
            <Logo/>
            <Card title="Create your Riplio account" style={{width: 360}}>
                <Form form={form} layout="vertical" onFinish={onFinish} validateTrigger="onSubmit">
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{required: true, message: 'Username is required'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{required: true, message: 'Email is required'}]}
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
                            Register
                        </Button>
                    </Form.Item>
                </Form>
                <div style={{textAlign: 'center'}}>
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </Card>
        </div>
    )
}

export default RegisterPage