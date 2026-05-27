<template>
  <div class="min-h-screen bg-slate-50 font-sans">

    <!-- ── Header ─────────────────────────────────────────── -->
    <layout-header :show-back-button="true" title="Teacher Dashboard"/>

    <!-- ── Main ───────────────────────────────────────────── -->
    <main class="max-w-6xl mx-auto w-full  py-10">

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- ── Left column: Exam info + Add question form ── -->
        <div class="lg:col-span-1 space-y-6">

          <!-- Exam info card -->
          <div class="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div class="flex items-center gap-2.5 mb-5">
              <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <app-icon icon="tabler:file-text" :size="17" />
              </div>
              <h2 class="font-display font-semibold text-slate-700 text-base">
                Exam Details
              </h2>
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

          <!-- Add question card — visible only after exam is created -->
          <div
              v-if="!isCreating"
              class="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
          >
            <div class="flex items-center gap-2.5 mb-5">
              <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <app-icon icon="tabler:plus" :size="17" />
              </div>
              <h2 class="font-display font-semibold text-slate-700 text-base">
                Add Question
              </h2>
            </div>

            <div class="space-y-4">

              <!-- Question text -->
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1.5">Question</label>
                <textarea
                    v-model="questionForm.text"
                    placeholder="Type the question here..."
                    rows="3"
                    class="w-full text-sm border border-slate-200 rounded-lg px-4 py-2.5 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition"
                />
              </div>

              <!-- Question type -->
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

              <!-- Timer -->
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1.5">
                  Timer — {{ questionForm.timer_seconds }}s
                </label>
                <input
                    v-model.number="questionForm.timer_seconds"
                    type="range"
                    min="10"
                    max="120"
                    step="5"
                    class="w-full accent-indigo-600"
                />
                <div class="flex justify-between text-xs text-slate-300 mt-1">
                  <span>10s</span>
                  <span>120s</span>
                </div>
              </div>

              <!-- Multiple choice options -->
              <div v-if="questionForm.type === 'multiple_choice'">
                <label class="block text-xs font-medium text-slate-500 mb-2">Options</label>
                <div class="space-y-2">
                  <div
                      v-for="(option, index) in questionForm.options"
                      :key="index"
                      class="flex items-center gap-2"
                  >
                    <input
                        type="radio"
                        :name="'correct-option'"
                        :value="index"
                        v-model="correctOptionIndex"
                        class="accent-indigo-600"
                    />
                    <input
                        v-model="option.text"
                        type="text"
                        :placeholder="`Option ${index + 1}`"
                        class="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
                <p class="text-xs text-slate-400 mt-2">Select the correct answer with the radio button.</p>
              </div>

              <!-- True / False options -->
              <div v-if="questionForm.type === 'true_false'">
                <label class="block text-xs font-medium text-slate-500 mb-2">Correct Answer</label>
                <div class="flex gap-3">
                  <button
                      v-for="option in ['True', 'False']"
                      :key="option"
                      @click="trueFalseCorrect = option"
                      :class="[
                      'flex-1 text-sm font-medium py-2.5 rounded-lg border transition-colors duration-200',
                      trueFalseCorrect === option
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                    ]"
                  >
                    {{ option }}
                  </button>
                </div>
              </div>

              <!-- Submit button -->
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

        <!-- ── Right column: Question list ─────────────────── -->
        <div class="lg:col-span-2">

          <!-- Placeholder when exam not created yet -->
          <div
              v-if="isCreating"
              class="bg-white border border-dashed border-slate-300 rounded-2xl p-14 text-center"
          >
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

                <!-- Question content -->
                <div class="flex items-start gap-4 flex-1 min-w-0">
                  <!-- Index badge -->
                  <div class="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {{ index + 1 }}
                  </div>

                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-slate-800 font-medium leading-snug">
                      {{ question.text }}
                    </p>

                    <div class="flex items-center gap-2 mt-2">
                      <!-- Type badge -->
                      <span :class="['text-[11px] font-medium px-2.5 py-1 rounded-md', getTypeBadge(question.type)]">
                        {{ getTypeLabel(question.type) }}
                      </span>
                      <!-- Timer badge -->
                      <span class="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                        <app-icon icon="tabler:clock" :size="12" />
                        {{ question.timer_seconds }}s
                      </span>
                    </div>

                    <!-- Options preview -->
                    <div
                        v-if="question.options?.length"
                        class="mt-3 space-y-1"
                    >
                      <div
                          v-for="option in question.options"
                          :key="option.id"
                          :class="[
                          'inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg w-full',
                          option.is_correct
                            ? 'bg-emerald-50 text-emerald-700 font-medium'
                            : 'bg-slate-50 text-slate-500'
                        ]"
                      >
                        <app-icon
                            :icon="option.is_correct ? 'tabler:circle-check' : 'tabler:circle'"
                            :size="14"
                            class="flex-shrink-0"
                        />
                        {{ option.text }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Delete button -->
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
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useExamStore } from '@/stores/useExamStore.js'
import AppIcon from '@/components/icons/AppIcon.vue'
import BackButton from '@/components/ui/BackButton.vue'
import LayoutHeader from '@/components/layout/LayoutHeader.vue'

