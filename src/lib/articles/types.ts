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
  component: ArticleComponentLoader
}
