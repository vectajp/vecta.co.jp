import { describe, expect, test } from 'bun:test'
import { navItems, site } from './content'

describe('vecta site content', () => {
  test('defines canonical site metadata', () => {
    expect(site.url).toBe('https://www.vecta.co.jp')
    expect(site.title).toBe('Vecta')
    expect(site.description).toContain('公共性')
  })

  test('keeps required navigation anchors', () => {
    expect(navItems.map((item) => item.href)).toEqual([
      '#concept',
      '#projects',
      '#articles',
      '#company',
      '#contact',
    ])
  })
})
