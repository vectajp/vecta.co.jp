import { describe, expect, test } from 'bun:test'
import { navItems, sectionHeadings, site } from './content'

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

  test('defines a section heading for every navigation anchor', () => {
    for (const item of navItems) {
      const key = item.href.slice(1) as keyof typeof sectionHeadings
      expect(sectionHeadings[key]).toBeDefined()
      expect(sectionHeadings[key].kicker).not.toBeEmpty()
      expect(sectionHeadings[key].title).not.toBeEmpty()
    }
  })
})
