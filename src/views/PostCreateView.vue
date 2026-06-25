<script setup lang="ts">
import { useRouter } from 'vue-router'
import PostForm from '@/components/posts/PostForm.vue'
import { usePosts, type PostInput } from '@/composables/usePosts'
import { useTranslations } from '@/composables/useTranslations'

const router = useRouter()
const { createPost } = usePosts()
const { t } = useTranslations()

async function submitPost(input: PostInput) {
  const post = await createPost(input)

  await router.push(`/${post.id}`)
}
</script>

<template>
  <section class="mx-auto max-w-2xl space-y-6">
    <div>
      <p class="text-sm font-medium text-sky-700">{{ t('post.newPost') }}</p>
      <h1 class="mt-1 text-2xl font-semibold text-slate-950">{{ t('post.createHeading') }}</h1>
    </div>

    <PostForm :submit-label="t('postForm.create')" @submit="submitPost" />
  </section>
</template>
