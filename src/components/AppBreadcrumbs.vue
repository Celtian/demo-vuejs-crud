<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, type RouteLocationRaw } from 'vue-router'
import { useTranslations } from '@/composables/useTranslations'

type Breadcrumb = {
  label: string
  to?: RouteLocationRaw
}

const route = useRoute() as ReturnType<typeof useRoute> | undefined
const { t } = useTranslations()

const postId = computed(() => String(route?.params.id ?? ''))
const breadcrumbs = computed<Breadcrumb[]>(() => {
  const routeName = typeof route?.name === 'string' ? route.name : 'post-list'
  const items: Breadcrumb[] = [{ label: t('breadcrumbs.posts'), to: '/' }]

  if (routeName === 'post-create') {
    items.push({ label: t('actions.create') })
    return items
  }

  if (routeName === 'post-detail' && postId.value) {
    items.push({ label: postId.value })
    return items
  }

  if (routeName === 'post-edit' && postId.value) {
    items.push({ label: postId.value, to: `/${postId.value}` }, { label: t('actions.edit') })
    return items
  }

  if (routeName === 'not-found') {
    items.push({ label: t('notFound.title') })
  }

  return items
})
</script>

<template>
  <nav class="bg-slate-50" :aria-label="t('breadcrumbs.label')">
    <ol
      class="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 text-sm font-medium text-blue-700 sm:px-6 lg:px-8"
    >
      <li v-for="(breadcrumb, index) in breadcrumbs" :key="`${breadcrumb.label}-${index}`">
        <div class="flex items-center gap-3">
          <span v-if="index > 0" class="text-slate-950" aria-hidden="true">&gt;</span>

          <RouterLink
            v-if="breadcrumb.to && index < breadcrumbs.length - 1"
            :to="breadcrumb.to"
            class="rounded-md px-3 py-2 transition-colors hover:bg-white hover:text-blue-900 hover:shadow-sm"
          >
            {{ breadcrumb.label }}
          </RouterLink>

          <span v-else class="px-3 py-2" aria-current="page">
            {{ breadcrumb.label }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>
