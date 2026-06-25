<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import { usePosts, type ExpandedPost } from '@/composables/usePosts'

const route = useRoute()
const { findExpandedPost, removePost } = usePosts()

const postId = computed(() => Number(route.params.id))
const post = shallowRef<ExpandedPost>()
const isLoading = shallowRef(false)
const isDeleting = shallowRef(false)

watch(
  postId,
  async (id) => {
    isLoading.value = true
    post.value = await findExpandedPost(id)
    isLoading.value = false
  },
  { immediate: true },
)

async function deleteCurrentPost() {
  if (!post.value) {
    return
  }

  isDeleting.value = true
  await removePost(post.value.id)
  post.value = undefined
  isDeleting.value = false
}
</script>

<template>
  <section v-if="isLoading" class="mx-auto max-w-2xl space-y-4 text-center">
    <p class="text-sm text-slate-500">Loading post...</p>
  </section>

  <section v-else-if="post" class="mx-auto max-w-3xl space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p class="text-sm font-medium text-sky-700">Post #{{ post.id }}</p>
        <h1 class="mt-1 text-3xl font-semibold text-slate-950">{{ post.title }}</h1>
        <p v-if="post.user" class="mt-2 text-sm text-slate-500">By {{ post.user.name }}</p>
      </div>

      <div class="flex gap-2">
        <BaseButton :to="`/${post.id}/edit`"> Edit post </BaseButton>
        <BaseButton variant="danger" :disabled="isDeleting" @click="deleteCurrentPost">
          {{ isDeleting ? 'Deleting...' : 'Delete' }}
        </BaseButton>
      </div>
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
