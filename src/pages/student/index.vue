<template>
  <!-- ── Header ─────────────────────────────────────────── -->
  <layout-header title="Student Dashboard"/>

  <div class="min-h-screen bg-slate-50 font-sans px-6">
    <div class="max-w-6xl mx-auto py-10">

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-28">
        <div class="w-9 h-9 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p class="text-slate-400 text-sm">Loading exams...</p>
      </div>

      <template v-else>

        <!-- Brand -->
        <div class="mb-10">
          <h1 class="text-4xl font-display font-semibold text-slate-800 tracking-tight">
            Student Dashboard
          </h1>
          <p class="text-slate-500 text-sm mt-2">Choose an exam you would like to attempt.</p>
        </div>

        <!-- Error -->
        <div
            v-if="error"
            class="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl px-6 py-4"
        >
          <app-icon icon="tabler:alert-triangle" :size="20" class="flex-shrink-0" />
          {{ error }}
        </div>

        <!-- Empty -->
        <div
            v-else-if="exams.length === 0"
            class="bg-white border border-slate-200 rounded-2xl px-8 py-14 text-center"
        >
          <div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <app-icon icon="tabler:clipboard-list" :size="26" class="text-slate-400" />
          </div>
          <p class="text-slate-600 text-sm font-medium mb-1">No exams available</p>
          <p class="text-slate-400 text-xs">Ask your teacher to create an exam first.</p>
        </div>

        <!-- Exam list -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
              v-for="exam in exams"
              :key="exam.id"
              :class="[
                'bg-white border border-slate-200 rounded-xl px-6 py-5 border-l-[3px] transition-shadow duration-200 hover:shadow-sm flex flex-col',
                isCompleted(exam.id) ? 'border-l-emerald-500' : 'border-l-indigo-500'
              ]"
          >
            <!-- Title + subject -->
            <div class="flex items-start gap-3">
              <div
                  :class="[
                    'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                    isCompleted(exam.id) ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'
                  ]"
              >
                <app-icon
                    :icon="isCompleted(exam.id) ? 'tabler:circle-check' : 'tabler:file-text'"
                    :size="18"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-display font-semibold text-slate-800 text-base leading-snug">
                  {{ exam.title }}
                </p>
                <p class="text-slate-400 text-xs mt-0.5">{{ exam.subject }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">

              <!-- Already completed -->
              <template v-if="isCompleted(exam.id)">
                <span class="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <app-icon icon="tabler:check" :size="14" />
                  Completed
                </span>
                <button
                    @click="goToResults(exam.id)"
                    class="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  View Results
                  <app-icon icon="tabler:arrow-right" :size="14" />
                </button>
              </template>

              <!-- Not yet done -->
              <template v-else>
                <span class="text-xs font-medium text-slate-400">Not started</span>
                <button
                    @click="goToExam(exam.id)"
                    class="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Start
                  <app-icon icon="tabler:arrow-right" :size="14" />
                </button>
              </template>

            </div>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { examApi } from '@/api/exams/index.js'
import LayoutHeader from '@/components/layout/LayoutHeader.vue'
import AppIcon from '@/components/icons/AppIcon.vue'

const router = useRouter()

const exams = ref([])
const loading = ref(false)
const error = ref(null)

function storageKey(examId) {
  return `quizedu_session_${examId}`
}

function isCompleted(examId) {
  return !!localStorage.getItem(storageKey(examId))
}

function getSessionId(examId) {
  return localStorage.getItem(storageKey(examId))
}

function goToExam(examId) {
  router.push(`/student/exam/${examId}`)
}

function goToResults(examId) {
  const sessionId = getSessionId(examId)
  router.push(`/student/results/${sessionId}`)
}

onMounted(async () => {
  loading.value = true
  try {
    exams.value = await examApi.getAll()
  } catch (e) {
    error.value = 'Failed to load exams'
  } finally {
    loading.value = false
  }
})
</script>