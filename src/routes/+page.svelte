<script lang="ts">
  import { featuredArticles } from '$lib/articles/registry'
  import ContactForm from '$lib/vecta/ContactForm.svelte'
  import { conceptParagraphs, site } from '$lib/vecta/content'
  import Footer from '$lib/vecta/Footer.svelte'
  import Header from '$lib/vecta/Header.svelte'
  import { siteHref } from '$lib/vecta/links'
  import {
    buildBreadcrumbJsonLd,
    buildOrganizationJsonLd,
    buildPageSeo,
    buildWebsiteJsonLd,
  } from '$lib/vecta/seo'

  const seo = buildPageSeo()
  const jsonLd = [
    buildWebsiteJsonLd(),
    buildOrganizationJsonLd(),
    buildBreadcrumbJsonLd([{ name: 'ホーム', path: '/' }]),
  ]
  const latest = featuredArticles[0]
  const dateLabel = (date: Date) =>
    new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .format(date)
      .replaceAll('/', '.')
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
{#snippet arrow()}
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <path d="M4 12h15m-6-6 6 6-6 6" />
  </svg>
{/snippet}
<Header />
<main>
  <section class="hero-section" aria-labelledby="hero-title">
    <img
      class="hero-image"
      src="/assets/vecta-city-2026.webp"
      alt=""
      width="2400"
      height="1000"
      fetchpriority="high"
    >
    <div class="container hero-content">
      <p class="hero-company">株式会社Vecta</p>
      <h1 id="hero-title">
        <span>地域の知識を</span><span>誰もが使える社会へ</span>
      </h1>
    </div>
  </section>
  {#if latest}
    <div class="container latest">
      <a href="/article/{latest.slug}/" class="news-strip">
        <time datetime={latest.publishedAt.toISOString()}
          >{dateLabel(latest.publishedAt)}</time
        >
        <span class="news-label">{latest.category ?? 'お知らせ'}</span>
        <span class="news-strip-title">{latest.title}</span>
        {@render arrow()}
      </a>
    </div>
  {/if}
  <section
    id="projects"
    class="services container"
    aria-labelledby="services-title"
  >
    <div class="services-intro">
      <h2 id="services-title">自治体の問い合わせ対応を支えるサービス</h2>
    </div>
    <div class="services-grid">
      <article class="service">
        <div class="service-heading">
          <img src="/assets/swarrow-icon.png" alt="" width="120" height="120">
          <div>
            <h3>SwarrowChat</h3>
            <p>自治体ホームページ AIチャットボット</p>
          </div>
        </div>
        <figure class="service-media chat-media">
          <a
            href={siteHref('https://swarrow.com/chat')}
            aria-label="SwarrowChatの詳細を見る"
            ><img
              src="/assets/swarrowchat-wide.webp"
              alt="SwarrowChatで回答と参照資料を確認する画面"
              width="980"
              height="760"
              loading="lazy"
            ></a
          >
        </figure>
        <p class="service-description">
          公式情報をもとに質問に答え、手続きへ案内
        </p>
        <a class="text-link" href={siteHref('https://swarrow.com/chat')}
          >詳しく見る {@render arrow()}</a
        >
      </article>
      <article class="service">
        <div class="service-heading">
          <img src="/assets/swarrow-icon.png" alt="" width="120" height="120">
          <div>
            <h3>SwarrowCall</h3>
            <p>電話のAI窓口</p>
          </div>
        </div>
        <figure class="service-media call-media">
          <a
            href={siteHref('https://swarrow.com/call')}
            aria-label="SwarrowCallの詳細を見る"
            ><img
              src="/assets/swarrowcall-service.webp"
              alt="利用者からの電話にAIが応答し、必要な情報や担当先へ案内するSwarrowCall"
              width="1586"
              height="992"
              loading="lazy"
            ></a
          >
        </figure>
        <p class="service-description">電話の一次受付や担当課への案内を支援</p>
        <a class="text-link" href={siteHref('https://swarrow.com/call')}
          >詳しく見る {@render arrow()}</a
        >
      </article>
    </div>
  </section>
  <section id="concept" class="about-section" aria-labelledby="about-title">
    <img
      src="/assets/vecta-river-2026.webp"
      alt=""
      width="1800"
      height="700"
      loading="lazy"
    >
    <div class="container">
      <div class="about-copy">
        <h2 id="about-title">Vectaについて</h2>
        {#each conceptParagraphs as paragraph}
          <p>{paragraph}</p>
        {/each}
        <a id="company" class="text-link" href="/company/"
          >会社情報を見る {@render arrow()}</a
        >
      </div>
    </div>
  </section>
  <section
    id="articles"
    class="news-section container"
    aria-labelledby="news-title"
  >
    <div class="section-top">
      <h2 id="news-title">ニュース</h2>
      <a class="text-link" href="/article/">一覧を見る {@render arrow()}</a>
    </div>
    <ul class="article-list">
      {#each featuredArticles as article (article.slug)}
        <li>
          <a href="/article/{article.slug}/"
            ><time datetime={article.publishedAt.toISOString()}
              >{dateLabel(article.publishedAt)}</time
            ><span class="news-label">{article.category}</span
            ><span class="article-title">{article.title}</span>
            {@render arrow()}</a
          >
        </li>
      {/each}
    </ul>
  </section>
  <section
    id="contact"
    class="contact-section container"
    aria-labelledby="contact-title"
  >
    <div class="contact-copy">
      <h2 id="contact-title">お問い合わせ</h2>
    </div>
    <div class="contact-form"><ContactForm /></div>
  </section>
</main>
<Footer />
<style>
  main {
    color: var(--color-indigo);
  }
  section[id] {
    scroll-margin-top: 100px;
  }
  .hero-section {
    position: relative;
    min-height: clamp(470px, 47vw, 650px);
    padding: 0;
    isolation: isolate;
  }
  .hero-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }
  .hero-content {
    padding-top: clamp(42px, 5vw, 76px);
  }
  .hero-company {
    margin-bottom: 18px;
    font-size: 20px;
    font-weight: 600;
  }
  h1 {
    max-width: 10.3em;
    font-size: clamp(38px, 4.5vw, 64px);
    line-height: 1.32;
    letter-spacing: -0.035em;
    font-weight: 800;
    margin-bottom: 20px;
  }
  h1 span {
    display: inline-block;
  }
  .latest {
    padding-top: 24px;
  }
  .news-strip {
    display: flex;
    align-items: center;
    gap: 24px;
    background: var(--color-mist);
    padding: 20px 28px;
    color: var(--color-indigo);
  }
  .news-strip time {
    white-space: nowrap;
    font-size: 14px;
  }
  .news-label {
    background: var(--color-vector-blue-soft);
    font-size: 13px;
    padding: 4px 12px;
    white-space: nowrap;
    font-weight: 700;
  }
  .news-strip-title {
    flex: 1;
    font-size: 15px;
  }
  .news-strip svg {
    flex-shrink: 0;
  }
  .services {
    padding-top: 70px;
    padding-bottom: 72px;
  }
  .services-intro {
    text-align: center;
    margin-bottom: 44px;
  }
  h2 {
    font-size: clamp(26px, 3vw, 38px);
    line-height: 1.5;
    letter-spacing: -0.025em;
  }
  .services-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 48px;
  }
  .service {
    min-width: 0;
  }
  .service-heading {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 24px;
  }
  .service-heading > img {
    width: 64px;
    height: 64px;
  }
  .service-heading h3 {
    font-size: clamp(25px, 3.15vw, 40px);
    letter-spacing: -0.035em;
    margin: 0 0 4px;
    line-height: 1.25;
  }
  .service-heading p {
    margin: 0;
    font-size: 17px;
  }
  .service-media {
    margin: 0 0 22px;
  }
  .service-media a {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 8 / 5;
    background: var(--color-mist);
    border-radius: 12px;
    overflow: hidden;
  }
  .service-media img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .chat-media a {
    padding: 22px 32px;
    background: var(--color-service-sky);
  }
  .chat-media img {
    width: auto;
    height: 100%;
    object-fit: contain;
    object-position: top center;
    border-radius: 10px;
    box-shadow: var(--shadow-card);
  }
  .service-description {
    font-size: 17px;
    margin-bottom: 12px;
  }
  .text-link {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: var(--color-vector-blue);
    font-weight: 700;
  }
  .text-link:hover {
    text-decoration: underline;
    text-underline-offset: 5px;
  }
  .about-section {
    position: relative;
    min-height: 390px;
    display: flex;
    align-items: center;
    isolation: isolate;
    padding: 48px 0;
    background: var(--color-mist);
    overflow: hidden;
  }
  .about-section > img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }
  .about-copy {
    max-width: 470px;
  }
  .about-copy p {
    line-height: 1.9;
    margin-bottom: 14px;
  }
  .about-copy .text-link {
    margin-top: 14px;
  }
  .news-section {
    padding-top: 72px;
    padding-bottom: 72px;
  }
  .section-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 24px;
  }
  .section-top h2 {
    margin: 0;
  }
  .article-list {
    list-style: none;
    padding: 0;
    margin: 0;
    border-top: 1px solid var(--color-line);
  }
  .article-list li {
    border-bottom: 1px solid var(--color-line);
  }
  .article-list a {
    display: grid;
    grid-template-columns: 110px 120px 1fr 24px;
    align-items: center;
    gap: 24px;
    padding: 25px 0;
  }
  .article-list time {
    font-size: 14px;
    color: var(--color-medium-text);
  }
  .contact-section {
    display: grid;
    grid-template-columns: 0.7fr 1.3fr;
    gap: 64px;
    padding-top: 72px;
    padding-bottom: 80px;
  }
  @media (min-width: 801px) and (max-width: 1000px) {
    .service-heading {
      min-height: 100px;
    }
  }
  @media (max-width: 800px) {
    .hero-section {
      min-height: 500px;
    }
    .hero-content {
      padding-top: 36px;
    }
    .hero-image {
      object-position: 58% center;
    }
    h1 {
      max-width: 10em;
      font-size: clamp(34px, 5.6vw, 46px);
    }
    .hero-company {
      font-size: 16px;
    }

    .news-strip {
      flex-wrap: wrap;
      gap: 10px 16px;
      padding: 18px;
    }
    .news-strip-title {
      flex: 1 1 calc(100% - 40px);
      font-size: 14px;
    }
    .services {
      padding-top: 48px;
      padding-bottom: 48px;
    }
    .services-intro {
      text-align: left;
      margin-bottom: 32px;
    }
    .services-grid {
      grid-template-columns: 1fr;
      gap: 36px;
    }
    .service {
      padding: 0;
    }
    .service + .service {
      border-left: 0;
      border-top: 1px solid var(--color-line);
      padding: 36px 0 0;
    }
    .service-heading h3 {
      font-size: clamp(28px, 7vw, 38px);
    }
    .service-heading p {
      font-size: 15px;
    }
    .service-heading > img {
      width: 52px;
      height: 52px;
    }
    .service-heading {
      gap: 14px;
    }
    .chat-media a {
      padding: 16px 20px;
    }
    .about-section {
      padding: 36px 0 210px;
    }
    .about-section > img {
      object-position: 65% bottom;
    }
    .about-copy {
      padding: 20px;
      background: var(--color-white);
    }
    .news-section {
      padding-top: 48px;
      padding-bottom: 48px;
    }
    .article-list a {
      grid-template-columns: 1fr 1fr 24px;
      gap: 8px 16px;
      padding: 20px 0;
    }
    .article-list time {
      grid-column: 1;
    }
    .article-list .article-title {
      grid-column: 1 / 3;
    }
    .article-list :global(svg) {
      grid-column: 3;
      grid-row: 2;
    }
    .contact-section {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    .contact-section {
      padding-top: 48px;
      padding-bottom: 48px;
    }
  }
</style>
