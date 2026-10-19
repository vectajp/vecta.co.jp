<script lang="ts">
  import { newsCategories } from '@vecta/site-content/news'
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
  const categories = newsCategories.filter((category) =>
    articles.some((article) => article.category === category),
  )
  const yearOf = (date: Date) =>
    new Intl.DateTimeFormat('en', {
      year: 'numeric',
      timeZone: 'Asia/Tokyo',
    }).format(date)
  const years = [
    ...new Set(articles.map((article) => yearOf(article.publishedAt))),
  ]
  let selectedCategory = $state('すべて')
  let selectedYear = $state('すべて')
  const filteredArticles = $derived(
    articles.filter(
      (article) =>
        (selectedCategory === 'すべて' ||
          article.category === selectedCategory) &&
        (selectedYear === 'すべて' ||
          yearOf(article.publishedAt) === selectedYear),
    ),
  )
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
        <h1>ニュース</h1>
      </div>

      <div class="news-filters">
        <fieldset class="category-filters" aria-label="ニュースのカテゴリ">
          {#each ['すべて', ...categories] as category}
            <button
              type="button"
              class:active={selectedCategory === category}
              aria-pressed={selectedCategory === category}
              onclick={() => selectedCategory = category}
            >
              {category}
            </button>
          {/each}
        </fieldset>
        <label class="year-filter"
          >年
          <select bind:value={selectedYear} aria-label="ニュースの年">
            <option value="すべて">すべて</option>
            {#each years as year}
              <option value={String(year)}>{year}年</option>
            {/each}
          </select>
        </label>
      </div>
      <p class="article-count" aria-live="polite">
        {filteredArticles.length}件
      </p>
      <div class="article-grid">
        {#each filteredArticles as article (article.slug)}
          <ArticleCard {article} />
        {/each}
      </div>
      {#if filteredArticles.length === 0}
        <p>該当するニュースはありません</p>
      {/if}
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

  .page-heading h1 {
    color: var(--color-indigo);
    font-size: 2.35rem;
    line-height: 1.15;
  }

  .news-filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 24px;
  }

  .category-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    border: 0;
    padding: 0;
    margin: 0;
    min-width: 0;
  }

  .category-filters button,
  .year-filter select {
    border: 1px solid var(--color-line-strong);
    border-radius: 4px;
    background: var(--color-white);
    color: var(--color-indigo);
    min-height: 44px;
    padding: 10px 16px;
  }

  .category-filters button {
    cursor: pointer;
  }

  .category-filters button.active {
    background: var(--color-indigo);
    border-color: var(--color-indigo);
    color: var(--color-white);
  }

  .year-filter {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
  }

  .article-count {
    font-size: 14px;
    color: var(--color-medium-text);
    margin-bottom: 20px;
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
