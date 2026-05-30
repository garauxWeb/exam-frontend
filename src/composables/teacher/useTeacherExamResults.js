import { useRouter } from 'vue-router'
import { useTeacherStore } from '@/stores/useTeacherStore.js'
import { storeToRefs } from 'pinia'

export function useTeacherExamResults() {
    const router = useRouter()
    const teacherStore = useTeacherStore()
    const { showStudentStats } = storeToRefs(teacherStore)

    function goToBuilder(examId) {
        router.push(`/teacher/exams/${examId}`)
    }

    function goToCreate() {
        router.push('/teacher/exams/create')
    }

    function scorePercent(exam) {
        const total = exam.total_correct + exam.total_wrong
        return total === 0 ? 0 : Math.round((exam.total_correct / total) * 100)
    }

    return {
        showStudentStats,
        toggleStudentStats: teacherStore.toggleStudentStats,
        goToBuilder,
        goToCreate,
        scorePercent,
    }
}