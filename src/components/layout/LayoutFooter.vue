<!-- components/layout/LayoutFooter.vue -->
<template>
  <footer class="bg-slate-900 mt-auto">
    <div class="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">

      <!-- Brand + copyright -->
      <div class="flex items-center gap-2 text-slate-400">
        <app-icon icon="tabler:school" :size="16" class="text-indigo-400" />
        <span class="text-xs">
          <span class="font-display font-semibold text-slate-100">QuizEdu</span>
          · © {{ year }} All rights reserved
        </span>
      </div>

      <!-- Links -->
      <nav class="flex items-center gap-5">
        <div
            @click="goToPage(link.route)"
        v-for="link in links"
        :key="link.label"
        class="text-xs text-slate-400 hover:text-indigo-300 transition-colors duration-200 cursor-pointer"
        >
        {{ link.label }}
        </div>
      </nav>

    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import AppIcon from '@/components/icons/AppIcon.vue'

import {useRouter} from "vue-router";

const router = useRouter();

const year = computed(() => new Date().getFullYear())

const links = [
  { label: 'Home', route: '/' },
  { label: 'Teacher', route: '/teacher' },
  { label: 'Student', route: '/student' },
]

const goToPage = (route) => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  router.push(route);
}
</script>