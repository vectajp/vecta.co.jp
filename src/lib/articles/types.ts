import type { Component } from 'svelte'

export type ArticleComponentLoader = () => Promise<{
  default: Component
}>

export type ArticleMeta = {
  slug: string
  title: string
  description: string
  publishedAt: Date
  updatedAt?: Date
  heroImage: string
  /** YouTube 動画由来の記事で重複生成防止の照合キーに使う動画 ID */
  videoId?: string
  component: ArticleComponentLoader
}
