<template>
  <div class="min-h-screen bg-slate-50 font-sans flex flex-col">

    <!-- ── Top bar ────────────────────────────────────────── -->
    <header class="bg-white border-b border-slate-200 px-6 py-4">
      <div class="max-w-2xl mx-auto flex items-center justify-between">

        <!-- Student name + exam progress -->
        <div>
          <p class="text-xs text-slate-400">
            {{ sessionStore.session?.exam?.title }}
          </p>
          <p class="text-sm font-medium text-slate-700 mt-0.5">
            {{ sessionStore.session?.student_name }}
          </p>
        </div>

        <!-- Question counter -->
        <div class="text-right">
          <p class="text-xs text-slate-400">Question</p>
          <p class="text-sm font-display font-semibold text-slate-700">
            {{ quizStore.currentIndex + 1 }}
            <span class="text-slate-300 font-normal">/</span>
            {{ quizStore.totalQuestions }}
          </p>
        </div>

      </div>

      <!-- Overall progress bar -->
      <div class="max-w-2xl mx-auto mt-4">
        <div class="w-full bg-slate-100 rounded-full h-1.5">
          <div
              class="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
              :style="{ width: `${quizStore.progress}%` }"
          />
        </div>
      </div>
    </header>

    <!-- ── Question area ──────────────────────────────────── -->
    <main class="flex-1 flex items-center justify-center px-4 py-10">
      <div class="w-full max-w-2xl">

        <!-- Question card -->
        <Transition name="slide-fade" mode="out-in">
          <div
              :key="quizStore.currentIndex"
              class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
          >

            <!-- Timer bar -->
            <div class="w-full bg-slate-100 h-2">
              <div
                  :class="['h-2 rounded-r-full transition-all duration-1000 ease-linear', timer.timerColor.value]"
                  :style="{ width: `${timer.percentage.value}%` }"
              />
            </div>

            <div class="px-8 py-8">

              <!-- Timer + type badge -->
              <div class="flex items-center justify-between mb-6">
                <span :class="['text-[11px] font-medium px-3 py-1.5 rounded-md', typeHelpers.typeBadgeColor.value]">
                  {{ typeHelpers.typeLabel.value }}
                </span>

                <!-- Countdown -->
                <div
                    :class="[
                    'inline-flex items-center gap-1.5 text-sm font-display font-semibold tabular-nums px-4 py-1.5 rounded-full transition-colors duration-200',
                    timer.timeLeft.value <= 10
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-slate-100 text-slate-600'
                  ]"
                >
                  <app-icon icon="tabler:clock" :size="14" />
                  {{ timer.timeLeft.value }}s
                </div>
              </div>

              <!-- Question text -->
              <h2 class="text-xl font-display font-semibold text-slate-800 leading-snug mb-8">
                {{ quizStore.currentQuestion?.text }}
              </h2>

              <!-- ── Multiple choice options ──────────────── -->
              <div
                  v-if="typeHelpers.isMultipleChoice.value"
                  class="space-y-3"
              >
                <button
                    v-for="(option, index) in quizStore.currentQuestion?.options"
                    :key="option.id"
                    @click="selectOption(option.text)"
                    :class="[
                    'w-full flex items-center gap-3 text-left text-sm px-5 py-4 rounded-xl border-2 transition-all duration-150',
                    selectedAnswer === option.text
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
                  ]"
                >
                  <!-- Letter marker -->
                  <span
                      :class="[
                        'w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold flex-shrink-0',
                        selectedAnswer === option.text
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 text-slate-500'
                      ]"
                  >
                    {{ String.fromCharCode(65 + index) }}
                  </span>
                  <span class="flex-1">{{ option.text }}</span>
                  <app-icon
                      v-if="selectedAnswer === option.text"
                      icon="tabler:check"
                      :size="18"
                      class="flex-shrink-0"
                  />
                </button>
              </div>

              <!-- ── True / False options ────────────────── -->
              <div
                  v-else-if="typeHelpers.isTrueFalse.value"
                  class="grid grid-cols-2 gap-4"
              >
                <button
                    v-for="option in quizStore.currentQuestion?.options"
                    :key="option.id"
                    @click="selectOption(option.text)"
                    :class="[
                    'flex flex-col items-center gap-2 py-6 rounded-xl border-2 font-display font-semibold text-lg transition-all duration-150',
                    selectedAnswer === option.text
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-300 hover:bg-slate-50'
                  ]"
                >
                  <app-icon
                      :icon="option.text === 'True' ? 'tabler:circle-check' : 'tabler:circle-x'"
                      :size="24"
                  />
                  {{ option.text }}
                </button>
              </div>

              <!-- ── Open answer ─────────────────────────── -->
              <div v-else-if="typeHelpers.isOpen.value">
                <textarea
                    v-model="selectedAnswer"
                    placeholder="Write your answer here..."
                    rows="5"
                    class="w-full text-sm border border-slate-200 rounded-xl px-5 py-4 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition"
                />
                <p class="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                  <app-icon icon="tabler:sparkles" :size="13" />
                  Your answer will be evaluated automatically by AI.
                </p>
              </div>

              <!-- ── Confirm button ──────────────────────── -->
              <div class="mt-8 flex items-center justify-between">

                <!-- Skip hint -->
                <p class="flex items-center gap-1.5 text-xs text-slate-300">
                  <app-icon icon="tabler:clock-exclamation" :size="13" />
                  Timer expires automatically
                </p>

                <button
                    @click="handleConfirm"
                    :disabled="!selectedAnswer"
                    class="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-medium px-8 py-3 rounded-xl transition-colors duration-200"
                >
                  Confirm
                  <app-icon icon="tabler:arrow-right" :size="16" />
                </button>

              </div>

            </div>
          </div>
        </Transition>

      </div>
    </main>

  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuizStore } from '@/stores/useQuizStore.js'
