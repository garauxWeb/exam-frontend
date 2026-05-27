<script setup>
import AppIcon from "@/components/icons/AppIcon.vue";
import {useQuizStore} from "@/stores/useQuizStore.js";
import {useExamStore} from "@/stores/useExamStore.js";

import {useTeacherExamResults} from "@/composables/teacher/useTeacherExamResults.js";

const examStore = useExamStore()
const answerStore = useQuizStore()
const { confirmDelete,showStudentStats,goToBuilder,toggleStudentStats } = useTeacherExamResults()
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-display font-semibold text-slate-700">
        {{ !showStudentStats ? 'Your Exams' : 'Students' }}
        <span class="ml-2 text-sm font-normal text-slate-400">
              ({{ !showStudentStats ? examStore.exams.length : answerStore.studentStats.length }})
            </span>
      </h2>
      <div class="text-sm flex items-center gap-2 cursor-pointer" @click="toggleStudentStats">
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
</template>