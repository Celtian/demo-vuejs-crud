<script setup lang="ts">
const model = defineModel<string>({ required: true })
</script>

<template>
  <textarea
    v-model="model"
    class="block w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
  />
</template>
