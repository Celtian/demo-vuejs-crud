<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PaginationControls from '@/components/PaginationControls.vue'
import PostTable from '@/components/posts/PostTable.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { usePosts } from '@/composables/usePosts'
import { useTranslations } from '@/composables/useTranslations'

const searchDebounceMs = 350
const defaultPageIndex = 1
const defaultPageSize = 5
const itemsPerPageOptions = [5, 10, 25] as const
const { posts, postCount, isLoading, errorMessage, loadPosts, removePost } = usePosts()
const { t } = useTranslations()
const route = useRoute()
const router = useRouter()
const searchInput = shallowRef('')
const pendingDeletePostId = shallowRef<number>()
const isDeletingPost = shallowRef(false)
let searchDebounceId: ReturnType<typeof setTimeout> | undefined

function getQueryValue(value: unknown) {
  return Array.isArray(value) ? value[0] : value
}

function getPositiveNumber(value: unknown, fallback: number) {
  const parsedValue = Number(getQueryValue(value))

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return fallback
  }

  return parsedValue
}

const searchQuery = computed(() => String(getQueryValue(route.query.query) ?? ''))
const pageIndex = computed(() => getPositiveNumber(route.query.pageIndex, defaultPageIndex))
const pageSize = computed(() => getPositiveNumber(route.query.pageSize, defaultPageSize))
const isInitialLoading = computed(() => isLoading.value && posts.value.length === 0)
const hasQueryParams = computed(() => Object.keys(route.query).length > 0)
const isDeleteModalOpen = computed({
  get: () => pendingDeletePostId.value !== undefined,
  set: (open) => {
    if (!open) {
      pendingDeletePostId.value = undefined
    }
  },
})

watch(
  searchQuery,
  (query) => {
    searchInput.value = query
  },
  { immediate: true },
)

watch(
  () => route.query,
  async () => {
    await loadPosts({
      page: pageIndex.value,
      limit: pageSize.value,
      sort: 'id',
      order: 'asc',
      query: searchQuery.value,
    })
  },
  { immediate: true },
)

async function updateListQuery(input: { query?: string; pageIndex?: number; pageSize?: number }) {
  const nextQuery = input.query ?? searchQuery.value
  const nextPageIndex = input.pageIndex ?? pageIndex.value
  const nextPageSize = input.pageSize ?? pageSize.value

  await router.replace({
    query: {
      pageSize: nextPageSize === defaultPageSize ? undefined : String(nextPageSize),
      query: nextQuery || undefined,
      pageIndex: nextPageIndex === defaultPageIndex ? undefined : String(nextPageIndex),
    },
  })
}

function changePage(page: number) {
  void updateListQuery({ pageIndex: page })
}

function changeItemsPerPage(limit: number) {
  void updateListQuery({ pageIndex: 1, pageSize: limit })
}

function requestDeletePost(id: number) {
  pendingDeletePostId.value = id
}

function cancelDeletePost() {
  pendingDeletePostId.value = undefined
}

async function confirmDeletePost() {
  const postId = pendingDeletePostId.value

  if (postId === undefined || isDeletingPost.value) {
    return
  }

  isDeletingPost.value = true

  try {
    await removePost(postId)
    pendingDeletePostId.value = undefined
  } finally {
    isDeletingPost.value = false
  }
}

function changeSearchQuery(event: Event) {
  searchInput.value = (event.target as HTMLInputElement).value

  clearTimeout(searchDebounceId)
  searchDebounceId = setTimeout(() => {
    void updateListQuery({
      query: searchInput.value,
      pageIndex: 1,
    })
  }, searchDebounceMs)
}

async function clearQueryParams() {
  clearTimeout(searchDebounceId)
  searchInput.value = ''

  await router.replace({ query: {} })
}

onBeforeUnmount(() => {
  clearTimeout(searchDebounceId)
})
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div class="space-y-2">
        <label for="post-search" class="block text-sm font-medium text-slate-700">
          {{ t('postList.search') }}
        </label>
        <BaseInput
          id="post-search"
          v-model="searchInput"
          type="search"
          class="max-w-md"
          :placeholder="t('postList.searchPlaceholder')"
          @input="changeSearchQuery"
        />
      </div>

      <div class="flex items-center justify-end gap-8 pt-7">
        <BaseButton variant="link" :disabled="!hasQueryParams" @click="clearQueryParams">
          {{ t('actions.clearFilters') }}
        </BaseButton>
        <BaseButton to="/create" variant="link"> {{ t('actions.create') }} </BaseButton>
      </div>
    </div>

    <p
      v-if="errorMessage"
      class="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
    >
      {{ t('errors.loadPosts') }}
    </p>

    <div v-else class="rounded-md border border-slate-200 bg-white shadow-sm">
      <PostTable
        :posts="posts"
        :is-loading="isInitialLoading"
        :skeleton-rows="pageSize"
        @delete="requestDeletePost"
      />
      <PaginationControls
        :page="pageIndex"
        :items-per-page="pageSize"
        :total-items="postCount"
        :items-per-page-options="itemsPerPageOptions"
        :disabled="isLoading"
        @page-change="changePage"
        @items-per-page-change="changeItemsPerPage"
      />
    </div>

    <ConfirmModal
      v-model="isDeleteModalOpen"
      :title="t('confirm.deletePost.title')"
      :message="t('confirm.deletePost.message')"
      :is-confirming="isDeletingPost"
      @cancel="cancelDeletePost"
      @confirm="confirmDeletePost"
    />
  </section>
</template>
