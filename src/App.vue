<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import LanguageSwitch, { type Locale } from './components/LanguageSwitch.vue'

const locale = ref<Locale>('cs')

type Messages = {
  rights: string
  switchLanguage: string
}

const fallbackMessages: Messages = {
  rights: '',
  switchLanguage: 'Switch language',
}

const messagesCache = new Map<Locale, Messages>()
const currentMessages = ref<Messages>(fallbackMessages)

async function loadMessages(nextLocale: Locale) {
  const cachedMessages = messagesCache.get(nextLocale)

  if (cachedMessages) {
    currentMessages.value = cachedMessages
    return
  }

  const response = await fetch(`/assets/i18n/${nextLocale}.json`)

  if (!response.ok) {
    throw new Error(`Failed to load ${nextLocale} translations.`)
  }

  const nextMessages = (await response.json()) as Messages

  messagesCache.set(nextLocale, nextMessages)
  currentMessages.value = nextMessages
}

onMounted(() => {
  void loadMessages(locale.value)
})

watch(locale, (nextLocale) => {
  void loadMessages(nextLocale)
})
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-slate-50 text-slate-950">
    <header class="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <RouterLink
          to="/"
          class="text-base font-semibold text-slate-950 transition-colors hover:text-sky-700"
        >
          CRUD Demo
        </RouterLink>

        <LanguageSwitch v-model="locale" :label="currentMessages.switchLanguage" />
      </nav>
    </header>

    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <RouterView />
    </main>

    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto max-w-6xl px-4 py-4 text-sm text-slate-600 sm:px-6 lg:px-8">
        {{ currentMessages.rights }}
      </div>
    </footer>
  </div>
</template>
