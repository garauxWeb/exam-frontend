import { useRouter } from 'vue-router'
import { useTeacherStore } from '@/stores/useTeacherStore.js'
import { storeToRefs } from 'pinia'

export function useTeacherExamResults() {
    const router = useRouter()
    const teacherStore = useTeacherStore()
    const { showStudentStats, showDeleteModal, examToDelete } = storeToRefs(teacherStore)

    function goToBuilder(examId) {
        router.push(`/teacher/exams/${examId}`)
    }

    function scorePercent(exam) {
        const total = exam.total_correct + exam.total_wrong
        return total === 0 ? 0 : Math.round((exam.total_correct / total) * 100)
    }

    return {
        // States will be reactive everywhere
        showStudentStats,
        showDeleteModal,
        examToDelete,
        // Actions
        toggleStudentStats: teacherStore.toggleStudentStats,
        confirmDelete: teacherStore.confirmDelete,
        resetDelete: teacherStore.resetDelete,
        // Helpers
        goToBuilder,
        scorePercent
    }
}