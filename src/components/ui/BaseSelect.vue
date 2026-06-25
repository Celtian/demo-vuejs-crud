<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const model = defineModel<string | number>({ required: true })
</script>

<template>
  <span class="relative inline-block">
    <select
      v-model="model"
      v-bind="$attrs"
      class="h-12 min-w-24 appearance-none rounded-md border border-slate-300 bg-white py-2 pr-11 pl-4 text-sm text-slate-950 outline-none transition-colors focus:border-sky-500 focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
    >
      <slot />
    </select>
    <span
      class="pointer-events-none absolute top-1/2 right-4 size-2 -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-slate-950"
      aria-hidden="true"
    />
  </span>
</template>