const router = useRouter()
const route = useRoute()
const examStore = useExamStore()

// ── Is this a create or edit flow? ─────────────────────────
const isCreating = computed(() => !route.params.id || route.params.id === 'create')

// ── Exam form ──────────────────────────────────────────────
const examForm = reactive({
  title: '',
  subject: '',
})

// ── Question form ──────────────────────────────────────────
const questionForm = reactive({
  text: '',
  type: 'multiple_choice',
  timer_seconds: 45,
  options: [
    { text: '', is_correct: false },
    { text: '', is_correct: false },
    { text: '', is_correct: false },
    { text: '', is_correct: false },
  ],
})

// Track which option is correct for multiple choice
const correctOptionIndex = ref(0)

// Track correct answer for true/false
const trueFalseCorrect = ref('True')

// ── Lifecycle ──────────────────────────────────────────────
onMounted(async () => {
  if (!isCreating.value) {
    await examStore.fetchById(route.params.id)
  }
})

// Reset options when question type changes
watch(() => questionForm.type, () => {
  correctOptionIndex.value = 0
  trueFalseCorrect.value = 'True'
  questionForm.options = [
    { text: '', is_correct: false },
    { text: '', is_correct: false },
    { text: '', is_correct: false },
    { text: '', is_correct: false },
  ]
})

// ── Helpers ────────────────────────────────────────────────
function getTypeLabel(type) {
  const labels = {
    multiple_choice: 'Multiple Choice',
    true_false: 'True / False',
    open: 'Open Answer',
  }
  return labels[type] ?? type
}

function getTypeBadge(type) {
  const colors = {
    multiple_choice: 'bg-blue-100 text-blue-700',
    true_false: 'bg-purple-100 text-purple-700',
    open: 'bg-amber-100 text-amber-700',
  }
  return colors[type] ?? 'bg-gray-100 text-gray-600'
}

// ── Actions ────────────────────────────────────────────────
async function handleCreateExam() {
  const exam = await examStore.createExam(examForm)
  if (exam) {
    await examStore.fetchById(exam.id)
    router.replace(`/teacher/exams/${exam.id}`)
  }
}

async function handleAddQuestion() {
  // Guard — exam must exist before adding questions
  if (!examStore.currentExam?.id) {
    alert('Please create the exam first.')
    return
  }

  const examId = examStore.currentExam.id

  // Build options based on question type
  let options = []

  if (questionForm.type === 'multiple_choice') {
    const correctText = questionForm.options[correctOptionIndex.value]?.text
    options = questionForm.options
        .filter(opt => opt.text.trim() !== '')
        .map(opt => ({
          text: opt.text,
          is_correct: opt.text === correctText,
        }))
  }

  if (questionForm.type === 'true_false') {
    options = [
      { text: 'True', is_correct: trueFalseCorrect.value === 'True' },
      { text: 'False', is_correct: trueFalseCorrect.value === 'False' },
    ]
  }

  await examStore.addQuestion(examId, {
    text: questionForm.text,
    type: questionForm.type,
    timer_seconds: questionForm.timer_seconds,
    order: examStore.currentExam.questions.length,
    options,
  })

  // Reset the form after adding
  questionForm.text = ''
  questionForm.timer_seconds = 45
  correctOptionIndex.value = 0
}

async function handleDeleteQuestion(questionId) {
  await examStore.deleteQuestion(examStore.currentExam.id, questionId)
}
</script>