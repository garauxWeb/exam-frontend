import { apiClient } from '../client.js'

export const questionApi = {
    // Create a question for a specific exam
    async create(examId, data) {
        const response = await apiClient.post(`/exams/${examId}/questions`, data)
        return response.data
    },

    // Delete a question from a specific exam
    async delete(examId, questionId) {
        await apiClient.delete(`/exams/${examId}/questions/${questionId}`)
    },
}