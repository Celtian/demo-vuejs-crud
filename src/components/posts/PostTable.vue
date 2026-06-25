<script setup lang="ts">
import type { Post } from '@/composables/usePosts'

defineProps<{
  posts: readonly Post[]
}>()
</script>

<template>
  <div class="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
    <table class="min-w-full divide-y divide-slate-200 text-sm">
      <thead class="bg-slate-100 text-left text-xs font-semibold uppercase text-slate-600">
        <tr>
          <th class="px-4 py-3">Title</th>
          <th class="px-4 py-3">Body</th>
          <th class="w-32 px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200">
        <tr v-for="post in posts" :key="post.id" class="align-top">
          <td class="px-4 py-3 font-medium text-slate-950">
            <RouterLink :to="`/${post.id}`" class="transition-colors hover:text-sky-700">
              {{ post.title }}
            </RouterLink>
          </td>
          <td class="max-w-xl px-4 py-3 text-slate-600">
            {{ post.body }}
          </td>
          <td class="px-4 py-3 text-right">
            <RouterLink
              :to="`/${post.id}/edit`"
              class="font-medium text-sky-700 transition-colors hover:text-sky-900"
            >
              Edit
            </RouterLink>
          </td>
        </tr>
        <tr v-if="posts.length === 0">
          <td colspan="3" class="px-4 py-8 text-center text-slate-500">No posts found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
