import { apiClient } from '../client.js'
import { baseCrud } from '../baseCrud.js'

export const examApi = {
    // Spread base CRUD — getAll, getById, create, update, delete for free
    ...baseCrud('exams'),

    // Custom method — fetch a single exam with all questions and options
    async getWithQuestions(id) {
        const response = await apiClient.get(`/exams/${id}`)
        return response.data
    },
}