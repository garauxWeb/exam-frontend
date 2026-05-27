import { ref, reactive, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useExamStore } from '@/stores/useExamStore.js'

export function useExamBuilder() {
    const router = useRouter()
    const route = useRoute()
    const examStore = useExamStore()

    // True when creating a new exam (no ID in route), false when editing
    const isCreating = computed(() => !route.params.id || route.params.id === 'create')

    // Form data for the exam title and subject
    const examForm = reactive({ title: '', subject: '' })

    // Form data for the question being added
    const questionForm = reactive({
        text: '',
        type: 'multiple_choice',
        timer_seconds: 45,
        options: defaultOptions(),
    })

    // Index of the selected correct option for multiple choice questions
    const correctOptionIndex = ref(0)

    // Selected correct answer for true/false questions
    const trueFalseCorrect = ref('True')

    // Returns four empty option objects for multiple choice questions
    function defaultOptions() {
        return [
            { text: '', is_correct: false },
            { text: '', is_correct: false },
            { text: '', is_correct: false },
            { text: '', is_correct: false },
        ]
    }

    // Reset options and correct answer selections when the question type changes
    watch(() => questionForm.type, () => {
        correctOptionIndex.value = 0
        trueFalseCorrect.value = 'True'
        questionForm.options = defaultOptions()
    })

    // Create a new exam and redirect to its builder page
    async function handleCreateExam() {
        const exam = await examStore.createExam(examForm)
        if (exam) {
            await examStore.fetchById(exam.id)
            router.replace(`/teacher/exams/${exam.id}`)
        }
    }

    // Build the options payload and add the question to the current exam
    async function handleAddQuestion() {
        if (!examStore.currentExam?.id) return

        const examId = examStore.currentExam.id
        let options = []

        if (questionForm.type === 'multiple_choice') {
            // Mark as correct only the option matching the selected index
            const correctText = questionForm.options[correctOptionIndex.value]?.text
            options = questionForm.options
                .filter(opt => opt.text.trim() !== '')
                .map(opt => ({ text: opt.text, is_correct: opt.text === correctText }))
        }

        if (questionForm.type === 'true_false') {
            // Always send both options; mark the selected one as correct
            options = [
                { text: 'True', is_correct: trueFalseCorrect.value === 'True' },
                { text: 'False', is_correct: trueFalseCorrect.value === 'False' },
            ]
        }

        await examStore.addQuestion(examId, {
            text: questionForm.text,
            type: questionForm.type,
            timer_seconds: questionForm.timer_seconds,
            // Order is based on the current number of questions
            order: examStore.currentExam.questions.length,
            options,
        })

        // Reset the question form after submission
        questionForm.text = ''
        questionForm.timer_seconds = 45
        correctOptionIndex.value = 0
    }

    // Delete a question from the current exam
    async function handleDeleteQuestion(questionId) {
        await examStore.deleteQuestion(examStore.currentExam.id, questionId)
    }

    return {
        isCreating,
        examForm,
        questionForm,
        correctOptionIndex,
        trueFalseCorrect,
        handleCreateExam,
        handleAddQuestion,
        handleDeleteQuestion,
    }
}