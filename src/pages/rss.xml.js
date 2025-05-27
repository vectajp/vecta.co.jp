import { getCollection } from 'astro:content'
import rss from '@astrojs/rss'
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts'

export async function GET(context) {
  const allPosts = await getCollection('article')
  const posts = allPosts
    .filter((post) => post.data.pubDate <= new Date())
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/article/${post.id}/`,
    })),
  })
}
