import { describe, expect, test } from 'bun:test'
import {
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
    expect(buildCanonicalUrl('/article/about-gdrant/')).toBe(
      'https://www.vecta.co.jp/article/about-gdrant/',
    )
  })

  test('keeps organization structured data', () => {
    expect(buildOrganizationJsonLd().name).toBe('株式会社Vecta')
  })

  test('renders sitemap lastmod dates in JST regardless of build TZ', () => {
    expect(buildSitemapXml()).toContain('<lastmod>2026-07-10</lastmod>')
  })
})
