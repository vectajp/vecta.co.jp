import { describe, expect, test } from 'bun:test'
import { articleRedirects, articles, getArticleBySlug } from './registry'

describe('article registry', () => {
  test('contains the existing article slugs', () => {
    expect(articles.map((article) => article.slug).sort()).toEqual([
      'vecta-launch-story',
      'what-is-vector-data',
    ])
  })

  test('sorts articles newest first', () => {
    const timestamps = articles.map((article) => article.publishedAt.getTime())
    expect(timestamps).toEqual([...timestamps].sort((a, b) => b - a))
  })

  test('keeps required metadata available', () => {
    for (const article of articles) {
      expect(article.title.length).toBeGreaterThan(0)
      expect(article.description.length).toBeGreaterThan(0)
      expect(article.heroImage).toMatch(/^\//)
      expect(getArticleBySlug(article.slug)?.slug).toBe(article.slug)
    }
  })

  test('keeps merged article URLs redirected to the canonical article', () => {
    expect(articleRedirects['homepage-launch']).toBe('vecta-launch-story')
    expect(articleRedirects['about-gdrant']).toBe('what-is-vector-data')
  })
})
