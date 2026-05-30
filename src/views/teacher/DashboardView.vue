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
      <exam-list v-else @delete="openDelete"/>
      <!-- Student stats -->
      <student-exam-results/>
    </main>
    <!-- Delete confirmation modal-->
    <delete-modal
        :show="showDeleteModal"
        title="Delete Exam?"
        description="All questions and answers will be permanently deleted."
        @confirm="handleDelete"
        @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DeleteModal from "@/components/modal/DeleteModal.vue";
import { useExamStore } from '@/stores/useExamStore.js'
import { useTeacherExamResults } from '@/composables/teacher/useTeacherExamResults.js'
import LayoutHeader from '@/components/layout/LayoutHeader.vue'
import AppIcon from '@/components/icons/AppIcon.vue'
import StudentExamResults from '@/components/teacher/StudentExamResults.vue'
import ExamList from "@/components/teacher/ExamList.vue";

const examStore = useExamStore()
const { goToCreate, goToBuilder } = useTeacherExamResults()

const showDeleteModal = ref(false)
const examToDelete = ref(null)

function openDelete(examId) {
  examToDelete.value = examId
  showDeleteModal.value = true
}

async function handleDelete() {
  await examStore.deleteExam(examToDelete.value)
  showDeleteModal.value = false
  examToDelete.value = null
}
</script>