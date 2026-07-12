<script lang="ts">
  import type { ArticleMeta } from '$lib/articles/types'

  type Props = {
    article: ArticleMeta
  }

  let { article }: Props = $props()

  const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
</script>

<article class="article-card">
  <a href={`/article/${article.slug}/`}>
    <img
      src={article.heroImage}
      alt=""
      width="360"
      height="180"
      loading="eager"
      decoding="async"
    >
    <div class="article-card-body">
      <h3>{article.title}</h3>
      <time datetime={article.publishedAt.toISOString()}>
        {dateFormatter.format(article.publishedAt)}
      </time>
      <p>{article.description}</p>
    </div>
  </a>
</article>

<style>
  .article-card {
    height: 100%;
    overflow: hidden;
    background-color: var(--color-white);
    border: 1px solid var(--color-line);
    border-radius: 8px;
    box-shadow: 0 14px 36px rgba(9, 27, 51, 0.07);
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

  .article-card h3 {
    color: var(--color-indigo);
    font-size: 1.05rem;
    line-height: 1.45;
    margin-bottom: 0.45rem;
  }

  .article-card time {
    display: block;
    order: -1;
    color: var(--color-vector-blue);
    font-family: var(--font-monospace);
    font-size: 0.78rem;
    margin-bottom: 0.7rem;
  }

  .article-card p {
    color: var(--color-medium-text);
    font-size: 0.95rem;
    line-height: 1.7;
    margin: 0;
  }
</style>
