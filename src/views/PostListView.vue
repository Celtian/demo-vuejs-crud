<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import PostTable from '@/components/posts/PostTable.vue'
import { usePosts } from '@/composables/usePosts'

const searchQuery = shallowRef('')
const { posts, postCount } = usePosts()

const filteredPosts = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase()

  if (!query) {
    return posts.value
  }

  return posts.value.filter((post) => {
    return (
      post.title.toLocaleLowerCase().includes(query) ||
      post.body.toLocaleLowerCase().includes(query)
    )
  })
})
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-medium text-sky-700">{{ postCount }} posts</p>
        <h1 class="mt-1 text-2xl font-semibold text-slate-950">Posts</h1>
      </div>

      <RouterLink
        to="/create"
        class="inline-flex h-10 items-center justify-center rounded-md bg-sky-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
      >
        Create post
      </RouterLink>
    </div>

    <div class="space-y-2">
      <label for="post-search" class="block text-sm font-medium text-slate-700">Search</label>
      <input
        id="post-search"
        v-model="searchQuery"
        type="search"
        class="block w-full max-w-md rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        placeholder="Search by title or body"
      />
    </div>

    <PostTable :posts="filteredPosts" />
  </section>
</template>
