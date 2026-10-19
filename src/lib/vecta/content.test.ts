import { describe, expect, test } from 'bun:test'
import { navItems, sectionHeadings, site } from './content'

describe('vecta site content', () => {
  test('defines canonical site metadata', () => {
    expect(site.url).toBe('https://www.vecta.co.jp')
    expect(site.title).toBe('Vecta')
    expect(site.description).toContain('公共性')
  })

  test('links the two services, news and company information', () => {
    expect(navItems).toEqual([
      { href: 'https://swarrow.com/chat', label: 'SwarrowChat' },
      { href: 'https://swarrow.com/call', label: 'SwarrowCall' },
      { href: '/article/', label: 'ニュース' },
      { href: '/company/', label: '会社情報' },
    ])
    expect(sectionHeadings.company.title).toBe('会社情報')
  })
})
