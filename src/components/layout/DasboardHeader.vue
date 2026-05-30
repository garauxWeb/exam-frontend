<script setup>
defineProps({

  title: { type: String },
  subTitle: { type: String },
  image: { type: String, default: null },
})
</script>

<template>
  <div class="mb-10">
    <div class="flex items-center gap-6">
      <div class="w-[120px] h-[120px] shrink-0 rounded-full overflow-hidden" v-if="image !== null">
        <img :src="image" alt="descrizione" class="w-full h-full object-cover" />
      </div>
      <div>
        <h1 class="text-4xl font-semibold text-slate-800 tracking-tight">
          {{ title }}
        </h1>
        <p class="text-slate-500 text-sm mt-2">{{ subTitle }}</p>
      </div>
    </div>
  </div>
</template>