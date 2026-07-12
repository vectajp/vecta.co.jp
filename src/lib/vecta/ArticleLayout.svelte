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
        <div class="article-hero-grid">
          <div class="article-heading">
            <time datetime={article.publishedAt.toISOString()}>
              {dateFormatter.format(article.publishedAt)}
            </time>
            <h1>{article.title}</h1>
            <p>{article.description}</p>
          </div>
          <img
            src={article.heroImage}
            alt=""
            width="720"
            height="360"
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
    background:
      linear-gradient(rgba(9, 27, 51, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(9, 27, 51, 0.035) 1px, transparent 1px),
      linear-gradient(180deg, var(--color-paper) 0%, var(--color-white) 100%);
    background-size:
      42px 42px,
      42px 42px,
      auto;
    padding: 3rem 0;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    min-height: 2.25rem;
    padding: 0.35rem 0.75rem;
    border: 1px solid var(--color-line);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.72);
    color: var(--color-indigo);
    font-size: 0.92rem;
    font-weight: 700;
    margin-bottom: 2rem;
  }

  .back-link:hover,
  .back-link:focus-visible {
    color: var(--color-gold);
  }

  .article-hero-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    align-items: center;
  }

  .article-heading {
    max-width: 780px;
  }

  .article-heading time {
    display: block;
    color: var(--color-vector-blue);
    font-family: var(--font-monospace);
    font-size: 0.82rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }

  .article-heading h1 {
    color: var(--color-indigo);
    font-size: 2.15rem;
    line-height: 1.35;
    margin-bottom: 1rem;
  }

  .article-heading p {
    color: var(--color-medium-text);
    line-height: 1.8;
  }

  .article-hero img {
    width: 100%;
    height: auto;
    aspect-ratio: 2 / 1;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid var(--color-line);
    box-shadow: var(--shadow-soft);
  }

  .article-content {
    max-width: 820px;
    margin: 0 auto;
    padding: 3rem 0 5rem;
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
      padding: 4rem 0;
    }

    .article-hero-grid {
      grid-template-columns: minmax(0, 1fr) minmax(320px, 0.72fr);
      gap: 3rem;
    }

    .article-heading h1 {
      font-size: 3rem;
    }

    .article-content {
      padding: 4rem 0 6rem;
    }

    .article-content :global(.article-body) {
      font-size: 1.05rem;
    }
  }
</style>
