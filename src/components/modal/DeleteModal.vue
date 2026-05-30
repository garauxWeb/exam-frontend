<template>
  <Teleport to="body">
    <div
        v-if="show"
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    >
      <div class="bg-white rounded-2xl shadow-xl px-8 py-7 max-w-sm w-full">
        <div class="w-11 h-11 rounded-full bg-rose-100 flex items-center justify-center mb-4">
          <app-icon icon="tabler:trash" :size="20" class="text-rose-500" />
        </div>
        <h3 class="font-display font-semibold text-slate-800 text-lg mb-2">{{ title }}</h3>
        <p class="text-slate-500 text-sm mb-6 leading-relaxed">{{ description }}</p>
        <div class="flex gap-3">
          <button
              @click="$emit('cancel')"
              class="flex-1 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
              @click="$emit('confirm')"
              class="flex-1 text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 px-4 py-2.5 rounded-lg transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import AppIcon from "@/components/icons/AppIcon.vue";

defineProps({
  show: Boolean,
  title: { type: String, default: 'Are you sure?' },
  description: { type: String, default: 'This action cannot be undone.' }
})

defineEmits(['confirm', 'cancel'])
</script>