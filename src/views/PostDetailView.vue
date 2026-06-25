<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'
import { usePosts, type ExpandedPost } from '@/composables/usePosts'
import { useTranslations } from '@/composables/useTranslations'

const route = useRoute()
const router = useRouter()
const { findExpandedPost, removePost } = usePosts()
const { t } = useTranslations()

const postId = computed(() => Number(route.params.id))
const post = shallowRef<ExpandedPost>()
const isLoading = shallowRef(false)
const isDeleting = shallowRef(false)
const isDeleteModalOpen = shallowRef(false)

watch(
  postId,
  async (id) => {
    isLoading.value = true
    post.value = await findExpandedPost(id)
    isLoading.value = false
  },
  { immediate: true },
)

function requestDeleteCurrentPost() {
  if (!post.value) {
    return
  }

  isDeleteModalOpen.value = true
}

function cancelDeleteCurrentPost() {
  isDeleteModalOpen.value = false
}

async function confirmDeleteCurrentPost() {
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
  <section v-if="isLoading" class="mx-auto max-w-3xl space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="w-full max-w-2xl space-y-3">
        <SkeletonBlock width="5rem" height="1rem" />
        <SkeletonBlock width="85%" height="2.25rem" />
        <SkeletonBlock width="9rem" height="1rem" />
      </div>

      <div class="flex items-center gap-2">
        <SkeletonBlock width="4rem" height="2.5rem" />
        <SkeletonBlock width="5rem" height="2.5rem" />
      </div>
    </div>

    <article class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div class="space-y-3">
        <SkeletonBlock height="1.25rem" />
        <SkeletonBlock width="92%" height="1.25rem" />
        <SkeletonBlock width="75%" height="1.25rem" />
      </div>
    </article>
  </section>

  <section v-else-if="post" class="mx-auto max-w-3xl space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p class="text-sm font-medium text-sky-700">{{ t('post.number', { id: post.id }) }}</p>
        <h1 class="mt-1 text-3xl font-semibold text-slate-950">{{ post.title }}</h1>
        <p v-if="post.user" class="mt-2 text-sm text-slate-500">
          {{ t('post.byUser', { name: post.user.name }) }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <BaseButton :to="`/${post.id}/edit`"> {{ t('actions.edit') }} </BaseButton>
        <BaseButton variant="danger" :disabled="isDeleting" @click="requestDeleteCurrentPost">
          {{ t('actions.delete') }}
        </BaseButton>
      </div>
    </div>

    <article class="rounded-md border border-slate-200 bg-white p-5 text-slate-700 shadow-sm">
      <p class="whitespace-pre-line leading-7">{{ post.body }}</p>
    </article>

    <ConfirmModal
      v-model="isDeleteModalOpen"
      :title="t('confirm.deletePost.title')"
      :message="t('confirm.deletePost.message')"
      :is-confirming="isDeleting"
      @cancel="cancelDeleteCurrentPost"
      @confirm="confirmDeleteCurrentPost"
    />
  </section>

  <section v-else class="mx-auto max-w-2xl space-y-4 text-center">
    <p class="text-sm font-medium text-sky-700">{{ t('post.notFound') }}</p>
    <h1 class="text-2xl font-semibold text-slate-950">{{ t('post.notFoundDescription') }}</h1>
    <RouterLink to="/" class="font-medium text-sky-700 transition-colors hover:text-sky-900">
      {{ t('notFound.backToPosts') }}
    </RouterLink>
  </section>
</template>
