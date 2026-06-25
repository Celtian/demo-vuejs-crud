<template>
  <div class="flex min-h-dvh flex-col bg-slate-50 text-slate-950">
    <header class="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav class="mx-auto flex h-14 max-w-6xl items-center px-4 sm:px-6 lg:px-8">
        <RouterLink
          to="/"
          class="text-base font-semibold text-slate-950 transition-colors hover:text-sky-700"
        >
          CRUD Demo
        </RouterLink>
      </nav>
    </header>

    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <RouterView />
    </main>

    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto max-w-6xl px-4 py-4 text-sm text-slate-600 sm:px-6 lg:px-8">
        Všechna práva vyhrazena © 2026
      </div>
    </footer>
  </div>
</template>
