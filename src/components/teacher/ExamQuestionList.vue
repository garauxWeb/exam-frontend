<template>
  <div class="lg:col-span-2">
    <!-- Placeholder when exam not created yet -->
    <div v-if="isCreating" class="bg-white border border-dashed border-slate-300 rounded-2xl p-14 text-center">
      <div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <app-icon icon="tabler:edit" :size="26" class="text-slate-400" />
      </div>
      <p class="text-slate-400 text-sm">Create the exam first, then add questions.</p>
    </div>
    <!-- Empty questions state -->
    <div
        v-else-if="!examStore.currentExam?.questions?.length"
        class="bg-white border border-dashed border-slate-300 rounded-2xl p-14 text-center"
    >
      <div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <app-icon icon="tabler:help-circle" :size="26" class="text-slate-400" />
      </div>
      <p class="text-slate-600 text-sm font-medium mb-1">No questions yet</p>
      <p class="text-slate-400 text-xs">Add your first question using the form on the left.</p>
    </div>
    <!-- Question list -->
    <div v-else class="space-y-3">
      <div
          v-for="(question, index) in examStore.currentExam.questions"
          :key="question.id"
          class="bg-white border border-slate-200 rounded-xl px-6 py-5 hover:shadow-sm transition-shadow duration-200"
      >
        <div class="flex items-start justify-between gap-4">

          <div class="flex items-start gap-4 flex-1 min-w-0">
            <div class="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
              {{ index + 1 }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-slate-800 font-medium leading-snug">{{ question.text }}</p>

              <div class="flex items-center gap-2 mt-2">
                <span :class="['text-[11px] font-medium px-2.5 py-1 rounded-md', getTypeBadge(question.type)]">
                  {{ getTypeLabel(question.type) }}
                </span>
                <span class="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  <app-icon icon="tabler:clock" :size="12" />
                  {{ question.timer_seconds }}s
                </span>
              </div>
              <div v-if="question.options?.length" class="mt-3 space-y-1">
                <div
                    v-for="option in question.options" :key="option.id"
                    :class="[
                      'inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg w-full',
                      option.is_correct ? 'bg-emerald-50 text-emerald-700 font-medium' : 'bg-slate-50 text-slate-500'
                    ]"
                >
                  <app-icon :icon="option.is_correct ? 'tabler:circle-check' : 'tabler:circle'" :size="14" class="flex-shrink-0" />
                  {{ option.text }}
                </div>
              </div>
            </div>
          </div>
          <button
              @click="handleDeleteQuestion(question.id)"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors duration-200 flex-shrink-0"
          >
            <app-icon icon="tabler:trash" :size="16" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppIcon from '@/components/icons/AppIcon.vue'
import { useExamStore } from '@/stores/useExamStore.js'
import { useExamBuilder } from '@/composables/teacher/useExamBuilder.js'
import { useExamResults } from '@/composables/student/useExamResults.js'

const examStore = useExamStore()
const { isCreating, handleDeleteQuestion } = useExamBuilder()
const { getTypeLabel, getTypeBadge } = useExamResults()
</script>