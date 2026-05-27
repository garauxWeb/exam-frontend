<script setup>
import {useRoute, useRouter} from "vue-router";
import BackButton from "@/components/ui/BackButton.vue";
import AppIcon from "@/components/icons/AppIcon.vue";

const router = useRouter()

defineProps({
  title: { type: String },
  showBackButton: { type: Boolean, default: false },
  showDashboard: {type: Boolean, default: false},
  showExamCompleted: { type: Boolean, default: false },
})
</script>

<template>
  <header class="bg-white border-b border-slate-200 px-8 py-5">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <div @click="router.push('/')">
        <h1 class="text-xl font-display font-semibold text-slate-800 tracking-tight cursor-pointer">
          QuizEdu
        </h1>
        <p class="text-sm text-slate-400 mt-0.5">{{title}}</p>
      </div>

      <div class="flex items-center">
                  <span class="text-xs text-white bg-green-500 px-3 py-1.5 rounded-full mr-3" v-if="showExamCompleted">
          Exam completed
        </span>
       <back-button v-if="showBackButton"/>
        <button
            v-if="showDashboard"
            @click="router.push('/student')"
            class="text-slate-400 hover:text-slate-600 transition-colors duration-200"
        >
          <div class="flex items-center justify-center">
            <app-icon icon="mdi:arrow-left" size="18" color="currentColor" />
            <span class="text-sm">Back to the dashboard</span>
          </div>

        </button>
      </div>

    </div>
  </header>
</template>

<style scoped>

</style>