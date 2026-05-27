<template>
  <header class="bg-white border-b border-slate-200 px-8 py-5">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <div @click="router.push('/')" class="cursor-pointer">
        <h1 class="text-2xl font-display font-semibold text-slate-800 tracking-tight">QuizEdu</h1>
        <p class="text-sm text-slate-400 mt-0.5">{{title}}</p>
      </div>
      <div>
        <button @click="goToCreate" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors duration-200 mr-3" v-if="showNewExam">
          <span class="text-lg leading-none">+</span>
          New Exam {{examStatus}}
        </button>
        <back-button v-if="showBackButton"/>
      </div>
    </div>
  </header>
</template>

<script setup>
import {computed} from "vue";
import { useRouter } from "vue-router"
import BackButton from "@/components/ui/BackButton.vue";

const router = useRouter()

const props = defineProps({
  title: {
    type: String,
  },
  page: {
    type: String,
    default: 'none'
  },
  showBackButton: {
    type: Boolean,
    default: false
  }
})

const showNewExam = computed(() => props.page === 'teacher' && !props.showBackButton)

function goToCreate() {
  router.push('/teacher/exams/create')
}
</script>