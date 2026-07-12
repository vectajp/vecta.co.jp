import type { ArticleMeta } from './types'

const byNewest = (a: ArticleMeta, b: ArticleMeta) =>
  b.publishedAt.getTime() - a.publishedAt.getTime()

export const articles: ArticleMeta[] = [
  {
    slug: 'about-gdrant',
    title: 'What is Qdrant?',
    description:
      'Qdrant（クワッドラント）は、オープンソースのベクトル検索エンジン兼ベクトルデータベースです。高次元ベクトルデータを効率的に保存・検索するための専用システムとして、AI技術を活用したアプリケーション開発に最適化されています。',
    publishedAt: new Date('2025-05-27T00:00:00+09:00'),
    heroImage: '/article/about-gdrant.png',
    component: () => import('./posts/AboutGdrant.svelte'),
  },
  {
    slug: 'vecta-launch-story',
    title: '株式会社Vecta、始動',
    description:
      'ベクトルデータベースとAIの可能性を、もっと身近に。株式会社Vectaの始動と公式ホームページ開設のお知らせ。',
    publishedAt: new Date('2025-04-02T00:00:00+09:00'),
    updatedAt: new Date('2025-05-01T00:00:00+09:00'),
    heroImage: '/article/vecta-launch-story-logo.svg',
    component: () => import('./posts/VectaLaunchStory.svelte'),
  },
].sort(byNewest)

export const articleSlugs = articles.map((article) => article.slug)

export const articleRedirects: Record<string, string> = {
  'homepage-launch': 'vecta-launch-story',
}

export const getArticleBySlug = (slug: string) =>
  articles.find((article) => article.slug === slug)
