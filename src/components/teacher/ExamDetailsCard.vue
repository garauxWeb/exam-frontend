<template>
  <div class="lg:col-span-1 space-y-6">

    <!-- Exam info card -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div class="flex items-center gap-2.5 mb-5">
        <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
          <app-icon icon="tabler:file-text" :size="17" />
        </div>
        <h2 class="font-display font-semibold text-slate-700 text-base">Exam Details</h2>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-slate-500 mb-1.5">Title</label>
          <input
              v-model="examForm.title"
              type="text"
              placeholder="e.g. Math Final Exam"
              :disabled="!isCreating"
              class="w-full text-sm border border-slate-200 rounded-lg px-4 py-2.5 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400 transition"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-500 mb-1.5">Subject</label>
          <input
              v-model="examForm.subject"
              type="text"
              placeholder="e.g. Mathematics"
              :disabled="!isCreating"
              class="w-full text-sm border border-slate-200 rounded-lg px-4 py-2.5 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400 transition"
          />
        </div>

        <button
            v-if="isCreating"
            @click="handleCreateExam"
            :disabled="examStore.loading || !examForm.title || !examForm.subject"
            class="w-full inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-200"
        >
          <app-icon v-if="!examStore.loading" icon="tabler:check" :size="16" />
          {{ examStore.loading ? 'Creating...' : 'Create Exam' }}
        </button>
      </div>
    </div>
    <!-- Add question card -->
    <div v-if="!isCreating" class="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div class="flex items-center gap-2.5 mb-5">
        <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <app-icon icon="tabler:plus" :size="17" />
        </div>
        <h2 class="font-display font-semibold text-slate-700 text-base">Add Question</h2>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-slate-500 mb-1.5">Question</label>
          <textarea
              v-model="questionForm.text"
              placeholder="Type the question here..."
              rows="3"
              class="w-full text-sm border border-slate-200 rounded-lg px-4 py-2.5 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-500 mb-1.5">Type</label>
          <select
              v-model="questionForm.type"
              class="w-full text-sm border border-slate-200 rounded-lg px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="true_false">True / False</option>
            <option value="open">Open Answer</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-500 mb-1.5">
            Timer — {{ questionForm.timer_seconds }}s
          </label>
          <input
              v-model.number="questionForm.timer_seconds"
              type="range" min="10" max="120" step="5"
              class="w-full accent-indigo-600"
          />
          <div class="flex justify-between text-xs text-slate-300 mt-1">
            <span>10s</span><span>120s</span>
          </div>
        </div>
        <!-- Multiple choice options -->
        <div v-if="questionForm.type === 'multiple_choice'">
          <label class="block text-xs font-medium text-slate-500 mb-2">Options</label>
          <div class="space-y-2">
            <div v-for="(option, index) in questionForm.options" :key="index" class="flex items-center gap-2">
              <input
                  type="radio" :name="'correct-option'" :value="index"
                  v-model="correctOptionIndex" class="accent-indigo-600"
              />
              <input
                  v-model="option.text" type="text" :placeholder="`Option ${index + 1}`"
                  class="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>
          <p class="text-xs text-slate-400 mt-2">Select the correct answer with the radio button.</p>
        </div>
        <!-- True / False -->
        <div v-if="questionForm.type === 'true_false'">
          <label class="block text-xs font-medium text-slate-500 mb-2">Correct Answer</label>
          <div class="flex gap-3">
            <button
                v-for="option in ['True', 'False']" :key="option"
                @click="trueFalseCorrect = option"
                :class="[
                  'flex-1 text-sm font-medium py-2.5 rounded-lg border transition-colors duration-200',
                  trueFalseCorrect === option
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                ]"
            >{{ option }}</button>
          </div>
        </div>
        <button
            @click="handleAddQuestion"
            :disabled="examStore.loading || !questionForm.text"
            class="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-200"
        >
          <app-icon v-if="!examStore.loading" icon="tabler:plus" :size="16" />
          {{ examStore.loading ? 'Adding...' : 'Add Question' }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import AppIcon from '@/components/icons/AppIcon.vue'
import { useExamStore } from '@/stores/useExamStore.js'
import { useExamBuilder } from '@/composables/teacher/useExamBuilder.js'

const examStore = useExamStore()
const { isCreating, examForm, questionForm, correctOptionIndex, trueFalseCorrect, handleCreateExam, handleAddQuestion } = useExamBuilder()
</script>