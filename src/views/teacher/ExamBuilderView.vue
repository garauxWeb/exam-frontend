<template>
  <div class="min-h-screen bg-slate-50 font-sans">
    <layout-header :show-back-button="true" title="Teacher Dashboard"/>
    <main class="max-w-6xl mx-auto w-full py-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <exam-details-card />
        <exam-question-list />
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useExamStore } from '@/stores/useExamStore.js'
import { useExamBuilder } from '@/composables/teacher/useExamBuilder.js'
import LayoutHeader from '@/components/layout/LayoutHeader.vue'
import ExamDetailsCard from '@/components/teacher/ExamDetailsCard.vue'
import ExamQuestionList from '@/components/teacher/ExamQuestionList.vue'

const route = useRoute()
const examStore = useExamStore()
const { isCreating } = useExamBuilder()

onMounted(async () => {
  if (!isCreating.value) {
    await examStore.fetchById(route.params.id)
  }
})
</script>