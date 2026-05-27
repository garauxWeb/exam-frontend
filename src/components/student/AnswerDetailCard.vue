<template>
  <div
      :class="[
        'bg-white border border-slate-200 rounded-xl px-6 py-5 border-l-[3px] transition-shadow duration-200 hover:shadow-sm',
        answerAccent(answer)
      ]"
  >
    <h3 class="text-sm font-medium text-slate-800 leading-snug mb-2">
      {{ answer.question.text }}
    </h3>

    <ul class="list-decimal pl-10">
      <li
          v-for="option in answer.question.options"
          :key="option.id"
          class="text-[12px] mt-2"
      >
        {{ option.text }}
      </li>
    </ul>

    <div class="mt-5">
      <h3 class="text-sm font-medium leading-snug text-blue-500">Your answer</h3>
      <div
          class="text-sm font-semibold"
          :class="checkIfAnswerIsCorrect(answer) ? 'text-green-500' : 'text-red-500'"
      >
        <div class="flex items-center">
          <app-icon
              :icon="checkIfAnswerIsCorrect(answer) ? 'ph:check-bold' : 'icon-park-solid:error'"
              size="18"
              class="mr-2"
          />
          <div class="text-sm">{{ answer.value ?? 'No answer (time expired)' }}</div>
        </div>
      </div>

      <div v-if="!checkIfAnswerIsCorrect(answer)" class="mt-3">
        <h3 class="text-sm font-medium text-slate-800 leading-snug">Right answer</h3>
        <div class="text-green-500 font-semibold">{{ getRightAnswer(answer) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppIcon from '@/components/icons/AppIcon.vue'
import { useExamResults } from '@/composables/student/useExamResults.js'

defineProps({
  answer: {
    type: Object,
    required: true
  }
})

const {
  answerAccent,
  checkIfAnswerIsCorrect,
  getRightAnswer
} = useExamResults()
</script>