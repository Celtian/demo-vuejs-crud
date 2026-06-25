<script setup lang="ts">
import { onBeforeUnmount, useId, watch } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

withDefaults(
  defineProps<{
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    isConfirming?: boolean
  }>(),
  {
    confirmLabel: 'Yes',
    cancelLabel: 'No',
    isConfirming: false,
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const isOpen = defineModel<boolean>({ required: true })
const titleId = useId()

function cancel() {
  if (!isOpen.value) {
    return
  }

  isOpen.value = false
  emit('cancel')
}

function confirm() {
  emit('confirm')
}

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    cancel()
  }
}

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('keydown', closeOnEscape)
    return
  }

  document.removeEventListener('keydown', closeOnEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', closeOnEscape)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/35 px-4 pt-4 sm:items-center sm:pt-0"
      @click.self="cancel"
    >
      <section
        class="w-full max-w-md overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-sm"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
      >
        <header class="border-b border-slate-200 px-6 py-5">
          <h2 :id="titleId" class="text-2xl font-semibold leading-tight">{{ title }}</h2>
        </header>

        <div class="px-6 py-7">
          <p class="text-xl leading-7 text-slate-500">{{ message }}</p>
        </div>

        <footer class="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <BaseButton variant="secondary" :disabled="isConfirming" @click="cancel">
            {{ cancelLabel }}
          </BaseButton>
          <BaseButton variant="secondary" :disabled="isConfirming" @click="confirm">
            {{ confirmLabel }}
          </BaseButton>
        </footer>
      </section>
    </div>
  </Teleport>
</template>
