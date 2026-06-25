<script setup lang="ts">
import { computed, onMounted, provide, ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import LanguageSwitch, { type Locale } from './components/LanguageSwitch.vue'
import { fallbackMessages, messagesKey, type Messages } from './composables/useTranslations'

const localeStorageKey = 'demo-vuejs-crud-locale'
const supportedLocales = ['cs', 'en'] as const
const locale = ref<Locale>(getStoredLocale())
const route = useRoute() as ReturnType<typeof useRoute> | undefined
const messagesCache = new Map<Locale, Messages>()
const currentMessages = ref<Messages>(fallbackMessages)
const routeTitleKeys = {
  'post-list': 'title.list',
  'post-create': 'title.create',
  'post-detail': 'title.detail',
  'post-edit': 'title.edit',
  'not-found': 'title.notFound',
} as const

provide(messagesKey, currentMessages)

function getStoredLocale(): Locale {
  const storedLocale = localStorage.getItem(localeStorageKey)

  if (supportedLocales.includes(storedLocale as Locale)) {
    return storedLocale as Locale
  }

  return 'cs'
}

const documentTitle = computed(() => {
  const routeName = typeof route?.name === 'string' ? route.name : 'post-list'
  const titleKey = routeTitleKeys[routeName as keyof typeof routeTitleKeys] ?? 'title.notFound'

  return appMessage(titleKey)
})

function appMessage(key: string) {
  return currentMessages.value[key] ?? fallbackMessages[key] ?? key
}

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
  localStorage.setItem(localeStorageKey, nextLocale)
  void loadMessages(nextLocale)
})

watchEffect(() => {
  document.documentElement.lang = locale.value
  document.title = documentTitle.value
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
          {{ appMessage('app.title') }}
        </RouterLink>

        <LanguageSwitch v-model="locale" :label="appMessage('language.switch')" />
      </nav>
    </header>

    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <RouterView />
    </main>

    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto max-w-6xl px-4 py-4 text-center text-sm text-slate-600 sm:px-6 lg:px-8">
        {{ appMessage('app.rights') }}
      </div>
    </footer>
  </div>
</template>
