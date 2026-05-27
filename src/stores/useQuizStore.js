// ============================================================
// useQuizStore — Exam flow: current question, timer, answers
// ============================================================

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { answerApi } from '@/api/answers/index.js'
import {apiClient} from "@/api/client.js";
import {examApi} from "@/api/exams/index.js";

export const useQuizStore = defineStore('quiz', () => {

    // ── State ─────────────────────────────────────────────────

    // Full list of questions for the current exam
    const questions = ref([])

    // Get all students stats
    const studentStats =  ref([])

    // Index of the current question being displayed
    const currentIndex = ref(0)

    // Seconds remaining for the current question
    const timeLeft = ref(0)

    // Internal timer reference — used to clear the interval
    const timerInterval = ref(null)

    // All answers submitted during this session
    const answers = ref([])

    // Whether the exam has been completed
    const isCompleted = ref(false)

    // Check if all answers has been deleted
    const allDeleted = ref(false)

    // ── Getters ───────────────────────────────────────────────

    // The current question object
    const currentQuestion = computed(() => questions.value[currentIndex.value] ?? null)

    // Total number of questions
    const totalQuestions = computed(() => questions.value.length)

    // Progress percentage for the progress bar (0 to 100)
    const progress = computed(() => {
        if (totalQuestions.value === 0) return 0
        return Math.round((currentIndex.value / totalQuestions.value) * 100)
    })

    // Timer progress percentage for the visual countdown bar
    const timerProgress = computed(() => {
        if (!currentQuestion.value) return 0
        return Math.round((timeLeft.value / currentQuestion.value.timer_seconds) * 100)
    })

    // ── Actions ───────────────────────────────────────────────

    // Initialize the quiz with the questions from the session
    function initQuiz(examQuestions) {
        questions.value = examQuestions
        currentIndex.value = 0
        answers.value = []
        isCompleted.value = false
        startTimer()
    }

    // Start the countdown timer for the current question
    function startTimer() {
        stopTimer()
        if (!currentQuestion.value) return

        // Set the timer to the question's timer_seconds value
        timeLeft.value = currentQuestion.value.timer_seconds

        timerInterval.value = setInterval(() => {
            if (timeLeft.value > 0) {
                timeLeft.value--
            } else {
                // Time is up — save empty answer and move to next question
                saveAnswerAndAdvance(null)
            }
        }, 1000)
    }

    // Stop the current timer
    function stopTimer() {
        if (timerInterval.value) {
            clearInterval(timerInterval.value)
            timerInterval.value = null
        }
    }

    // Save the student's answer and advance to the next question
    async function saveAnswerAndAdvance(value, sessionId) {
        stopTimer()

        if (currentQuestion.value) {
            try {
                // Send the answer to the backend
                const answer = await answerApi.store({
                    exam_session_id: sessionId,
                    question_id: currentQuestion.value.id,
                    value: value,
                })
                answers.value.push(answer)
            } catch (e) {
                console.error('Failed to save answer:', e)
            }
        }

        // Move to next question or complete the exam
        if (currentIndex.value < totalQuestions.value - 1) {
            currentIndex.value++
            startTimer()
        } else {
            isCompleted.value = true
        }
    }

    // Reset the quiz state
    function resetQuiz() {
        stopTimer()
        questions.value = []
        currentIndex.value = 0
        timeLeft.value = 0
        answers.value = []
        isCompleted.value = false
    }


    // Get students stats
    async function getAll() {

        try {
            studentStats.value = await answerApi.getAll()
        } catch (e) {
            console.error('Failed to delete answers:', e)
            alert('Error: ' + e.message)
        }
    }



    // Delete all answers
    async function deleteAll() {
        try {
            const response = await answerApi.deleteAll()

            if (response?.action) {
                 allDeleted.value = true
                setTimeout(() => allDeleted.value = false, 2500)
            }
        } catch (e) {
            console.error('Failed to delete answers:', e)
            alert('Error: ' + e.message)
        }
    }

    return {
        questions,
        currentIndex,
        timeLeft,
        answers,
        isCompleted,
        currentQuestion,
        totalQuestions,
        progress,
        timerProgress,
        initQuiz,
        startTimer,
        stopTimer,
        saveAnswerAndAdvance,
        resetQuiz,
        getAll,
        studentStats,
        deleteAll,
        allDeleted
    }
})