import { useSessionStore } from '@/stores/useSessionStore.js'
import { useTimer } from '@/composables/useTimer.js'
import { useQuestionType } from '@/composables/useQuestionType.js'
import AppIcon from '@/components/icons/AppIcon.vue'

const router = useRouter()
const route = useRoute()
const quizStore = useQuizStore()
const sessionStore = useSessionStore()

// ── Composables ────────────────────────────────────────────
const timer = useTimer()

// Pass current question as ref to the composable
const currentQuestion = computed(() => quizStore.currentQuestion)
const typeHelpers = useQuestionType(currentQuestion)

// ── State ──────────────────────────────────────────────────
const selectedAnswer = ref(null)

// ── Lifecycle ──────────────────────────────────────────────
onMounted(() => {
  if (!quizStore.currentQuestion) {
    // Guard — if store is empty redirect to home
    router.replace('/')
    return
  }
  startCurrentQuestion()
})

// ── Watch for question change ──────────────────────────────
watch(() => quizStore.currentIndex, () => {
  selectedAnswer.value = null
  startCurrentQuestion()
})

// Watch for exam completion
watch(() => quizStore.isCompleted, (completed) => {
  if (completed) {
    handleComplete()
  }
})

// ── Methods ────────────────────────────────────────────────

// Start timer for the current question
function startCurrentQuestion() {
  if (!quizStore.currentQuestion) return

  timer.start(
      quizStore.currentQuestion.timer_seconds,
      // Called automatically when timer expires
      () => saveAndAdvance(null)
  )
}

// Select an option
function selectOption(value) {
  selectedAnswer.value = value
}

// Confirm button clicked
function handleConfirm() {
  timer.stop()
  saveAndAdvance(selectedAnswer.value)
}

// Save answer and advance to next question
async function saveAndAdvance(value) {
  await quizStore.saveAnswerAndAdvance(
      value,
      sessionStore.session?.id
  )
}

// Complete the session and navigate to results
async function handleComplete() {
  await sessionStore.completeSession()

  // Save session ID in localStorage so student can't retake the exam
  const examId = sessionStore.session?.exam_id
  if (examId) {
    localStorage.setItem(`quizedu_session_${examId}`, route.params.sessionId)
  }

  router.push(`/student/results/${route.params.sessionId}`)
}
</script>

<style>

/* Slide fade transition between questions */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}
.slide-fade-enter-from {
  transform: translateX(30px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}
</style>