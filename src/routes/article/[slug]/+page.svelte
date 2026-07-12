<script lang="ts">
  import ArticleLayout from '$lib/vecta/ArticleLayout.svelte'
  import { site } from '$lib/vecta/content'
  import {
    buildArticleJsonLd,
    buildBreadcrumbJsonLd,
    buildOrganizationJsonLd,
    buildPageSeo,
  } from '$lib/vecta/seo'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()

  const ArticleComponent = $derived(data.content)
  const seo = $derived(
    buildPageSeo({
      title: data.article.title,
      description: data.article.description,
      path: `/article/${data.article.slug}/`,
      type: 'article',
      imagePath: data.article.heroImage,
    }),
  )
  const jsonLd = $derived([
    buildOrganizationJsonLd(),
    buildBreadcrumbJsonLd([
      { name: 'ホーム', path: '/' },
      { name: 'ニュース', path: '/article/' },
      {
        name: data.article.title,
        path: `/article/${data.article.slug}/`,
      },
    ]),
    buildArticleJsonLd(data.article),
  ])
</script>

<svelte:head>
  <title>{seo.title}</title>
  <meta name="description" content={seo.description}>
  <meta name="keywords" content={site.keywords}>
  <link rel="canonical" href={seo.canonical}>
  <meta name="robots" content="index,follow">
  <meta property="og:type" content={seo.type}>
  <meta property="og:site_name" content={site.title}>
  <meta property="og:title" content={seo.title}>
  <meta property="og:description" content={seo.description}>
  <meta property="og:url" content={seo.canonical}>
  <meta property="og:image" content={seo.image}>
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="ja_JP">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content={seo.title}>
  <meta name="twitter:description" content={seo.description}>
  <meta name="twitter:image" content={seo.image}>
  {#each jsonLd as schema}
    {@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
  {/each}
</svelte:head>

<ArticleLayout article={data.article}>
  <ArticleComponent />
</ArticleLayout>
