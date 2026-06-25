<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PaginationControls from '@/components/PaginationControls.vue'
import PostTable from '@/components/posts/PostTable.vue'
import { usePosts } from '@/composables/usePosts'

const searchDebounceMs = 350
const itemsPerPageOptions = [5, 10, 25] as const
const { posts, postCount, isLoading, errorMessage, loadPosts } = usePosts()
const route = useRoute()
const router = useRouter()
const searchInput = shallowRef('')
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
const pageIndex = computed(() => getPositiveNumber(route.query.pageIndex, 1))
const pageSize = computed(() => getPositiveNumber(route.query.pageSize, 5))
const isInitialLoading = computed(() => isLoading.value && posts.value.length === 0)

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

  await router.replace({
    query: {
      pageSize: String(input.pageSize ?? pageSize.value),
      query: nextQuery || undefined,
      pageIndex: String(input.pageIndex ?? pageIndex.value),
    },
  })
}

function changePage(page: number) {
  void updateListQuery({ pageIndex: page })
}

function changeItemsPerPage(limit: number) {
  void updateListQuery({ pageIndex: 1, pageSize: limit })
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

onBeforeUnmount(() => {
  clearTimeout(searchDebounceId)
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
        :value="searchInput"
        type="search"
        class="block w-full max-w-md rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        placeholder="Search by title or body"
        @input="changeSearchQuery"
      />
    </div>

    <p
      v-if="errorMessage"
      class="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
    >
      {{ errorMessage }}
    </p>

    <p
      v-else-if="isInitialLoading"
      class="rounded-md border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500"
    >
      Loading posts...
    </p>

    <div v-else class="space-y-3">
      <PostTable :posts="posts" />
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
  </section>
</template>
