import { message } from 'antd'

export function handleApiError(error, form, fallbackMessage = 'Something went wrong') {
    const data = error.response?.data

    if (data?.errors && form) {
        form.setFields(
            data.errors.map((fieldError) => ({
                name: fieldError.field,
                errors: [fieldError.message],
            }))
        )
        return
    }

    message.error(data?.message || fallbackMessage)
}