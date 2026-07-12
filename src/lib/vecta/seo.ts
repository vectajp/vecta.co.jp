import { articles } from '$lib/articles/registry'
import type { ArticleMeta } from '$lib/articles/types'
import { companyDetails, hero, site } from './content'

export type PageSeo = {
  title: string
  description: string
  canonical: string
  image: string
  type: 'website' | 'article'
}

export type JsonLd = Record<string, unknown>
export type ArticlePageMeta = Omit<ArticleMeta, 'component'>
type SitemapUrl = {
  loc: string
  priority: string
  lastmod?: string
}

// en-CA ロケールは YYYY-MM-DD 形式を返す
const formatDateJst = (date: Date) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)

const ensureTrailingSlash = (path: string) => {
  if (path === '') {
    return '/'
  }

  if (path.includes('.') || path.endsWith('/')) {
    return path
  }

  return `${path}/`
}

export const buildTitle = (title?: string) =>
  title ? `${title} | ${site.title}` : `${site.title} | ${hero.title}`

export const buildCanonicalUrl = (path: string) =>
  new URL(ensureTrailingSlash(path), site.url).toString()

export const buildAbsoluteUrl = (path: string) =>
  new URL(path, site.url).toString()

export const buildPageSeo = ({
  title,
  description = site.description,
  path = '/',
  type = 'website',
  imagePath = site.ogImage,
}: {
  title?: string
  description?: string
  path?: string
  type?: 'website' | 'article'
  imagePath?: string
} = {}): PageSeo => ({
  title: buildTitle(title),
  description,
  canonical: buildCanonicalUrl(path),
  image: buildAbsoluteUrl(imagePath),
  type,
})

export const buildWebsiteJsonLd = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: site.title,
  url: buildCanonicalUrl('/'),
  description: site.description,
})

export const buildOrganizationJsonLd = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: companyDetails[0]?.value ?? '株式会社Vecta',
  url: buildCanonicalUrl('/'),
  logo: buildAbsoluteUrl('/favicon.svg'),
  description: site.description,
  address: {
    '@type': 'PostalAddress',
    addressLocality: '東京都渋谷区',
    postalCode: '150-0002',
    streetAddress: '渋谷2-19-15 宮益坂ビルディング609',
  },
})

export const buildBreadcrumbJsonLd = (
  items: Array<{ name: string; path: string }>,
): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: buildCanonicalUrl(item.path),
  })),
})

export const buildFaqJsonLd = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Vectaとは何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vectaは、まちにある多様な知識をAIが扱える形へ整理し、公共性のあるテクノロジーで地域の未来を支える会社です。',
      },
    },
    {
      '@type': 'Question',
      name: 'Vectaが大切にしていることは何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vectaは、人の判断を置き換えるAIではなく、人の判断を支え、日々の不安を減らし、地域の知識を未来へ受け継ぐ、誰もが使えるAIを育てていくことを大切にしています。',
      },
    },
  ],
})

export const buildArticleJsonLd = (article: ArticlePageMeta): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.description,
  datePublished: article.publishedAt.toISOString(),
  dateModified: (article.updatedAt ?? article.publishedAt).toISOString(),
  image: buildAbsoluteUrl(article.heroImage),
  mainEntityOfPage: buildCanonicalUrl(`/article/${article.slug}/`),
  publisher: {
    '@type': 'Organization',
    name: '株式会社Vecta',
    logo: {
      '@type': 'ImageObject',
      url: buildAbsoluteUrl('/favicon.svg'),
    },
  },
})

export const buildSitemapXml = () => {
  const urls: SitemapUrl[] = [
    { loc: buildCanonicalUrl('/'), priority: '1.0' },
    { loc: buildCanonicalUrl('/article/'), priority: '0.8' },
    ...articles.map((article) => ({
      loc: buildCanonicalUrl(`/article/${article.slug}/`),
      lastmod: formatDateJst(article.updatedAt ?? article.publishedAt),
      priority: '0.7',
    })),
  ]

  const body = urls
    .map((url) =>
      [
        '  <url>',
        `    <loc>${url.loc}</loc>`,
        url.lastmod ? `    <lastmod>${url.lastmod}</lastmod>` : undefined,
        `    <priority>${url.priority}</priority>`,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n'),
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
}
