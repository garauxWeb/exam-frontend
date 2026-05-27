<template>
  <div class="min-h-screen bg-slate-50 font-sans flex items-center justify-center px-4">

    <div class="w-full max-w-lg">

      <!-- Brand -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-display font-semibold text-slate-800 tracking-tight">
          QuizEdu
        </h1>
        <p class="text-slate-500 text-sm mt-3">
          Digital exam platform for teachers and students
        </p>
      </div>

      <!-- Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <!-- Teacher card -->
        <button
            @click="router.push('/teacher')"
            class="bg-white border border-slate-200 rounded-2xl px-6 py-8 text-left hover:border-indigo-300 hover:shadow-md transition-all duration-200 group"
        >
          <div class="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-5 text-indigo-600 group-hover:bg-indigo-100 transition-colors duration-200">
            <app-icon icon="tabler:school" :size="24" />
          </div>
          <h2 class="font-display font-semibold text-slate-800 text-lg leading-tight mb-1">
            I am a Teacher
          </h2>
          <p class="text-slate-400 text-xs leading-relaxed">
            Create and manage exams, add questions and review results.
          </p>
          <div class="mt-6 inline-flex items-center gap-1.5 text-indigo-600 text-sm font-medium group-hover:gap-2.5 transition-all duration-200">
            Enter
            <app-icon icon="tabler:arrow-right" :size="16" />
          </div>
        </button>

        <!-- Student card -->
        <button
            @click="router.push('/student')"
            class="bg-white border border-slate-200 rounded-2xl px-6 py-8 text-left hover:border-emerald-300 hover:shadow-md transition-all duration-200 group"
        >
          <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-5 text-emerald-600 group-hover:bg-emerald-100 transition-colors duration-200">
            <app-icon icon="tabler:pencil" :size="24" />
          </div>
          <h2 class="font-display font-semibold text-slate-800 text-lg leading-tight mb-1">
            I am a Student
          </h2>
          <p class="text-slate-400 text-xs leading-relaxed">
            Select your exam, enter your name and start answering.
          </p>
          <div class="mt-6 inline-flex items-center gap-1.5 text-emerald-600 text-sm font-medium group-hover:gap-2.5 transition-all duration-200">
            Enter
            <app-icon icon="tabler:arrow-right" :size="16" />
          </div>
        </button>

      </div>
      <div class="grid grid-col-1 mt-4">
        <!-- Delete localstorage -->
        <button
            @click="clearAllQuizSessions"
            class="bg-white border border-slate-200 rounded-2xl px-6 py-8 text-left hover:border-red-300 hover:shadow-md transition-all duration-200 group"
        >
          <div v-if="showStorageContent ">
            <div class="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-5 text-red-600 group-hover:bg-red-100 transition-colors duration-200">
              <app-icon icon="tabler:trash" :size="24" />
            </div>
            <h2 class="font-display font-semibold text-slate-800 text-lg leading-tight mb-1">
              Clear local storage
            </h2>
            <p class="text-slate-400 text-xs leading-relaxed">
              Create and manage exams, add questions and review results.
            </p>
            <div class="mt-6 inline-flex items-center gap-1.5 text-indigo-600 text-sm font-medium group-hover:gap-2.5 transition-all duration-200">
              Click and delete
              <app-icon icon="tabler:arrow-right" :size="16" />
            </div>
          </div>
          <div v-if="showDeleteStorageContent">
           <h3 class="text-green-600">Local storage and answers on the DB have been deleted successfully!</h3>
          </div>
          <div v-if="showNoStorageContent">
            <h3 class="text-red-600">No local storage or records found in the database.</h3>
          </div>

        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref,computed } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/icons/AppIcon.vue'
import {useQuizStore} from "@/stores/useQuizStore.js";

const router = useRouter()
const store = useQuizStore()

const checkStorage = ref(false)

const showStorageContent = computed(()=> !store.allDeleted && !checkStorage.value)
const showDeleteStorageContent = computed(()=> store.allDeleted && !checkStorage.value)
const showNoStorageContent = computed(()=> checkStorage.value)

const clearAllQuizSessions = async () => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('quizedu_session_')) {
      store.deleteAll()
      localStorage.removeItem(key);
      checkStorage.value = false

    } else {
      checkStorage.value = true
      setTimeout(() => {
        checkStorage.value = false
      }, 2500)
    }
  });
}

</script>