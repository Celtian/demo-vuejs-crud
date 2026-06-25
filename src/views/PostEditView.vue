<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PostForm from '@/components/posts/PostForm.vue'
import { usePosts, type Post, type PostInput } from '@/composables/usePosts'

const route = useRoute()
const router = useRouter()
const { findPost, updatePost } = usePosts()

const postId = computed(() => Number(route.params.id))
const post = shallowRef<Post>()
const isLoading = shallowRef(false)

watch(
  postId,
  async (id) => {
    isLoading.value = true
    post.value = await findPost(id)
    isLoading.value = false
  },
  { immediate: true },
)

async function submitPost(input: PostInput) {
  const updatedPost = await updatePost(postId.value, input)

  if (!updatedPost) {
    return
  }

  await router.push(`/${updatedPost.id}`)
}
</script>

<template>
  <section v-if="isLoading" class="mx-auto max-w-2xl space-y-4 text-center">
    <p class="text-sm text-slate-500">Loading post...</p>
  </section>

  <section v-else-if="post" class="mx-auto max-w-2xl space-y-6">
    <div>
      <p class="text-sm font-medium text-sky-700">Post #{{ post.id }}</p>
      <h1 class="mt-1 text-2xl font-semibold text-slate-950">Edit post</h1>
    </div>

    <PostForm :initial-value="post" submit-label="Save changes" @submit="submitPost" />
  </section>

  <section v-else class="mx-auto max-w-2xl space-y-4 text-center">
    <p class="text-sm font-medium text-sky-700">Post not found</p>
    <h1 class="text-2xl font-semibold text-slate-950">This post cannot be edited.</h1>
    <RouterLink to="/" class="font-medium text-sky-700 transition-colors hover:text-sky-900">
      Back to posts
    </RouterLink>
  </section>
</template>
