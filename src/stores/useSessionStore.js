// ============================================================
// useSessionStore — Student side: session lifecycle management
// ============================================================

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { sessionApi } from '@/api/sessions/index.js'

export const useSessionStore = defineStore('session', () => {

    // ── State ─────────────────────────────────────────────────

    // Active session data returned by the API
    const session = ref(null)

    // Student name entered on the welcome page
    const studentName = ref('')

    const loading = ref(false)
    const error = ref(null)

    // ── Actions ───────────────────────────────────────────────

    // Start a new exam session for the student
    async function startSession(examId, studentName) {
        loading.value = true
        error.value = null
        try {
            session.value = await sessionApi.start({
                exam_id: examId,
                student_name: studentName,
            })
            return session.value
        } catch (e) {
            error.value = 'Failed to start session'
        } finally {
            loading.value = false
        }
    }

    // Mark the current session as completed
    async function completeSession() {
        if (!session.value) return
        try {
            session.value = await sessionApi.complete(session.value.id)
        } catch (e) {
            error.value = 'Failed to complete session'
        }
    }

    // Reset session state — called when student leaves the exam
    function resetSession() {
        session.value = null
        studentName.value = ''
        error.value = null
    }

    return {
        session,
        studentName,
        loading,
        error,
        startSession,
        completeSession,
        resetSession,
    }
})