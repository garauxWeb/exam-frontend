import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useQuizStore } from './useQuizStore.js'

export const useTeacherStore = defineStore('teacher', () => {
    const showStudentStats = ref(false)
    const showDeleteModal = ref(false)
    const examToDelete = ref(null)

    const answerStore = useQuizStore()

    async function toggleStudentStats() {
        showStudentStats.value = !showStudentStats.value
        await answerStore.getAll()
    }

    function confirmDelete(examId) {
        examToDelete.value = examId
        showDeleteModal.value = true
    }

    function resetDelete() {
        showDeleteModal.value = false
        examToDelete.value = null
    }

    return {
        showStudentStats,
        showDeleteModal,
        examToDelete,
        toggleStudentStats,
        confirmDelete,
        resetDelete
    }
})