<script setup lang="ts">
export type Locale = 'cs' | 'en'

defineProps<{
  label: string
}>()

const locale = defineModel<Locale>({ required: true })

function switchLocale() {
  locale.value = locale.value === 'cs' ? 'en' : 'cs'
}
</script>

<template>
  <button
    type="button"
    class="inline-flex h-9 cursor-pointer items-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-sky-700 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
    :aria-label="label"
    @click="switchLocale"
  >
    {{ locale.toUpperCase() }}
  </button>
</template>
