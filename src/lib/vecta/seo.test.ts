import { describe, expect, test } from 'bun:test'
import {
  buildArticleJsonLd,
  buildCanonicalUrl,
  buildOrganizationJsonLd,
  buildSitemapXml,
  buildTitle,
} from './seo'

describe('seo helpers', () => {
  test('builds Vecta titles', () => {
    expect(buildTitle()).toBe('Vecta | まちの知識を、未来につなぐ')
    expect(buildTitle('記事')).toBe('記事 | Vecta')
  })

  test('builds canonical URLs from paths', () => {
    expect(buildCanonicalUrl('/article/what-is-vector-data/')).toBe(
      'https://www.vecta.co.jp/article/what-is-vector-data/',
    )
  })

  test('keeps organization structured data', () => {
    expect(buildOrganizationJsonLd().name).toBe('株式会社Vecta')
  })

  test('renders sitemap lastmod dates in JST regardless of build TZ', () => {
    expect(buildSitemapXml()).toContain('<lastmod>2026-07-10</lastmod>')
  })

  test('renders article structured-data dates in JST', () => {
    const jsonLd = buildArticleJsonLd({
      slug: 'timezone-test',
      title: 'タイムゾーンテスト',
      description: '記事の日付を JST 基準で出力する',
      publishedAt: new Date('2026-07-13T00:00:00+09:00'),
      updatedAt: new Date('2026-07-14T00:00:00+09:00'),
      heroImage: '/article/timezone-test.png',
    })

    expect(jsonLd.datePublished).toBe('2026-07-13')
    expect(jsonLd.dateModified).toBe('2026-07-14')
  })
})
