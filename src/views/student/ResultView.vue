<template>
  <div class="min-h-screen bg-slate-50 font-sans flex flex-col">

    <!-- ── Header ─────────────────────────────────────────── -->
    <student-header title="Student Dashboard" :show-back-button="false"/>

    <!-- ── Main ───────────────────────────────────────────── -->
    <main class="flex-1 max-w-6xl mx-auto w-full py-10">

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-28">
        <div class="w-9 h-9 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p class="text-slate-400 text-sm">Loading results...</p>
      </div>

      <!-- Error -->
      <div
          v-else-if="error"
          class="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl px-6 py-4"
      >
        <app-icon icon="tabler:alert-triangle" :size="20" class="flex-shrink-0" />
        {{ error }}
      </div>

      <div v-else-if="results">

        <!-- ── Score summary card ──────────────────────────── -->
        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">

          <!-- Tinted header band -->
          <div class="bg-gradient-to-r from-indigo-50 to-sky-50 px-8 py-7 flex items-start justify-between flex-wrap gap-6">

            <!-- Student info -->
            <div>
              <p class="text-[11px] font-semibold text-indigo-500 uppercase tracking-[0.08em] mb-1.5">
                Results for
              </p>
              <h2 class="text-2xl font-display font-semibold text-slate-800 leading-tight">
                {{ results.student_name }}
              </h2>
              <p class="text-slate-500 text-sm mt-1.5">
                {{ results.exam?.title }} · {{ results.exam?.subject }}
              </p>
            </div>

            <!-- Score ring -->
            <div class="flex flex-col items-center">
              <div class="relative w-20 h-20">
                <svg class="w-full h-full -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none"
                          class="stroke-slate-200" stroke-width="6" />
                  <circle cx="40" cy="40" r="34" fill="none"
                          :class="ringColor" stroke-width="6" stroke-linecap="round"
                          :stroke-dasharray="ringCircumference"
                          :stroke-dashoffset="ringOffset"
                          style="transition: stroke-dashoffset .6s ease" />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center leading-none">
                  <span class="text-lg font-display font-bold text-slate-800">
                    {{ correctCount }}
                  </span>
                  <span class="text-[10px] text-slate-400 mt-0.5">/ {{ totalCount }}</span>
                </div>
              </div>
              <p class="text-[11px] text-slate-400 mt-1.5">Correct</p>
            </div>

          </div>

          <!-- Stats row -->
          <div class="grid grid-cols-4 gap-3 px-8 py-6">
            <div class="bg-slate-50 py-8  relative rounded-sm">
              <div class="absolute top-[-14px]  border bg-blue-500 text-white text-xs px-2 rounded-sm">Scores</div>
              <div class="flex justify-center items-center">
                <p class="text-2xl font-display font-semibold text-slate-800">
                  {{ scorePercentage }}%
                </p>
              </div>
            </div>

            <div class="bg-slate-50 rounded-xl py-4 text-center">
              <p class="text-2xl font-display font-semibold text-emerald-600">
                {{ correctCount }}
              </p>
              <p class="text-xs text-slate-400 mt-1">Correct</p>
            </div>

            <div class="bg-slate-50 rounded-xl py-4 text-center">
              <p class="text-2xl font-display font-semibold text-rose-500">
                {{ wrongCount }}
              </p>
              <p class="text-xs text-slate-400 mt-1">Wrong / Skipped</p>
            </div>

            <div class="bg-slate-50 rounded-xl py-4 flex justify-center items-center">
              <p class="text-sm font-display font-semibold text-rose-500" v-html="getFinalExamResult(scorePercentage)"/>
            </div>
          </div>

        </div>

        <!-- ── Answer breakdown ────────────────────────────── -->
        <div class="flex">
          <button
              @click="openAnswersTab(false)"
              class="font-display font-semibold text-slate-700 text-sm mb-4 bg-green-100 py-1 px-4 mr-3">
            Answers list
          </button>
          <button
              @click="openAnswersTab(true)"
              class="font-display font-semibold text-slate-700 text-sm mb-4 bg-green-300 py-1 px-4">
            Show result details
          </button>
        </div>

        <!-- ── Answers list ────────────────────────────── -->
        <div class="space-y-3" v-if="!showDetailsResult">
          <answer-summary-card
              v-for="answer in results.answers"
              :key="answer.id"
              :answer="answer"
          />
        </div>

        <!-- ── Answers list 2 ────────────────────────────── -->
        <div class="space-y-3" v-if="showDetailsResult">
          <answer-detail-card
              v-for="answer in results.answers"
              :key="answer.id"
              :answer="answer"
          />
        </div>

      </div>
    </main>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useExamResults } from '@/composables/student/useExamResults.js'
import { apiClient } from '@/api/client.js'
import StudentHeader from '@/components/layout/StudentHeader.vue'
import AppIcon from '@/components/icons/AppIcon.vue'
import AnswerSummaryCard from '@/components/student/AnswerSummaryCard.vue'
import AnswerDetailCard from '@/components/student/AnswerDetailCard.vue'

const router = useRouter()
const route = useRoute()
const { getFinalExamResult } = useExamResults()

// ── State ──────────────────────────────────────────────────
const results = ref(null)
const loading = ref(false)
const error = ref(null)
const showDetailsResult = ref(false)

// ── Lifecycle ──────────────────────────────────────────────
onMounted(async () => {
  loading.value = true
  try {
    // Fetch the session with all answers and questions
    const response = await apiClient.get(
        `/sessions/${route.params.sessionId}/results`
    )
    results.value = response.data
  } catch (e) {
    error.value = 'Failed to load results'
  } finally {
    loading.value = false
  }
})

// ── Computed ──

// Count answers where is_correct is true
const correctCount = computed(() => {
  if (!results.value?.answers) return 0
  return results.value.answers.filter(a => {
    if (a.question?.type === 'open') return (a.ai_score ?? 0) >= 6
    return a.is_correct === true
  }).length
})

// Total number of questions
const totalCount = computed(() => results.value?.answers?.length ?? 0)

// Wrong or skipped answers
const wrongCount = computed(() => totalCount.value - correctCount.value)

// Percentage score (0 to 100)
const scorePercentage = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((correctCount.value / totalCount.value) * 100)
})

// ── Score ring ─────────────────────────────────────────────

// Circumference for r = 34
const ringCircumference = 2 * Math.PI * 34

// Dash offset based on score (0% → full circle hidden, 100% → full circle shown)
const ringOffset = computed(() =>
    ringCircumference * (1 - scorePercentage.value / 100)
)

// Ring stroke color based on score
const ringColor = computed(() => {
  if (scorePercentage.value >= 70) return 'stroke-emerald-500'
  if (scorePercentage.value >= 40) return 'stroke-amber-500'
  return 'stroke-rose-500'
})

// ── Helpers ────────────────────────────────────────────────

const openAnswersTab = (val) => {
  showDetailsResult.value = val
}
</script>