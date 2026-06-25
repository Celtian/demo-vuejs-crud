import { beforeEach, describe, expect, it, vi } from 'vitest'

import { flushPromises, mount } from '@vue/test-utils'
import App from '../App.vue'

const messagesByUrl: Record<string, object> = {
  '/assets/i18n/cs.json': {
    rights: 'Všechna práva vyhrazena © 2026',
    switchLanguage: 'Přepnout jazyk',
  },
  '/assets/i18n/en.json': {
    rights: 'All rights reserved © 2026',
    switchLanguage: 'Switch language',
  },
}

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => ({
        ok: true,
        json: async () => messagesByUrl[url],
      })),
    )
  })

  it('renders the application shell', async () => {
    const wrapper = mount(App)
    await flushPromises()

    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.find('footer').exists()).toBe(true)
    expect(wrapper.find('header').text()).toContain('CRUD Demo')
    expect(wrapper.find('footer').text()).toContain('Všechna práva vyhrazena © 2026')

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(wrapper.find('footer').text()).toContain('All rights reserved © 2026')

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(wrapper.find('footer').text()).toContain('Všechna práva vyhrazena © 2026')
  })
})
