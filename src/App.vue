<script setup>
import { onMounted, ref } from 'vue'
import {useExamStore} from "@/stores/useExamStore.js";
import {useQuizStore} from "@/stores/useQuizStore.js";
import LayoutFooter from "@/components/layout/LayoutFooter.vue";

const examStore = useExamStore()
const quizStore = useQuizStore()

onMounted(async () => {
  await Promise.all([
    examStore.fetchAll(),
    quizStore.getAll()
  ])
})
</script>

<template>
 <router-view/>
  <layout-footer/>
</template>
