<script setup lang="ts">
import { reactive } from 'vue'
import type { PostInput } from '@/composables/usePosts'

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
        Title <span class="text-rose-700" aria-hidden="true">*</span>
      </label>
      <input
        id="post-title"
        v-model="form.title"
        type="text"
        required
        class="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        placeholder="Post title"
      />
    </div>

    <div class="space-y-2">
      <label for="post-body" class="block text-sm font-medium text-slate-700">
        Body <span class="text-rose-700" aria-hidden="true">*</span>
      </label>
      <textarea
        id="post-body"
        v-model="form.body"
        required
        rows="8"
        class="block w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        placeholder="Write the post body"
      />
    </div>

    <div class="flex items-center gap-3">
      <button
        type="submit"
        class="inline-flex h-10 cursor-pointer items-center rounded-md bg-sky-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
      >
        {{ submitLabel }}
      </button>

      <RouterLink
        to="/"
        class="inline-flex h-10 items-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
      >
        Cancel
      </RouterLink>
    </div>
  </form>
</template>
