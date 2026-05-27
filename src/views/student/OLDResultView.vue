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
          <div
              v-for="(answer, index) in results.answers"
              :key="answer.id"
              :class="[
                'bg-white border border-slate-200 rounded-xl px-6 py-5 border-l-[3px] transition-shadow duration-200 hover:shadow-sm',
                answerAccent(answer)
              ]"
          >

            <div class="flex items-start gap-4">

              <!-- Status icon -->
              <div
                  :class="[
                    'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                    getAnswerStatusColor(answer)
                  ]"
              >
                <app-icon :icon="getAnswerStatusIcon(answer)" :size="16" />
              </div>

              <div class="flex-1 min-w-0">

                <!-- Question text -->
                <p class="text-sm font-medium text-slate-800 leading-snug">
                  {{ answer.question?.text }}
                </p>

                <!-- Type badge -->
                <span
                    :class="['text-[11px] font-medium px-2.5 py-1 rounded-md mt-2 inline-block', getTypeBadge(answer.question?.type)]"
                >
                  {{ getTypeLabel(answer.question?.type) }}
                </span>

                <!-- Student answer -->
                <div class="text-xs text-slate-400 mt-3">
                  <div>
                    Your answer:
                    <span class="text-slate-700 font-semibold ml-1">
                  {{ answer.value ?? 'No answer (time expired)' }}
                    </span>
                  </div>
                  <div class="mt-5 text-green-500" v-if="!checkIfAnswerIsCorrect(answer)">
                    <div class="flex tems-center">
                      <h3 class="text-md mr-2">Right answer is:</h3>
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-md">{{ getRightAnswer(answer) }}</span>
                      </div>
                    </div>

                  </div>
                </div>

                <!-- AI evaluation for open answers -->
                <div
                    v-if="answer.question?.type === 'open' && answer.ai_evaluation"
                    class="mt-3 bg-amber-50 rounded-lg px-4 py-3"
                >
                  <div class="flex items-center justify-between mb-1.5">
                    <div class="flex items-center gap-1.5">
                      <app-icon icon="tabler:sparkles" :size="14" class="text-amber-600" />
                      <p class="text-xs font-semibold text-amber-700">AI Evaluation</p>
                    </div>
                    <span class="text-[11px] font-display font-semibold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-md">
                      {{ answer.ai_score }} / 10
                    </span>
                  </div>
                  <p class="text-xs text-amber-700 leading-relaxed">
                    {{ answer.ai_evaluation }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Answers list 2 ────────────────────────────── -->
        <div class="space-y-3" v-if="showDetailsResult">
          <div
              v-for="(answer, index) in results.answers"
              :key="answer.id"
              :class="[
                'bg-white border border-slate-200 rounded-xl px-6 py-5 border-l-[3px] transition-shadow duration-200 hover:shadow-sm',
                answerAccent(answer)
              ]"
          >
            <h3 class="text-sm font-medium text-slate-800 leading-snug mb-2">{{answer.question.text}}</h3>
            <ul class="list-decimal pl-10">
              <li v-for="(question,index) in answer.question.options" class="text-[12px] mt-2">
                {{ question.text}}
              </li>
            </ul>

            <div class="mt-5">
              <h3 class="text-sm font-medium leading-snug text-blue-500">Your answer</h3>
              <div class="text-sm font-semibold" :class="checkIfAnswerIsCorrect(answer) ? 'text-green-500' : 'text-red-500'">
                <div class="flex items-center">
                  <app-icon :icon="!checkIfAnswerIsCorrect(answer) ? 'icon-park-solid:error' : 'ph:check-bold'" size="18" class="mr-2"/>
                  <div class="text-sm">{{ answer.value ?? 'No answer (time expired)' }}</div>
                </div>

              </div>
              <div v-if="!checkIfAnswerIsCorrect(answer)" class="mt-3">
                <h3 class="text-sm font-medium text-slate-800 leading-snug">Right answer</h3>
              <div class="text-green-500 font-semibold">{{getRightAnswer(answer)}}</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {useExamResults} from "@/composables/student/useExamResults.js";
import { apiClient } from '@/api/client.js'
import StudentHeader from '@/components/layout/StudentHeader.vue'
import AppIcon from "@/components/icons/AppIcon.vue";

const router = useRouter()
const route = useRoute()
const {checkIfAnswerIsCorrect,getRightAnswer,getFinalExamResult,getTypeLabel,getTypeBadge} = useExamResults()

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

// ── Computed ───────────────────────────────────────────────

// Count answers where is_correct is true
const correctCount = computed(() => {
  if (!results.value?.answers) return 0
  return results.value.answers.filter(a => a.is_correct === true).length
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

// Left border accent color for each answer card
function answerAccent(answer) {
  if (answer.question?.type === 'open') return 'border-l-amber-400'
  return answer.is_correct ? 'border-l-emerald-500' : 'border-l-rose-400'
}




const openAnswersTab = (val) => {
  showDetailsResult.value = val
}



</script>