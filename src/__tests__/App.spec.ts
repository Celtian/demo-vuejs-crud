import { beforeEach, describe, expect, it, vi } from 'vitest'

import { flushPromises, mount } from '@vue/test-utils'
import App from '../App.vue'

const messagesByUrl: Record<string, object> = {
  '/assets/i18n/cs.json': {
    'app.rights': 'Všechna práva vyhrazena © 2026',
    'app.title': 'CRUD Demo',
    'language.switch': 'Přepnout jazyk',
    'title.list': 'Příspěvky | CRUD Demo',
    'title.notFound': 'Stránka nenalezena | CRUD Demo',
  },
  '/assets/i18n/en.json': {
    'app.rights': 'All rights reserved © 2026',
    'app.title': 'CRUD Demo',
    'language.switch': 'Switch language',
    'title.list': 'Posts | CRUD Demo',
    'title.notFound': 'Page not found | CRUD Demo',
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
