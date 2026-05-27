// ============================================================
// useExamStore — Teacher side: exam and question management
// ============================================================

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { examApi } from '@/api/exams/index.js'
import { questionApi } from '@/api/questions/index.js'

export const useExamStore = defineStore('exam', () => {

    // ── State ─────────────────────────────────────────────────

    // List of all exams shown in the teacher dashboard
    const exams = ref([])

    // Currently selected exam with its questions and options
    const currentExam = ref(null)

    // Loading and error state for ui feedback
    const loading = ref(false)
    const error = ref(null)

    // ── Actions ───────────────────────────────────────────────

    // Fetch all exams from the API
    async function fetchAll() {
        loading.value = true
        error.value = null
        try {
            exams.value = await examApi.getAll()
        } catch (e) {
            error.value = 'Failed to load exams'
        } finally {
            loading.value = false
        }
    }

    // Fetch a single exam with all its questions and options
    async function fetchById(id) {
        loading.value = true
        error.value = null
        try {
            currentExam.value = await examApi.getWithQuestions(id)
        } catch (e) {
            error.value = 'Failed to load exam'
        } finally {
            loading.value = false
        }
    }

    // Create a new exam and add it to the list
    async function createExam(data) {
        loading.value = true
        error.value = null
        try {
            const exam = await examApi.create(data)
            exams.value.push(exam)
            return exam
        } catch (e) {
            error.value = 'Failed to create exam'
        } finally {
            loading.value = false
        }
    }

    // Add a question to the current exam
    async function addQuestion(examId, data) {
        loading.value = true
        error.value = null
        try {
            const question = await questionApi.create(examId, data)
            // Append the new question to the current exam's question list
            if (currentExam.value) {
                currentExam.value.questions.push(question)
            }
            return question
        } catch (e) {
            error.value = 'Failed to add question'
        } finally {
            loading.value = false
        }
    }

    // Delete a question from the current exam
    async function deleteQuestion(examId, questionId) {
        try {
            await questionApi.delete(examId, questionId)
            // Remove the question from the local state without refetching
            if (currentExam.value) {
                currentExam.value.questions = currentExam.value.questions
                    .filter(q => q.id !== questionId)
            }
        } catch (e) {
            error.value = 'Failed to delete question'
        }
    }

    // Delete an exam and remove it from the list
    async function deleteExam(id) {
        try {
            await examApi.delete(id)
            exams.value = exams.value.filter(e => e.id !== id)
        } catch (e) {
            error.value = 'Failed to delete exam'
        }
    }

    return {
        exams,
        currentExam,
        loading,
        error,
        fetchAll,
        fetchById,
        createExam,
        addQuestion,
        deleteQuestion,
        deleteExam,
    }
})