import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { routes } from '@/router'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes,
  })
}

describe('router', () => {
  it('resolves post CRUD routes', async () => {
    const router = createTestRouter()

    await router.push('/')
    expect(router.currentRoute.value.name).toBe('post-list')

    await router.push('/create')
    expect(router.currentRoute.value.name).toBe('post-create')

    await router.push('/1')
    expect(router.currentRoute.value.name).toBe('post-detail')

    await router.push('/1/edit')
    expect(router.currentRoute.value.name).toBe('post-edit')
  })

  it('resolves unknown routes to not found', async () => {
    const router = createTestRouter()

    await router.push('/missing/page')

    expect(router.currentRoute.value.name).toBe('not-found')
  })
})
