<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePosts } from '@/composables/usePosts'

const route = useRoute()
const { findPost } = usePosts()

const postId = computed(() => Number(route.params.id))
const post = computed(() => findPost(postId.value))
</script>

<template>
  <section v-if="post" class="mx-auto max-w-3xl space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p class="text-sm font-medium text-sky-700">Post #{{ post.id }}</p>
        <h1 class="mt-1 text-3xl font-semibold text-slate-950">{{ post.title }}</h1>
      </div>

      <RouterLink
        :to="`/${post.id}/edit`"
        class="inline-flex h-10 items-center justify-center rounded-md bg-sky-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
      >
        Edit post
      </RouterLink>
    </div>

    <article class="rounded-md border border-slate-200 bg-white p-5 text-slate-700 shadow-sm">
      <p class="whitespace-pre-line leading-7">{{ post.body }}</p>
    </article>
  </section>

  <section v-else class="mx-auto max-w-2xl space-y-4 text-center">
    <p class="text-sm font-medium text-sky-700">Post not found</p>
    <h1 class="text-2xl font-semibold text-slate-950">This post does not exist.</h1>
    <RouterLink to="/" class="font-medium text-sky-700 transition-colors hover:text-sky-900">
      Back to posts
    </RouterLink>
  </section>
</template>
