<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import { useTranslations } from '@/composables/useTranslations'

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

const { t } = useTranslations()
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

function changeItemsPerPage(value: string | number) {
  emit('itemsPerPageChange', Number(value))
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
    :aria-label="t('pagination.label')"
  >
    <label class="flex items-center gap-3">
      <span>{{ t('pagination.itemsPerPage') }}</span>
      <BaseSelect
        :model-value="itemsPerPage"
        :disabled="disabled"
        @update:model-value="changeItemsPerPage"
      >
        <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </BaseSelect>
    </label>

    <p class="min-w-32 text-center sm:text-left">
      {{ t('pagination.range', { first: firstItem, last: lastItem, total: totalItems }) }}
    </p>

    <div class="flex items-center justify-end gap-4">
      <BaseButton
        variant="ghost"
        size="icon"
        :disabled="disabled || !canGoBack"
        :aria-label="t('pagination.previousPage')"
        @click="goToPreviousPage"
      >
        &lt;
      </BaseButton>

      <BaseButton
        variant="ghost"
        size="icon"
        :disabled="disabled || !canGoForward"
        :aria-label="t('pagination.nextPage')"
        @click="goToNextPage"
      >
        &gt;
      </BaseButton>
    </div>
  </nav>
</template>
