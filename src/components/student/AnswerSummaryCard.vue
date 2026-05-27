<template>
  <div
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
          <div class="mt-5 text-green-500" v-if="answer.question?.type !== 'open' && !checkIfAnswerIsCorrect(answer)">
            <div class="flex items-center">
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
  getAnswerStatusColor,
  getAnswerStatusIcon,
  getTypeBadge,
  getTypeLabel,
  checkIfAnswerIsCorrect,
  getRightAnswer
} = useExamResults()
</script>