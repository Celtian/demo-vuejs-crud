<script setup lang="ts">
import { reactive } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import type { PostInput } from '@/composables/usePosts'
import { useTranslations } from '@/composables/useTranslations'

const props = defineProps<{
  initialValue?: PostInput
  submitLabel: string
}>()

const emit = defineEmits<{
  submit: [value: PostInput]
}>()

const form = reactive<PostInput>({
  title: props.initialValue?.title ?? '',
  body: props.initialValue?.body ?? '',
})
const { t } = useTranslations()

function submitForm() {
  emit('submit', {
    title: form.title.trim(),
    body: form.body.trim(),
  })
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="submitForm">
    <div class="space-y-2">
      <label for="post-title" class="block text-sm font-medium text-slate-700">
        {{ t('form.title') }} <span class="text-rose-700" aria-hidden="true">*</span>
      </label>
      <BaseInput
        id="post-title"
        v-model="form.title"
        type="text"
        required
        :placeholder="t('form.titlePlaceholder')"
      />
    </div>

    <div class="space-y-2">
      <label for="post-body" class="block text-sm font-medium text-slate-700">
        {{ t('form.body') }} <span class="text-rose-700" aria-hidden="true">*</span>
      </label>
      <BaseTextarea
        id="post-body"
        v-model="form.body"
        required
        rows="8"
        :placeholder="t('form.bodyPlaceholder')"
      />
    </div>

    <div class="flex items-center gap-3">
      <BaseButton type="submit">
        {{ submitLabel }}
      </BaseButton>

      <BaseButton to="/" variant="secondary"> {{ t('actions.cancel') }} </BaseButton>

      <slot name="actions" />
    </div>
  </form>
</template>
