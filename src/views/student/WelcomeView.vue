<template>
  <layout-header title="Exam page"/>
  <div class="min-h-screen bg-slate-50 font-sans flex items-center justify-center px-4">

    <div class="w-full max-w-md">

      <!-- ── Logo / Brand ──────────────────────────────────── -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-display font-semibold text-slate-800 tracking-tight">
          QuizEdu
        </h1>
        <p class="text-slate-500 text-sm mt-2">Online exam platform</p>
      </div>

      <!-- ── Card ──────────────────────────────────────────── -->
      <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        <!-- Loading exam -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-16">
          <div class="w-9 h-9 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p class="text-slate-400 text-sm">Loading exam...</p>
        </div>

        <!-- Exam not found -->
        <div v-else-if="!exam" class="text-center px-8 py-16">
          <div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <app-icon icon="tabler:search-off" :size="26" class="text-slate-400" />
          </div>
          <h2 class="font-display font-semibold text-slate-700 text-lg mb-1">Exam not found</h2>
          <p class="text-slate-400 text-sm">Please check the exam link and try again.</p>
        </div>

        <!-- Welcome form -->
        <div v-else>

          <!-- Tinted header band -->
          <div class="bg-gradient-to-r from-indigo-50 to-sky-50 px-8 py-6">
            <p class="text-[11px] font-semibold text-indigo-500 uppercase tracking-[0.08em] mb-1.5">
              You are about to start
            </p>
            <h2 class="font-display font-semibold text-slate-800 text-xl leading-snug">
              {{ exam.title }}
            </h2>
            <p class="text-slate-500 text-sm mt-1">{{ exam.subject }}</p>
          </div>

          <div class="px-8 py-7">

            <!-- Exam stats -->
            <div class="grid grid-cols-3 gap-3 mb-7">
              <div class="bg-slate-50 rounded-xl py-3 text-center">
                <div class="flex justify-center mb-1 text-slate-400">
                  <app-icon icon="tabler:list-numbers" :size="18" />
                </div>
                <p class="text-base font-display font-semibold text-slate-800">
                  {{ exam.questions?.length ?? 0 }}
                </p>
                <p class="text-[11px] text-slate-400 mt-0.5">Questions</p>
              </div>
              <div class="bg-slate-50 rounded-xl py-3 text-center">
                <div class="flex justify-center mb-1 text-slate-400">
                  <app-icon icon="tabler:clock" :size="18" />
                </div>
                <p class="text-base font-display font-semibold text-slate-800">
                  {{ totalTime }}s
                </p>
                <p class="text-[11px] text-slate-400 mt-0.5">Total time</p>
              </div>
              <div class="bg-slate-50 rounded-xl py-3 text-center">
                <div class="flex justify-center mb-1 text-slate-400">
                  <app-icon icon="tabler:writing" :size="18" />
                </div>
                <p class="text-base font-display font-semibold text-slate-800">
                  {{ exam.questions?.length ?? 0 }}
                </p>
                <p class="text-[11px] text-slate-400 mt-0.5">Answers</p>
              </div>
            </div>

            <!-- Student name input -->
            <div class="mb-6">
              <label class="block text-xs font-medium text-slate-500 mb-1.5">
                Your name
              </label>
              <input
                  v-model="studentName"
                  type="text"
                  placeholder="e.g. Maria Rossi"
                  @keyup.enter="handleStart"
                  class="w-full text-sm border border-slate-200 rounded-lg px-4 py-3 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <!-- Error -->
            <div
                v-if="error"
                class="flex items-center gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg px-4 py-3 mb-4"
            >
              <app-icon icon="tabler:alert-triangle" :size="16" class="flex-shrink-0" />
              {{ error }}
            </div>

            <!-- Start button -->
            <button
                @click="handleStart"
                :disabled="!studentName.trim() || sessionStore.loading"
                class="w-full inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium text-sm px-4 py-3 rounded-lg transition-colors duration-200"
            >
              {{ sessionStore.loading ? 'Starting...' : 'Start Exam' }}
              <app-icon v-if="!sessionStore.loading" icon="tabler:arrow-right" :size="16" />
            </button>

            <!-- Note -->
            <p class="flex items-center justify-center gap-1.5 text-xs text-slate-400 text-center mt-4">
              <app-icon icon="tabler:info-circle" :size="13" />
              Once started, the timer for each question begins immediately.
            </p>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSessionStore } from '@/stores/useSessionStore.js'
import { useQuizStore } from '@/stores/useQuizStore.js'
import { examApi } from '@/api/exams/index.js'
import AppIcon from '@/components/icons/AppIcon.vue'
import LayoutHeader from "@/components/layout/LayoutHeader.vue";

const router = useRouter()
const route = useRoute()
const sessionStore = useSessionStore()
const quizStore = useQuizStore()

// ── State ──────────────────────────────────────────────────
const studentName = ref('')
const exam = ref(null)
const loading = ref(false)
const error = ref(null)

// ── Computed ───────────────────────────────────────────────

// Total time in seconds across all questions
const totalTime = computed(() => {
  if (!exam.value?.questions) return 0
  return exam.value.questions.reduce((sum, q) => sum + q.timer_seconds, 0)
})

// ── Lifecycle ──────────────────────────────────────────────
onMounted(async () => {
  loading.value = true
  try {
    exam.value = await examApi.getWithQuestions(route.params.examId)
  } catch (e) {
    error.value = 'Failed to load exam'
  } finally {
    loading.value = false
  }
})

// ── Actions ────────────────────────────────────────────────
async function handleStart() {
  if (!studentName.value.trim()) return

  error.value = null

  const session = await sessionStore.startSession(
      exam.value.id,
      studentName.value.trim()
  )

  if (!session) {
    error.value = 'Failed to start session. Please try again.'
    return
  }

  // Initialize the quiz store with the exam questions
  quizStore.initQuiz(exam.value.questions)

  // Navigate to the quiz
  router.push(`/student/quiz/${session.id}`)
}
</script>