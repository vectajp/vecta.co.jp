<script lang="ts">
  import { articles } from '$lib/articles/registry'
  import ArticleCard from '$lib/vecta/ArticleCard.svelte'
  import { site } from '$lib/vecta/content'
  import Footer from '$lib/vecta/Footer.svelte'
  import Header from '$lib/vecta/Header.svelte'
  import {
    buildBreadcrumbJsonLd,
    buildOrganizationJsonLd,
    buildPageSeo,
    buildWebsiteJsonLd,
  } from '$lib/vecta/seo'

  const seo = buildPageSeo({
    title: 'ニュース',
    description: '株式会社Vectaのニュース一覧です。',
    path: '/article/',
  })
  const jsonLd = [
    buildWebsiteJsonLd(),
    buildOrganizationJsonLd(),
    buildBreadcrumbJsonLd([
      { name: 'ホーム', path: '/' },
      { name: 'ニュース', path: '/article/' },
    ]),
  ]
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

<Header />

<main>
  <section class="article-index">
    <div class="container">
      <div class="page-heading">
        <p>News</p>
        <h1>ニュース</h1>
      </div>

      <div class="article-grid">
        {#each articles as article (article.slug)}
          <ArticleCard {article} />
        {/each}
      </div>
    </div>
  </section>
</main>

<Footer />

<style>
  .article-index {
    background:
      linear-gradient(rgba(9, 27, 51, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(9, 27, 51, 0.035) 1px, transparent 1px),
      linear-gradient(180deg, var(--color-paper) 0%, var(--color-white) 100%);
    background-size:
      42px 42px,
      42px 42px,
      auto;
  }

  .page-heading {
    margin: 0 0 3rem;
    max-width: 760px;
  }

  .page-heading p {
    color: var(--color-vector-blue);
    font-family: var(--font-monospace);
    font-size: 0.82rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }

  .page-heading h1 {
    color: var(--color-indigo);
    font-size: 2.35rem;
    line-height: 1.15;
  }

  .article-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    max-width: 1100px;
    margin: 0;
  }

  @media (min-width: 769px) {
    .page-heading h1 {
      font-size: 3.15rem;
    }

    .article-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
