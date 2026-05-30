import { ref } from 'vue'

export function useExamResults() {

    const students = ref(['Rebecca','Daniel'])

    const getStudentAvatar = (name) => {
        if(students.value.includes(name)) {
            return `/images/students/${name.toLowerCase()}.png`
        }
        return '/images/students/no-image.jpg'

    }

    const checkIfAnswerIsCorrect = (answer) => {
        if (answer.question?.type === 'open') return null

        return answer.question.options?.some(q => q.text === answer.value && q.is_correct === true) ?? false
    }

    const getRightAnswer = (answer) => {
        // Le domande aperte non hanno opzioni
        if (answer.question?.type === 'open') return null

        const studentAnswer = answer.value
        const correctOption = answer.question.options?.find(q => q.is_correct === true)

        if (!correctOption) return null

        if (studentAnswer !== correctOption.text) {
            return correctOption.text
        }

        return null
    }

    const getFinalExamResult = (val) => {
        if (val >= 100) {
            return '<p class="text-green-500">Exam passed</p><p class="text-green-500">Excellent result</p>'
        }
        if (val >= 72) {
            return '<p class="text-green-500">Exam passed</p><p class="text-green-500">Very good result</p>'
        }
        if (val >= 63) {
            return '<p class="text-green-500">Exam passed</p><p class="text-orange-300">Good Result</p>'
        }
        if (val >= 62) {
            return '<p class="text-green-500">Exam passed</p><p class="text-orange-300">Average result</p>'
        }
        return '<span class="text-red-500">Exam not passed</span>'
    }

    function getTypeLabel(type) {
        const labels = {
            multiple_choice: 'Multiple Choice',
            true_false: 'True / False',
            open: 'Open Answer',
        }
        return labels[type] ?? type
    }

    function getTypeBadge(type) {
        const colors = {
            multiple_choice: 'bg-blue-100 text-blue-700',
            true_false: 'bg-purple-100 text-purple-700',
            open: 'bg-amber-100 text-amber-700',
        }
        return colors[type] ?? 'bg-gray-100 text-gray-600'
    }

    function getAnswerStatusIcon(answer) {
        if (answer.question?.type === 'open') return 'tabler:sparkles'
        return answer.is_correct ? 'tabler:check' : 'tabler:x'
    }

    function getAnswerStatusColor(answer) {
        if (answer.question?.type === 'open') return 'bg-amber-100 text-amber-600'
        return answer.is_correct
            ? 'bg-emerald-100 text-emerald-600'
            : 'bg-rose-100 text-rose-500'
    }

    function answerAccent(answer) {
        if (answer.question?.type === 'open') return 'border-l-amber-400'
        return answer.is_correct ? 'border-l-emerald-500' : 'border-l-rose-400'
    }

    return {
        students,
        getStudentAvatar,
        checkIfAnswerIsCorrect,
        getRightAnswer,
        getFinalExamResult,
        getTypeLabel,
        getTypeBadge,
        getAnswerStatusIcon,
        getAnswerStatusColor,
        answerAccent
    }
}