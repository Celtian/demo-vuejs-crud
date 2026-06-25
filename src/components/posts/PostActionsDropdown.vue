<script setup lang="ts">
import { computed, onBeforeUnmount, useTemplateRef, watch } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useTranslations } from '@/composables/useTranslations'

const props = defineProps<{
  postId: number
}>()

const emit = defineEmits<{
  delete: [id: number]
}>()

const openPostId = defineModel<number | undefined>({ required: true })
const dropdownRef = useTemplateRef<HTMLElement>('dropdown')
const isOpen = computed(() => openPostId.value === props.postId)
const { t } = useTranslations()

function closeMenu() {
  if (isOpen.value) {
    openPostId.value = undefined
  }
}

function toggleMenu() {
  openPostId.value = isOpen.value ? undefined : props.postId
}

function deletePost() {
  emit('delete', props.postId)
  closeMenu()
}

function closeOnOutsideClick(event: MouseEvent) {
  if (!dropdownRef.value?.contains(event.target as Node)) {
    closeMenu()
  }
}

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeMenu()
  }
}

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('click', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return
  }

  document.removeEventListener('click', closeOnOutsideClick)
  document.removeEventListener('keydown', closeOnEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeOnOutsideClick)
  document.removeEventListener('keydown', closeOnEscape)
})
</script>

<template>
  <div ref="dropdown" class="relative inline-flex justify-end">
    <BaseButton
      variant="ghost"
      size="icon"
      :aria-label="t('postActions.label')"
      :aria-expanded="isOpen"
      aria-haspopup="menu"
      @click.stop="toggleMenu"
    >
      <svg class="size-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
          fill="currentColor"
        />
      </svg>
    </BaseButton>

    <div
      v-if="isOpen"
      class="absolute top-10 right-0 z-20 w-36 rounded-md border border-slate-200 bg-white py-2 text-left shadow-lg"
      role="menu"
    >
      <RouterLink :to="`/${postId}`" class="action-item" role="menuitem" @click="closeMenu">
        <svg class="size-5" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <path d="M12 10v7M12 7h.01" stroke="white" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span>{{ t('actions.detail') }}</span>
      </RouterLink>

      <RouterLink :to="`/${postId}/edit`" class="action-item" role="menuitem" @click="closeMenu">
        <svg class="size-5" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 17.5V21h3.5L18 10.5 14.5 7 4 17.5Z" fill="currentColor" />
          <path d="m16 5 3 3" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
        </svg>
        <span>{{ t('actions.edit') }}</span>
      </RouterLink>

      <button type="button" class="action-item w-full" role="menuitem" @click="deletePost">
        <svg class="size-5" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 7h12l-1 14H7L6 7Zm3-4h6l1 2H8l1-2Zm-4 2h14v2H5V5Z" fill="currentColor" />
        </svg>
        <span>{{ t('actions.delete') }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.action-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  color: var(--color-slate-800);
  font-size: 1rem;
  line-height: 1.5rem;
  transition: background-color 150ms ease;
}

.action-item:hover {
  background-color: var(--color-slate-100);
}
</style>
