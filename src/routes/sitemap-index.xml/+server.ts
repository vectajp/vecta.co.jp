import { buildSitemapXml } from '$lib/vecta/seo'

export const prerender = true

export const GET = () =>
  new Response(buildSitemapXml(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
