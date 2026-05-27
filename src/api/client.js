// ============================================================
// client.js — Axios API Client
// ============================================================

import axios from 'axios'

/**
 * Central Axios instance shared across the entire frontend.
 * All API calls go through this client — ensures consistent headers and base URL.
 */
export const apiClient = axios.create({
    // Base URL loaded from .env — never hardcoded
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

/**
 * Response interceptor: handles global HTTP error responses.
 * Centralizes error handling — no need to handle errors in every component.
 */
apiClient.interceptors.response.use(
    // Pass successful responses through unchanged
    (response) => response,

    (error) => {
        // Log the error for debugging during development
        console.error('API Error:', error.response?.status, error.response?.data)

        // Always re-reject so individual callers can still catch specific errors if needed
        return Promise.reject(error)
    }
)
