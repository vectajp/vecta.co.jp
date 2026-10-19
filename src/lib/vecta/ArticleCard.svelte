<script lang="ts">
  import type { ArticleMeta } from '$lib/articles/types'

  type Props = {
    article: ArticleMeta
  }

  let { article }: Props = $props()

  const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
</script>

<article class="article-card card">
  <a href={`/article/${article.slug}/`}>
    <img
      class:preserve-frame={article.slug === 'miyakonojo-ai-window-nhk'}
      src={article.heroImage}
      alt=""
      width="360"
      height="180"
      loading="eager"
      decoding="async"
    >
    <div class="article-card-body">
      <div class="article-card-meta">
        <time datetime={article.publishedAt.toISOString()}>
          {dateFormatter.format(article.publishedAt)}
        </time>
        <span class="news-label">{article.category}</span>
      </div>
      <h2>{article.title}</h2>
      <p>{article.description}</p>
    </div>
  </a>
</article>

<style>
  .article-card {
    height: 100%;
    overflow: hidden;
    transition:
      border-color 0.2s ease,
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  .article-card:hover {
    border-color: rgba(47, 111, 237, 0.35);
    transform: translateY(-4px);
    box-shadow: var(--shadow-soft);
  }

  .article-card a {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: inherit;
  }

  .article-card img {
    display: block;
    width: 100%;
    height: 190px;
    object-fit: cover;
    background: var(--color-mist);
  }

  .article-card-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 1.2rem;
  }

  .article-card img.preserve-frame {
    object-fit: contain;
  }

  .article-card h2 {
    color: var(--color-indigo);
    font-size: 1.05rem;
    line-height: 1.45;
    margin-bottom: 0.45rem;
  }

  .article-card time {
    display: block;
    color: var(--color-vector-blue);
    font-size: 0.78rem;
  }

  .article-card-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
    margin-bottom: 0.9rem;
  }

  .article-card p {
    color: var(--color-medium-text);
    font-size: 0.95rem;
    line-height: 1.7;
    margin: 0;
  }
</style>
