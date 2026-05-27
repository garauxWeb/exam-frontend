import { apiClient } from '../client.js'

export const sessionApi = {
    // Start a new exam session for a student
    async start(data) {
        const response = await apiClient.post('/sessions', data)
        return response.data
    },

    // Mark the session as completed
    async complete(sessionId) {
        const response = await apiClient.patch(`/sessions/${sessionId}/complete`)
        return response.data
    },
}