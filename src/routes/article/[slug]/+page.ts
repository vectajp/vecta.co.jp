import { error, redirect } from '@sveltejs/kit'
import {
  articleRedirects,
  articleSlugs,
  getArticleBySlug,
} from '$lib/articles/registry'

export const entries = () =>
  [...articleSlugs, ...Object.keys(articleRedirects)].map((slug) => ({ slug }))

export const load = ({ params }) => {
  const redirectTarget = articleRedirects[params.slug]
  if (redirectTarget) {
    redirect(308, `/article/${redirectTarget}/`)
  }

  const article = getArticleBySlug(params.slug)
  if (!article) {
    error(404, 'Article not found')
  }

  return {
    article: {
      slug: article.slug,
      title: article.title,
      description: article.description,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
      heroImage: article.heroImage,
    },
  }
}
