<template>
  <div class="min-h-screen bg-slate-50 font-sans">

     <!-- Header -->
    <layout-header page="teacher" :show-back-button="false" title="Teacher Dashboard"/>

    <!-- Main -->
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
      <exam-list v-else/>
      <!-- Student stats -->
      <student-exam-results/>
    </main>

    <!-- Delete confirmation modal-->
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
              @click="resetDelete"
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
import { useExamStore } from '@/stores/useExamStore.js'
import { useTeacherExamResults } from '@/composables/teacher/useTeacherExamResults.js'
import LayoutHeader from '@/components/layout/LayoutHeader.vue'
import AppIcon from '@/components/icons/AppIcon.vue'
import StudentExamResults from '@/components/teacher/StudentExamResults.vue'
import ExamList from "@/components/teacher/ExamList.vue";

const examStore = useExamStore()

const {
  showDeleteModal,
  resetDelete,
  goToBuilder,
  goToCreate,
} = useTeacherExamResults()

async function handleDelete() {
  await examStore.deleteExam(useTeacherExamResults().examToDelete.value)
  resetDelete()
}
</script>