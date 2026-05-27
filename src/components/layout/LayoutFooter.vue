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
        <a
        v-for="link in links"
        :key="link.label"
        :href="link.href"
        class="text-xs text-slate-400 hover:text-indigo-300 transition-colors duration-200"
        >
        {{ link.label }}
        </a>
      </nav>

    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import AppIcon from '@/components/icons/AppIcon.vue'

const year = computed(() => new Date().getFullYear())

const links = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Support', href: '#' },
]
</script>