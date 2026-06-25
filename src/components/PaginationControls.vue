<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    page: number
    itemsPerPage: number
    totalItems: number
    itemsPerPageOptions?: readonly number[]
    disabled?: boolean
  }>(),
  {
    itemsPerPageOptions: () => [5, 10, 25, 50],
    disabled: false,
  },
)

const emit = defineEmits<{
  pageChange: [page: number]
  itemsPerPageChange: [itemsPerPage: number]
}>()

const totalPages = computed(() => Math.max(Math.ceil(props.totalItems / props.itemsPerPage), 1))
const firstItem = computed(() => {
  if (props.totalItems === 0) {
    return 0
  }

  return (props.page - 1) * props.itemsPerPage + 1
})
const lastItem = computed(() => Math.min(props.page * props.itemsPerPage, props.totalItems))
const canGoBack = computed(() => props.page > 1)
const canGoForward = computed(() => props.page < totalPages.value)

function changeItemsPerPage(event: Event) {
  emit('itemsPerPageChange', Number((event.target as HTMLSelectElement).value))
}

function goToPreviousPage() {
  if (canGoBack.value && !props.disabled) {
    emit('pageChange', props.page - 1)
  }
}

function goToNextPage() {
  if (canGoForward.value && !props.disabled) {
    emit('pageChange', props.page + 1)
  }
}
</script>

<template>
  <nav
    class="flex flex-col gap-4 border-t border-slate-200 bg-white px-4 py-4 text-sm text-slate-950 sm:flex-row sm:items-center sm:justify-end sm:gap-10"
    aria-label="Pagination"
  >
    <label class="flex items-center gap-3">
      <span>Items per page</span>
      <select
        :value="itemsPerPage"
        :disabled="disabled"
        class="h-12 min-w-24 rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition-colors focus:border-sky-500 focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
        @change="changeItemsPerPage"
      >
        <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </label>

    <p class="min-w-32 text-center sm:text-left">
      {{ firstItem }} - {{ lastItem }} from {{ totalItems }}
    </p>

    <div class="flex items-center justify-end gap-4">
      <button
        type="button"
        class="flex size-10 cursor-pointer items-center justify-center rounded-md text-3xl leading-none text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
        :disabled="disabled || !canGoBack"
        aria-label="Previous page"
        @click="goToPreviousPage"
      >
        &lt;
      </button>

      <button
        type="button"
        class="flex size-10 cursor-pointer items-center justify-center rounded-md text-3xl leading-none text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
        :disabled="disabled || !canGoForward"
        aria-label="Next page"
        @click="goToNextPage"
      >
        &gt;
      </button>
    </div>
  </nav>
</template>
