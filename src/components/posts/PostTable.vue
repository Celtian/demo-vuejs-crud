<script setup lang="ts">
import { shallowRef } from 'vue'
import PostActionsDropdown from '@/components/posts/PostActionsDropdown.vue'
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'
import type { Post } from '@/composables/usePosts'
import { useTranslations } from '@/composables/useTranslations'

withDefaults(
  defineProps<{
    posts: readonly Post[]
    isLoading?: boolean
    skeletonRows?: number
  }>(),
  {
    isLoading: false,
    skeletonRows: 5,
  },
)

const emit = defineEmits<{
  delete: [id: number]
}>()

const openActionsPostId = shallowRef<number>()
const { t } = useTranslations()

function deletePost(id: number) {
  emit('delete', id)
}
</script>

<template>
  <div class="overflow-visible">
    <table class="min-w-full table-fixed divide-y divide-slate-200 text-sm">
      <thead class="bg-slate-100 text-left text-xs font-semibold uppercase text-slate-600">
        <tr>
          <th class="w-1/3 px-4 py-3">{{ t('table.title') }}</th>
          <th class="px-4 py-3">{{ t('table.body') }}</th>
          <th class="w-32 px-4 py-3 text-right">{{ t('table.actions') }}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200">
        <template v-if="isLoading">
          <tr v-for="row in skeletonRows" :key="row" class="h-20 align-middle">
            <td class="w-1/3 px-4 py-3">
              <SkeletonBlock width="75%" />
            </td>
            <td class="px-4 py-3">
              <div class="space-y-2">
                <SkeletonBlock width="95%" />
                <SkeletonBlock width="70%" />
              </div>
            </td>
            <td class="w-32 px-4 py-3">
              <SkeletonBlock width="2rem" class="ml-auto" />
            </td>
          </tr>
        </template>

        <template v-else>
          <tr v-for="post in posts" :key="post.id" class="h-20 align-middle">
            <td class="px-4 py-3 font-medium text-slate-950">
              <RouterLink
                :to="`/${post.id}`"
                class="line-clamp-2 transition-colors hover:text-sky-700"
              >
                {{ post.title }}
              </RouterLink>
            </td>
            <td class="max-w-xl px-4 py-3 text-slate-600">
              <span class="body-clamp">{{ post.body }}</span>
            </td>
            <td class="px-4 py-3 text-right">
              <PostActionsDropdown
                v-model="openActionsPostId"
                :post-id="post.id"
                @delete="deletePost"
              />
            </td>
          </tr>
        </template>

        <tr v-if="!isLoading && posts.length === 0">
          <td colspan="3" class="px-4 py-8 text-center text-slate-500">
            {{ t('postList.noPosts') }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.body-clamp {
  display: -webkit-box;
  min-height: 2.5rem;
  max-height: 2.5rem;
  overflow: hidden;
  line-height: 1.25rem;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
