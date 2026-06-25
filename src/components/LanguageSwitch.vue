<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'

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
  <BaseButton variant="secondary" size="sm" :aria-label="label" @click="switchLocale">
    {{ locale.toUpperCase() }}
  </BaseButton>
</template>
