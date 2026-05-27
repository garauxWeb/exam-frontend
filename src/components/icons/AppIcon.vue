<!-- components/AppIcon.vue -->
<template>
  <Icon :icon="icon" :width="size" :height="size" :style="color ? { color } : {}" />
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  icon: {
    type: String,
    required: true
  },
  size: {
    type: [String, Number],
    default: 16
  },
  color: {
    type: String,
    default: null
  }
})
</script>
