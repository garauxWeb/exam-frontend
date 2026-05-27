<script setup>
import {useRoute, useRouter} from "vue-router";
import BackButton from "@/components/ui/BackButton.vue";

const router = useRouter()

const props = defineProps({
  title: {
    type: String,
  },
  showBackButton: {
    type: Boolean,
    default: true,
  }
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
                  <span class="text-xs text-white bg-green-500 px-3 py-1.5 rounded-full mr-3">
          Exam completed
        </span>
       <back-button v-if="showBackButton"/>
      </div>

    </div>
  </header>
</template>

<style scoped>

</style>