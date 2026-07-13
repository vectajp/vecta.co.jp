import { describe, expect, test } from 'bun:test'
import { articleRedirects, articles, getArticleBySlug } from './registry'

describe('article registry', () => {
  test('contains the curated article slugs', () => {
    const slugs = articles.map((article) => article.slug)
    expect(slugs).toContain('what-is-vector-data')
    expect(slugs).toContain('vecta-launch-story')
  })

  test('keeps slugs unique', () => {
    const slugs = articles.map((article) => article.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
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
      if (article.videoId) {
        expect(article.videoId).toMatch(/^[A-Za-z0-9_-]{11}$/)
      }
    }
  })

  test('keeps videoId unique across video-based articles', () => {
    const videoIds = articles
      .map((article) => article.videoId)
      .filter((id): id is string => Boolean(id))
    expect(new Set(videoIds).size).toBe(videoIds.length)
  })

  test('keeps merged article URLs redirected to the canonical article', () => {
    expect(articleRedirects['homepage-launch']).toBe('vecta-launch-story')
    expect(articleRedirects['about-gdrant']).toBe('what-is-vector-data')
  })
})
