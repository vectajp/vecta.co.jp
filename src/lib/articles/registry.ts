import type { ArticleMeta } from './types'

const byNewest = (a: ArticleMeta, b: ArticleMeta) =>
  b.publishedAt.getTime() - a.publishedAt.getTime()

export const articles: ArticleMeta[] = [
  {
    slug: 'what-is-vector-data',
    title: 'ベクトルデータとは？まちの情報を「意味」で探せるようにする技術',
    description:
      '「あの資料、どこにあったっけ」——キーワードが一致しないと見つからない検索の限界を、「意味の近さ」で越えるのがベクトルデータです。自治体の現場の例を使って、専門用語をできるだけ使わずに解説します。',
    publishedAt: new Date('2026-07-13T00:00:00+09:00'),
    heroImage: '/article/what-is-vector-data.png',
    component: () => import('./posts/WhatIsVectorData.svelte'),
  },
  {
    slug: 'digital-jpn-press-conference-2026-07-10',
    title: 'デジタル庁会見ダイジェスト(2026年7月10日)',
    description:
      '松本大臣が若手国家公務員ワークショップの開催報告と、ガバメントAI「源内」における国産クラウド上での国産基盤モデルの試用開始を発表した2026年7月10日の会見の要約です。',
    publishedAt: new Date('2026-07-10T00:00:00+09:00'),
    heroImage: '/article/digest-press-conference.svg',
    videoId: 'sVduWLXdk7U',
    component: () => import('./posts/DigitalJpnPressConference20260710.svelte'),
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

// 動画由来のダイジェスト記事はホームページのトップ枠には出さず、/article/ 一覧のみに掲載する
export const featuredArticles = articles
  .filter((article) => !article.videoId)
  .slice(0, 3)

export const articleRedirects: Record<string, string> = {
  'homepage-launch': 'vecta-launch-story',
  'about-gdrant': 'what-is-vector-data',
}

export const getArticleBySlug = (slug: string) =>
  articles.find((article) => article.slug === slug)
