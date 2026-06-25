<script setup lang="ts">
import { useTranslations } from '@/composables/useTranslations'

const { t } = useTranslations()
</script>

<template>
  <section class="mx-auto max-w-2xl space-y-4 text-center">
    <p class="text-sm font-medium text-sky-700">404</p>
    <h1 class="text-3xl font-semibold text-slate-950">{{ t('notFound.title') }}</h1>
    <p class="text-slate-600">{{ t('notFound.description') }}</p>
    <RouterLink to="/" class="font-medium text-sky-700 transition-colors hover:text-sky-900">
      {{ t('notFound.backToPosts') }}
    </RouterLink>
  </section>
</template>
