<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PostForm from '@/components/posts/PostForm.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'
import { usePosts, type Post, type PostInput } from '@/composables/usePosts'
import { useTranslations } from '@/composables/useTranslations'

const route = useRoute()
const router = useRouter()
const { findPost, removePost, updatePost } = usePosts()
const { t } = useTranslations()

const postId = computed(() => Number(route.params.id))
const post = shallowRef<Post>()
const isLoading = shallowRef(false)
const isDeleting = shallowRef(false)
const isDeleteModalOpen = shallowRef(false)

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

function requestDeletePost() {
  if (!post.value) {
    return
  }

  isDeleteModalOpen.value = true
}

function cancelDeletePost() {
  isDeleteModalOpen.value = false
}

async function confirmDeletePost() {
  if (!post.value || isDeleting.value) {
    return
  }

  isDeleting.value = true

  try {
    await removePost(post.value.id)
    post.value = undefined
    isDeleteModalOpen.value = false
    await router.push('/')
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <section v-if="isLoading" class="mx-auto max-w-2xl space-y-6">
    <div class="space-y-2">
      <SkeletonBlock width="5rem" height="1rem" />
      <SkeletonBlock width="9rem" height="1.75rem" />
    </div>

    <div class="space-y-5">
      <div class="space-y-2">
        <SkeletonBlock width="4rem" height="1rem" />
        <SkeletonBlock height="2.5rem" />
      </div>

      <div class="space-y-2">
        <SkeletonBlock width="4rem" height="1rem" />
        <SkeletonBlock height="14rem" />
      </div>

      <div class="flex items-center gap-3">
        <SkeletonBlock width="7rem" height="2.5rem" />
        <SkeletonBlock width="5rem" height="2.5rem" />
      </div>
    </div>
  </section>

  <section v-else-if="post" class="mx-auto max-w-2xl space-y-6">
    <div>
      <p class="text-sm font-medium text-sky-700">{{ t('post.number', { id: post.id }) }}</p>
      <h1 class="mt-1 text-2xl font-semibold text-slate-950">{{ t('post.editHeading') }}</h1>
    </div>

    <PostForm :initial-value="post" :submit-label="t('actions.saveChanges')" @submit="submitPost">
      <template #actions>
        <BaseButton variant="danger" :disabled="isDeleting" @click="requestDeletePost">
          {{ t('actions.delete') }}
        </BaseButton>
      </template>
    </PostForm>

    <ConfirmModal
      v-model="isDeleteModalOpen"
      :title="t('confirm.deletePost.title')"
      :message="t('confirm.deletePost.message')"
      :is-confirming="isDeleting"
      @cancel="cancelDeletePost"
      @confirm="confirmDeletePost"
    />
  </section>

  <section v-else class="mx-auto max-w-2xl space-y-4 text-center">
    <p class="text-sm font-medium text-sky-700">{{ t('post.notFound') }}</p>
    <h1 class="text-2xl font-semibold text-slate-950">{{ t('post.notEditable') }}</h1>
    <RouterLink to="/" class="font-medium text-sky-700 transition-colors hover:text-sky-900">
      {{ t('notFound.backToPosts') }}
    </RouterLink>
  </section>
</template>
