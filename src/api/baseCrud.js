// ============================================================
// baseCrud.js — Generic CRUD Factory
// ============================================================

import { apiClient } from './client.js'

/**
 * Factory function that returns a standard CRUD object for any API resource.
 * Eliminates boilerplate — each resource gets getAll, getById, create, update, delete for free.
 * Custom methods can be added by spreading: { ...baseCrud('exams'), ...customMethods }
 */
export const baseCrud = (resource) => ({

    /**
     * Fetch all records. Supports optional query params for filtering or pagination.
     * e.g. getAll({ subject: 'Mathematics' })
     */
    async getAll(params = {}) {
        const response = await apiClient.get(`/${resource}`, { params })
        return response.data
    },

    /**
     * Fetch a single record by its ID.
     */
    async getById(id) {
        const response = await apiClient.get(`/${resource}/${id}`)
        return response.data
    },

    /**
     * Create a new record. Sends data as JSON body.
     */
    async create(data) {
        const response = await apiClient.post(`/${resource}`, data)
        return response.data
    },

    /**
     * Update an existing record by ID. Uses PUT — replaces the full resource.
     */
    async update(id, data) {
        const response = await apiClient.put(`/${resource}/${id}`, data)
        return response.data
    },

    /**
     * Delete a record by ID. Returns nothing — caller handles ui update.
     */
    async delete(id) {
        await apiClient.delete(`/${resource}/${id}`)
    },
})
