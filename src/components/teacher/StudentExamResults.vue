<script setup>
import AppIcon from '@/components/icons/AppIcon.vue'
import { useQuizStore } from '@/stores/useQuizStore.js'
import { useTeacherExamResults } from '@/composables/teacher/useTeacherExamResults.js'

const answerStore = useQuizStore()
const { showStudentStats, scorePercent } = useTeacherExamResults()
</script>

<template>
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
          <span class="text-slate-400 flex-1 min-w-0">{{ ans.question }}</span>
          <span class="font-medium text-emerald-700 text-right break-words max-w-[50%]">{{ ans.answer }}</span>
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
          <span class="text-slate-400 flex-1 min-w-0">{{ ans.question }}</span>
          <span class="font-medium text-rose-600 text-right break-words max-w-[50%]">{{ ans.answer }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>