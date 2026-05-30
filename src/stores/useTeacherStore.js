import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useQuizStore } from './useQuizStore.js'

export const useTeacherStore = defineStore('teacher', () => {
    const showStudentStats = ref(false)
    const answerStore = useQuizStore()

    async function toggleStudentStats() {
        showStudentStats.value = !showStudentStats.value
        await answerStore.getAll()
    }

    return {
        showStudentStats,
        toggleStudentStats,
    }
})