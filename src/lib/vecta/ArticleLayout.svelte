<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { ArticleMeta } from '$lib/articles/types'
  import Footer from '$lib/vecta/Footer.svelte'
  import Header from '$lib/vecta/Header.svelte'

  type ArticlePageMeta = Omit<ArticleMeta, 'component'>

  type Props = {
    article: ArticlePageMeta
    children: Snippet
  }

  let { article, children }: Props = $props()

  const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
</script>

<Header />

<main>
  <article class="article-page">
    <header class="article-hero">
      <div class="container">
        <a class="back-link" href="/article/">ニュース一覧へ</a>
        <div class="article-hero-stack">
          <div class="article-heading">
            <div class="article-meta">
              <time datetime={article.publishedAt.toISOString()}>
                {dateFormatter.format(article.publishedAt)}
              </time>
              <span class="news-label">{article.category}</span>
            </div>
            <h1>{article.title}</h1>
          </div>
          <img
            src={article.heroImage}
            alt={article.heroImageAlt ?? ''}
            width={article.heroImageWidth ?? 1200}
            height={article.heroImageHeight ?? 630}
            loading="eager"
            decoding="async"
          >
        </div>
      </div>
    </header>

    <div class="container">
      <div class="article-content">
        {@render children()}
      </div>
    </div>
  </article>
</main>

<Footer />

<style>
  .article-page {
    background: var(--color-white);
  }

  .article-hero {
    padding: 40px 0 0;
  }

  .article-hero > .container {
    max-width: 900px;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    min-height: 32px;
    color: var(--color-medium-text);
    font-size: 14px;
    margin-bottom: 32px;
  }

  .back-link:hover,
  .back-link:focus-visible {
    color: var(--color-gold);
  }

  .article-hero-stack {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .article-heading {
    width: 100%;
  }

  .article-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px 20px;
    margin-bottom: 20px;
    color: var(--color-medium-text);
    font-size: 14px;
  }

  .article-heading h1 {
    color: var(--color-indigo);
    font-size: clamp(28px, 3vw, 38px);
    line-height: 1.55;
    margin: 0;
    overflow-wrap: anywhere;
  }

  .article-hero img {
    display: block;
    width: 100%;
    height: auto;
  }

  .article-content {
    max-width: 860px;
    margin: 0 auto;
    padding: 32px 0 80px;
  }

  .article-content :global(.article-body) {
    color: var(--color-sumi);
    font-size: 1rem;
    line-height: 1.9;
  }

  .article-content :global(.article-body h2) {
    color: var(--color-indigo);
    font-size: 1.55rem;
    margin: 2.5rem 0 1rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--color-line);
  }

  .article-content :global(.article-body h3) {
    color: var(--color-indigo);
    font-size: 1.3rem;
    margin: 2rem 0 0.75rem;
  }

  .article-content :global(.article-body p),
  .article-content :global(.article-body ul),
  .article-content :global(.article-body ol) {
    margin-bottom: 1.4rem;
  }

  .article-content :global(.article-body ul),
  .article-content :global(.article-body ol) {
    padding-left: 1.4rem;
  }

  .article-content :global(.article-body li) {
    margin-bottom: 0.65rem;
  }

  .article-content :global(.article-body a) {
    color: var(--color-vector-blue);
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 0.18em;
  }

  @media (min-width: 769px) {
    .article-hero {
      padding-top: 48px;
    }

    .article-content :global(.article-body) {
      font-size: 1.05rem;
    }
  }
</style>
