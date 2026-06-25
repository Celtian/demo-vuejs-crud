import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('renders the application shell', () => {
    const wrapper = mount(App)

    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.find('footer').exists()).toBe(true)
    expect(wrapper.find('header').text()).toContain('CRUD Demo')
    expect(wrapper.find('footer').text()).toContain('Všechna práva vyhrazena © 2026')
  })
})
