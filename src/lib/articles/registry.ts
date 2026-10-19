import { productNews } from '@vecta/site-content/news'
import type { ArticleComponentLoader, ArticleMeta } from './types'

const productArticleComponents: Record<
  (typeof productNews)[number]['slug'],
  ArticleComponentLoader
> = {
  'miyakonojo-ai-window-launch-202610': () =>
    import('./posts/MiyakonojoAiWindowLaunch202610.svelte'),
  'swarrowchat-usage-report-202607': () =>
    import('./posts/SwarrowChatUsageReport202607.svelte'),
  'swarrowchat-question-categories-202610': () =>
    import('./posts/SwarrowChatQuestionCategories202610.svelte'),
  'swarrowchat-widget-layout-202609': () =>
    import('./posts/SwarrowChatWidgetLayout202609.svelte'),
  'swarrowchat-multilingual-guide-202610': () =>
    import('./posts/SwarrowChatMultilingualGuide202610.svelte'),
  'swarrowchat-website-updates-202604': () =>
    import('./posts/SwarrowChatWebsiteUpdates202604.svelte'),
  'swarrowcall-response-latency-202604': () =>
    import('./posts/SwarrowCallResponseLatency202604.svelte'),
  'swarrowcall-phone-transfer-202605': () =>
    import('./posts/SwarrowCallPhoneTransfer202605.svelte'),
  'swarrowchat-voice-navigation-202610': () =>
    import('./posts/SwarrowChatVoiceNavigation202610.svelte'),
  'miyakonojo-digital-gyosei-2026': () =>
    import('./posts/MiyakonojoDigitalGyosei2026.svelte'),
  'miyakonojo-ai-window-nhk': () =>
    import('./posts/MiyakonojoAiWindowNhk.svelte'),
  'miyakonojo-dx-challenge-2026': () =>
    import('./posts/MiyakonojoDxChallenge2026.svelte'),
}

const byNewest = (a: ArticleMeta, b: ArticleMeta) =>
  b.publishedAt.getTime() - a.publishedAt.getTime()

const allArticles: ArticleMeta[] = [
  ...productNews.map(
    (news): ArticleMeta => ({
      slug: news.slug,
      category: news.category,
      title: news.title,
      description: news.description,
      publishedAt: new Date(`${news.date}T00:00:00+09:00`),
      heroImage: news.image,
      heroImageAlt: news.imageAlt,
      heroImageWidth: news.imageWidth,
      heroImageHeight: news.imageHeight,
      component: productArticleComponents[news.slug],
    }),
  ),
  {
    slug: 'what-is-vector-data',
    category: 'コラム',
    title: 'ベクトルデータとは？まちの情報を「意味」で探せるようにする技術',
    description:
      '「あの資料、どこにあったっけ」——キーワードが一致しないと見つからない検索の限界を、「意味の近さ」で越えるのがベクトルデータです。自治体の現場の例を使って、専門用語をできるだけ使わずに解説します。',
    publishedAt: new Date('2026-07-13T00:00:00+09:00'),
    heroImage: '/article/what-is-vector-data.png',
    component: () => import('./posts/WhatIsVectorData.svelte'),
  },
  {
    slug: 'digital-jpn-press-conference-2026-07-10',
    category: 'コラム',
    title:
      '純国産AIは行政の信頼を築けるか——ガバメントAI「源内」考察(2026年7月10日)',
    description:
      'ガバメントAI「源内」で国産クラウド×国産AIの試用が始まった2026年7月10日の会見を要約し、行政AIの信頼構築という観点からVectaの考察を添えました。',
    publishedAt: new Date('2026-07-10T00:00:00+09:00'),
    heroImage: '/article/digital-jpn-press-conference-2026-07-10.png',
    videoId: 'sVduWLXdk7U',
    component: () => import('./posts/DigitalJpnPressConference20260710.svelte'),
  },
  {
    slug: 'gov-cybersecurity-guideline-2026-revision',
    category: 'コラム',
    title:
      'パッチのためにシステムを止める決断は妥当か——政府機関等対策基準ガイドライン改定を深掘りする',
    description:
      '政府機関等の対策基準策定のためのガイドライン改定を一次資料から深掘りリサーチし、AI時代のパッチ運用とシステム停止判断についてVectaの考察を添えました。',
    publishedAt: new Date('2026-07-13T00:00:00+09:00'),
    heroImage: '/article/research-article.svg',
    component: () =>
      import('./posts/GovCybersecurityGuideline2026Revision.svelte'),
  },
  {
    slug: 'digital-jpn-press-conference-2026-06-12',
    category: 'コラム',
    title:
      '生成AIの利活用促進とガバナンス強化は両立できるか——ガイドライン改定考察(2026年6月12日)',
    description:
      '生成AIの適用対象を音声・画像・AIエージェントへ拡大した調達・利活用ガイドライン改定を要約し、ガバナンス設計の観点からVectaの考察を添えました。',
    publishedAt: new Date('2026-06-12T00:00:00+09:00'),
    heroImage: '/article/digital-jpn-press-conference-2026-06-12.png',
    videoId: '5dMcm0BOQrI',
    component: () => import('./posts/DigitalJpnPressConference20260612.svelte'),
  },
  {
    slug: 'vecta-launch-story',
    category: 'お知らせ',
    title: '株式会社Vecta、始動',
    description:
      'ベクトルデータベースとAIの可能性を、もっと身近に。株式会社Vectaの始動と公式ホームページ開設のお知らせ。',
    publishedAt: new Date('2025-04-02T00:00:00+09:00'),
    updatedAt: new Date('2025-05-01T00:00:00+09:00'),
    heroImage: '/article/vecta-launch-story-logo.svg',
    component: () => import('./posts/VectaLaunchStory.svelte'),
  },
]

export const articles = allArticles.sort(byNewest)

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
