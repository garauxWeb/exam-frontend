<template>
  <div class="min-h-screen bg-slate-50 font-sans">

    <!-- ── Header ─────────────────────────────────────────── -->
    <layout-header page="teacher" :show-back-button="false" title="Teacher Dashboard"/>

    <!-- ── Main ───────────────────────────────────────────── -->
    <main class="max-w-6xl mx-auto w-full py-10">

      <!-- Loading state -->
      <div v-if="examStore.loading" class="flex flex-col items-center justify-center py-28">
        <div class="w-9 h-9 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p class="text-slate-400 text-sm">Loading exams...</p>
      </div>

      <!-- Error state -->
      <div
          v-else-if="examStore.error"
          class="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl px-6 py-4"
      >
        <app-icon icon="tabler:alert-triangle" :size="20" class="flex-shrink-0" />
        {{ examStore.error }}
      </div>

      <!-- Empty state -->
      <div
          v-else-if="examStore.exams.length === 0"
          class="bg-white border border-slate-200 rounded-2xl px-8 py-14 text-center"
      >
        <div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <app-icon icon="tabler:clipboard-list" :size="26" class="text-slate-400" />
        </div>
        <h2 class="text-base font-display font-semibold text-slate-700 mb-1">No exams yet</h2>
        <p class="text-slate-400 text-sm mb-6">Create your first exam to get started.</p>
        <button
            @click="goToCreate"
            class="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors duration-200"
        >
          <app-icon icon="tabler:plus" :size="16" />
          Create Exam
        </button>
      </div>

      <!-- Exam list -->
      <div v-else>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-display font-semibold text-slate-700">
            {{ !showStudentStats ? 'Your Exams' : 'Students' }}
            <span class="ml-2 text-sm font-normal text-slate-400">
              ({{ !showStudentStats  ? examStore.exams.length : answerStore.studentStats.length}})
            </span>
          </h2>
          <div class="text-sm flex items-center gap-2 cursor-pointer" @click="openStudentStat">
            <app-icon :icon="showStudentStats ? 'ci:close-md' : 'healthicons:i-exam-multiple-choice-outline'" size="24"/>
            <span>{{ showStudentStats ? 'Close student results' : 'Show student results' }}</span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" v-if="!showStudentStats">
          <div
              v-for="exam in examStore.exams"
              :key="exam.id"
              class="bg-white border border-slate-200 rounded-xl px-6 py-5 border-l-[3px] border-l-indigo-500 flex items-center justify-between gap-4 hover:shadow-sm transition-shadow duration-200"
          >
            <!-- Exam info -->
            <div class="flex items-center gap-4 min-w-0">
              <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-display font-bold text-sm flex-shrink-0">
                {{ exam.subject?.charAt(0).toUpperCase() }}
              </div>
              <div class="min-w-0">
                <h3 class="font-medium text-slate-800 text-sm truncate">{{ exam.title }}</h3>
                <p class="text-xs text-slate-400 mt-0.5 truncate">{{ exam.subject }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <button
                  @click="goToBuilder(exam.id)"
                  class="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-lg transition-colors duration-200"
              >
                <app-icon icon="tabler:edit" :size="14" />
                Edit
              </button>
              <button
                  @click="confirmDelete(exam.id)"
                  class="inline-flex items-center gap-1.5 text-xs font-medium text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-lg transition-colors duration-200"
              >
                <app-icon icon="tabler:trash" :size="14" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

<!--      Student stats-->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5" v-if="showStudentStats">
        <div
            v-for="(stat, i) in answerStore.studentStats"
            :key="i"
            class="bg-white border border-slate-200 rounded-xl p-5"
        >
          <!-- Student header -->
          <div class="flex items-center gap-3 mb-1">
            <div class="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-medium flex-shrink-0">
              {{ stat.student_name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-sm font-medium text-slate-800 m-0">{{ stat.student_name }}</p>
              <p class="text-xs text-slate-400">{{ stat.exams.length }} exam{{ stat.exams.length > 1 ? 's' : '' }} taken</p>
            </div>
            <div class="ml-auto flex gap-2">
        <span class="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
          <app-icon icon="tabler:check" :size="11" />
          {{ stat.exams.reduce((s, e) => s + e.total_correct, 0) }} correct
        </span>
              <span class="inline-flex items-center gap-1 text-xs font-medium bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full">
          <app-icon icon="tabler:x" :size="11" />
          {{ stat.exams.reduce((s, e) => s + e.total_wrong, 0) }} wrong
        </span>
            </div>
          </div>

          <!-- Exams -->
          <div
              v-for="(exam, j) in stat.exams"
              :key="j"
              class="bg-slate-50 rounded-lg p-4 mt-3"
          >
            <!-- Exam header -->
            <div class="flex items-start justify-between mb-1.5">
              <div>
                <p class="text-xs font-medium text-slate-700 m-0">{{ exam.exam_title }}</p>
                <p class="text-xs text-slate-400 m-0">{{ exam.exam_subject }}</p>
              </div>
              <span class="text-xs text-slate-400 flex-shrink-0">
          {{ exam.total_correct }}/{{ exam.total_correct + exam.total_wrong }}
        </span>
            </div>

            <!-- Progress bar -->
            <div class="flex items-center gap-2 mb-3">
              <div class="flex-1 h-1 bg-slate-200 rounded-full">
                <div
                    class="h-1 rounded-full transition-all"
                    :class="scorePercent(exam) >= 50 ? 'bg-emerald-500' : 'bg-rose-400'"
                    :style="{ width: scorePercent(exam) + '%' }"
                />
              </div>
              <span class="text-xs text-slate-400">{{ scorePercent(exam) }}%</span>
            </div>

            <!-- Correct -->
            <p class="text-xs font-medium text-emerald-700 flex items-center gap-1 mb-1">
              <app-icon icon="tabler:circle-check" :size="13" /> Correct answers
            </p>
            <div
                v-for="(ans, k) in exam.correct_answers"
                :key="k"
                class="flex items-start justify-between gap-2 text-xs py-1 border-b border-slate-100 last:border-0"
            >
              <span class="text-slate-400 flex-1">{{ ans.question }}</span>
              <span class="font-medium text-emerald-700 flex-shrink-0">{{ ans.answer }}</span>
            </div>

            <hr class="border-slate-200 my-2" />

            <!-- Wrong -->
            <p class="text-xs font-medium text-rose-600 flex items-center gap-1 mb-1">
              <app-icon icon="tabler:circle-x" :size="13" /> Wrong answers
            </p>
            <div
                v-for="(ans, k) in exam.wrong_answers"
                :key="k"
                class="flex items-start justify-between gap-2 text-xs py-1 border-b border-slate-100 last:border-0"
            >
              <span class="text-slate-400 flex-1">{{ ans.question }}</span>
              <span class="font-medium text-rose-600 flex-shrink-0">{{ ans.answer }}</span>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- ── Delete confirmation modal ──────────────────────── -->
    <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    >
      <div class="bg-white rounded-2xl shadow-xl px-8 py-7 max-w-sm w-full">
        <div class="w-11 h-11 rounded-full bg-rose-100 flex items-center justify-center mb-4">
          <app-icon icon="tabler:trash" :size="20" class="text-rose-500" />
        </div>
        <h3 class="font-display font-semibold text-slate-800 text-lg mb-2">Delete Exam?</h3>
        <p class="text-slate-500 text-sm mb-6 leading-relaxed">
          This action cannot be undone. All questions and answers will be permanently deleted.
        </p>
        <div class="flex gap-3">
          <button
              @click="showDeleteModal = false"
              class="flex-1 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
              @click="handleDelete"
              class="flex-1 text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 px-4 py-2.5 rounded-lg transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useExamStore } from '@/stores/useExamStore.js'
import {useQuizStore} from "@/stores/useQuizStore.js";
import LayoutHeader from '@/components/layout/LayoutHeader.vue'
import AppIcon from '@/components/icons/AppIcon.vue'

const router = useRouter()
const examStore = useExamStore()
const answerStore = useQuizStore()

// ── Delete modal state ─────────────────────────────────────
const showDeleteModal = ref(false)
const examToDelete = ref(null)
const showStudentStats = ref(false)

// ── Navigation ─────────────────────────────────────────────
function goToCreate() {
  router.push('/teacher/exams/new')
}

function goToBuilder(examId) {
  router.push(`/teacher/exams/${examId}`)
}

// ── Delete ───
function confirmDelete(examId) {
  examToDelete.value = examId
  showDeleteModal.value = true
}

async function handleDelete() {
  await examStore.deleteExam(examToDelete.value)
  showDeleteModal.value = false
  examToDelete.value = null
}

function scorePercent(exam) {
  const total = exam.total_correct + exam.total_wrong
  return total === 0 ? 0 : Math.round((exam.total_correct / total) * 100)
}

const openStudentStat = async () => {
  showStudentStats.value = !showStudentStats.value
  await answerStore.getAll()

}


</script>