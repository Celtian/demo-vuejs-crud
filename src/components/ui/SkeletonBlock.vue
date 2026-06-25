<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: string
    height?: string
  }>(),
  {
    width: '100%',
    height: '1rem',
  },
)
</script>

<template>
  <span class="block animate-pulse rounded bg-slate-200" :style="{ width, height }" />
</template>
