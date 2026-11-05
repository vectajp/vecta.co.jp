<script lang="ts">
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import {
    heroCopy,
    jsonLd,
    news,
    pageDescription,
    pageTitle,
    products,
    site,
    siteName,
    siteOgImage,
  } from "$lib/swarrow/content";
  import { vectaHref } from "$lib/swarrow/links";

  const productImages = {
    chat: {
      src: "/swarrow-chat/sample-chat-wide.webp",
      alt: "SwarrowChatで回答と参照元を確認する画面",
      width: 980,
      height: 760,
    },
    call: {
      src: "/swarrow-call/phone-service.webp",
      alt: "住民からの電話にAIが応答するSwarrowCallのイラスト",
      width: 1586,
      height: 992,
    },
  };

  const contactHref = `${vectaHref("https://www.vecta.co.jp/")}#contact`;
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription}>
  <meta name="theme-color" content="#ffffff">
  <link rel="canonical" href={`${site}/`}>
  <meta name="robots" content="index,follow">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content={siteName}>
  <meta property="og:locale" content="ja_JP">
  <meta property="og:title" content={pageTitle}>
  <meta property="og:description" content={pageDescription}>
  <meta property="og:url" content={`${site}/`}>
  <meta property="og:image" content={`${site}${siteOgImage.path}`}>
  <meta property="og:image:width" content={String(siteOgImage.width)}>
  <meta property="og:image:height" content={String(siteOgImage.height)}>

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content={pageTitle}>
  <meta name="twitter:description" content={pageDescription}>
  <meta name="twitter:image" content={`${site}${siteOgImage.path}`}>

  {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>

<main id="top">
  <section
    id="products"
    class="container products"
    aria-labelledby="products-title"
  >
    <h1 id="products-title">{heroCopy.title}</h1>
    <div class="products-grid">
      {#each products as product (product.id)}
        {@const image = productImages[product.id]}
        <a
          class="product-card"
          href={product.href}
          aria-labelledby={`product-${product.id}`}
        >
          <div class="product-heading">
            <img src={product.icon} alt="" width="120" height="120">
            <div>
              <h2 id={`product-${product.id}`}>{product.name}</h2>
              <p>{product.category}</p>
            </div>
          </div>
          <div class="product-media" class:chat-preview={product.id === "chat"}>
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              decoding="async"
            >
          </div>
          <span class="text-link"
            >詳しく見る <ArrowRight size={20} aria-hidden="true" /></span
          >
        </a>
      {/each}
    </div>
  </section>

  <section id="news" class="news" aria-labelledby="news-title">
    <div class="container">
      <div class="section-heading">
        <h2 id="news-title">ニュース</h2>
        <a
          class="text-link"
          href={vectaHref("https://www.vecta.co.jp/article/")}
        >
          ニュース一覧 <ArrowRight size={20} aria-hidden="true" />
        </a>
      </div>
      <ul>
        {#each news.slice(0, 3) as item (item.href)}
          <li>
            <a href={vectaHref(item.href)}>
              <time datetime={item.date.replaceAll(".", "-")}>{item.date}</time>
              <span class="news-category">{item.category}</span>
              <span class="news-title">{item.text}</span>
              <ArrowRight size={20} aria-hidden="true" />
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </section>

  <section
    id="contact"
    class="container contact"
    aria-labelledby="contact-title"
  >
    <div class="section-heading">
      <h2 id="contact-title">お問い合わせ</h2>
      <a class="text-link" href={contactHref}>
        フォームを開く <ArrowRight size={20} aria-hidden="true" />
      </a>
    </div>
  </section>
</main>

<style>
  main {
    background: var(--sc-bg-card);
    color: var(--sc-navy);
  }
  #top,
  section[id] {
    scroll-margin-top: 6rem;
  }
  .container {
    width: min(calc(100% - 3rem), 1160px);
    margin-inline: auto;
  }
  .products {
    padding-block: clamp(2.25rem, 5vw, 4rem) clamp(3rem, 6vw, 5rem);
  }
  h1 {
    margin: 0 0 clamp(1.75rem, 4vw, 3rem);
    font-size: clamp(1.7rem, 3.4vw, 2.7rem);
    line-height: 1.4;
    letter-spacing: -0.035em;
    text-align: center;
    text-wrap: balance;
  }
  h2 {
    margin: 0;
    font-size: clamp(1.4rem, 2.8vw, 2rem);
    line-height: 1.35;
    letter-spacing: -0.03em;
  }
  .products-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: clamp(1.75rem, 4vw, 3rem);
  }
  .product-card {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 3;
    gap: 1rem;
    min-width: 0;
  }
  .product-heading {
    display: flex;
    align-items: center;
    gap: 0.9rem;
  }
  .product-heading img {
    width: clamp(3rem, 5vw, 4rem);
    height: auto;
    flex: 0 0 auto;
  }
  .product-heading h2 {
    font-size: clamp(1.65rem, 3vw, 2.3rem);
  }
  .product-heading p {
    margin: 0.2rem 0 0;
    color: var(--sc-text-secondary);
    line-height: 1.6;
    font-weight: 600;
  }
  .product-media {
    display: grid;
    place-items: center;
    aspect-ratio: 8 / 5;
    background: var(--sc-bg-light);
    border-radius: 12px;
    overflow: hidden;
  }
  .product-media img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .chat-preview {
    box-sizing: border-box;
    padding: clamp(0.75rem, 1.5vw, 1.25rem);
  }
  .chat-preview img {
    width: auto;
    max-width: 100%;
    min-height: 0;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 6px 22px var(--sc-shadow);
  }
  main .text-link {
    display: inline-flex;
    align-items: center;
    justify-self: start;
    gap: 0.55rem;
    color: var(--sc-blue);
    font-weight: 700;
  }
  .text-link:hover,
  .product-card:hover .text-link,
  :where(.news li a:hover) .news-title {
    text-decoration: underline;
    text-underline-offset: 0.25em;
  }
  .news {
    background: var(--sc-bg-light);
    padding-block: clamp(2.5rem, 5vw, 4rem);
  }
  .section-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem 1.25rem;
  }
  .news ul {
    list-style: none;
    padding: 0;
    margin: 1.25rem 0 0;
    border-top: 1px solid var(--sc-border);
  }
  .news li {
    border-bottom: 1px solid var(--sc-border);
  }
  .news li a {
    display: grid;
    grid-template-columns: 6rem 9rem minmax(0, 1fr) auto;
    align-items: center;
    gap: 1rem;
    padding-block: 1.1rem;
  }
  .news time,
  .news-category {
    font-size: 0.875rem;
    color: var(--sc-text-secondary);
  }
  .news-category {
    justify-self: start;
    white-space: nowrap;
    border: 1px solid var(--sc-border);
    border-radius: 4px;
    background: var(--sc-bg-card);
    padding-inline: 0.5rem;
  }
  .news-title {
    font-weight: 600;
    line-height: 1.65;
  }
  .contact {
    padding-block: clamp(2.5rem, 5vw, 4rem);
  }

  @media (max-width: 720px) {
    .container {
      width: min(calc(100% - 2rem), 520px);
    }
    .products-grid {
      grid-template-columns: minmax(0, 1fr);
      row-gap: 2rem;
    }
    .product-card {
      grid-template-rows: auto;
      grid-row: auto;
      gap: 0.75rem;
    }
    .product-heading p {
      font-size: 0.875rem;
    }
    .news li a {
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 0.45rem 0.75rem;
    }
    .news-title {
      grid-column: 1 / 3;
    }
    .news li a :global(svg) {
      grid-column: 3;
      grid-row: 2;
    }
  }
</style>
