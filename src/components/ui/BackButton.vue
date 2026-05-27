<script setup>
import {useRouter} from "vue-router";
import AppIcon from "@/components/icons/AppIcon.vue";

const router = useRouter();
</script>

<template>
  <button
      @click="router.back()"
      class="text-slate-400 hover:text-slate-600 transition-colors duration-200"
  >
    <div class="flex items-center justify-center">
      <app-icon icon="mdi:arrow-left" size="18" color="currentColor" />
      <span class="text-sm">Back</span>
    </div>

  </button>
</template>

<style scoped>

</style>