import { apiClient } from '../client.js'

export const answerApi = {
    // Save a student's answer — triggers AI evaluation if question type is open
    async store(data) {
        const response = await apiClient.post('/answers', data)
        return response.data
    },
    // Delete all answers
    async deleteAll() {
        const response = await apiClient.post('/answers/delete')
        return response.data
    },

    // Get teachers studentes statitics
    async getAll() {
        const response = await apiClient.get('/answers/all')
        return response.data
    },
}