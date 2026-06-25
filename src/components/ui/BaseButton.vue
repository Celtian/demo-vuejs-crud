<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

const props = withDefaults(
  defineProps<{
    to?: RouteLocationRaw
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link'
    size?: 'sm' | 'md' | 'icon'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
)

const buttonClasses = computed(() => [
  'inline-flex cursor-pointer items-center justify-center rounded-md text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed',
  {
    'h-9 px-3 font-medium': props.size === 'sm',
    'h-10 px-4 font-semibold': props.size === 'md',
    'size-10 text-3xl leading-none': props.size === 'icon',
    'bg-sky-700 text-white hover:bg-sky-800 focus-visible:outline-sky-700 disabled:bg-sky-300':
      props.variant === 'primary',
    'border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-100 focus-visible:outline-sky-600 disabled:bg-slate-100 disabled:text-slate-400':
      props.variant === 'secondary',
    'border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 focus-visible:outline-rose-600 disabled:text-rose-300':
      props.variant === 'danger',
    'text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-sky-600 disabled:text-slate-300 disabled:hover:bg-transparent':
      props.variant === 'ghost',
    'px-0 font-semibold text-slate-950 hover:text-sky-700 focus-visible:outline-sky-600 disabled:text-slate-400':
      props.variant === 'link',
  },
])
</script>

<template>
  <RouterLink v-if="to" :to="to" :class="buttonClasses">
    <slot />
  </RouterLink>

  <button v-else :type="type" :disabled="disabled" :class="buttonClasses">
    <slot />
  </button>
</template>
