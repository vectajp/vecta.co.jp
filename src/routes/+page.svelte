<script lang="ts">
  import { onMount } from 'svelte'
  import { articles } from '$lib/articles/registry'
  import ArticleCard from '$lib/vecta/ArticleCard.svelte'
  import ContactForm from '$lib/vecta/ContactForm.svelte'
  import ContactModal from '$lib/vecta/ContactModal.svelte'
  import {
    companyDetails,
    conceptParagraphs,
    contact,
    hero,
    site,
  } from '$lib/vecta/content'
  import Footer from '$lib/vecta/Footer.svelte'
  import Header from '$lib/vecta/Header.svelte'
  import {
    buildBreadcrumbJsonLd,
    buildFaqJsonLd,
    buildOrganizationJsonLd,
    buildPageSeo,
    buildWebsiteJsonLd,
  } from '$lib/vecta/seo'

  const featuredArticles = articles.slice(0, 3)
  const seo = buildPageSeo()
  const jsonLd = [
    buildWebsiteJsonLd(),
    buildOrganizationJsonLd(),
    buildBreadcrumbJsonLd([{ name: 'ホーム', path: '/' }]),
    buildFaqJsonLd(),
  ]
  let contactModalOpen = $state(false)

  const openContactModal = () => {
    contactModalOpen = true
  }

  const closeContactModal = () => {
    contactModalOpen = false
  }

  onMount(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const videos = document.querySelectorAll<HTMLVideoElement>(
      '[data-motion-video]',
    )
    for (const video of videos) {
      video.muted = true
      void video.play().catch(() => {})
    }
  })
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

<div class="page">
  <Header />

  <main>
    <section id="hero" class="hero-section">
      <div class="container hero-layout">
        <div class="hero-content">
          <p class="hero-kicker">{site.title}</p>
          <h1>{hero.title}</h1>
          <p class="hero-subtitle">{hero.subtitle}</p>
          <div class="hero-actions">
            <button
              type="button"
              class="button button-primary"
              onclick={openContactModal}
            >
              {hero.cta}
            </button>
          </div>
        </div>

        <div class="hero-media" aria-hidden="true">
          <video
            class="hero-video"
            data-motion-video
            poster="/assets/hero-city-poster.webp"
            muted
            loop
            playsinline
            preload="metadata"
            width="1280"
            height="720"
          >
            <source src="/assets/hero-city.webm" type="video/webm">
            <source src="/assets/hero-city.mp4" type="video/mp4">
            <img
              class="hero-video-fallback"
              src="/assets/hero-city.webp"
              alt=""
              width="960"
              height="540"
              loading="eager"
              decoding="async"
            >
          </video>
        </div>
      </div>
    </section>

    <section id="concept" class="concept-section">
      <div class="container section-layout concept-layout">
        <div class="section-heading section-heading--light">
          <p>Concept</p>
          <h2>コンセプト</h2>
        </div>
        <div class="concept-content">
          <div class="concept-copy">
            {#each conceptParagraphs as paragraph}
              <p>{paragraph}</p>
            {/each}
          </div>
          <figure class="concept-visual" aria-hidden="true">
            <video
              class="concept-video"
              data-motion-video
              poster="/assets/concept-knowledge-poster.webp"
              muted
              loop
              playsinline
              preload="metadata"
              width="960"
              height="540"
            >
              <source
                src="/assets/concept-knowledge-loop.webm"
                type="video/webm"
              >
              <img
                class="concept-video-fallback"
                src="/assets/concept-knowledge-poster.webp"
                alt=""
                width="960"
                height="540"
                loading="lazy"
                decoding="async"
              >
            </video>
          </figure>
        </div>
      </div>
    </section>

    <section id="projects" class="projects-section">
      <div class="container section-layout">
        <div class="section-heading">
          <p>Product</p>
          <h2>製品概要</h2>
        </div>
        <div class="article-grid">
          <article class="swarrow-card">
            <a href="https://swarrow.com/">
              <div class="swarrow-card-media">
                <img
                  src="/assets/Swarrow_Logo.png"
                  alt="Swarrow"
                  width="789"
                  height="820"
                  loading="lazy"
                  decoding="async"
                >
              </div>
              <div class="swarrow-card-body">
                <h3>Swarrow</h3>
                <p class="swarrow-card-kind">自治体 AI サービス</p>
                <p class="swarrow-card-lede">
                  <span>回答精度に妥協しない。</span>
                  <span>自治体フルチューニングAI。</span>
                </p>
                <p class="swarrow-card-description">
                  チャットやコールセンターのAI機能を安心してご利用いただくには、回答精度を支える設計が欠かせません。自治体の公式情報・回答ルール・職員への引き継ぎなどを、実際のオペレーションに合わせて個別に設計します。公開後も利用状況をもとに回答品質を継続的に高め、運用を重ねるほど改善につなげられる仕組みを整えます。
                </p>
              </div>
            </a>
          </article>
        </div>
      </div>
    </section>

    <section id="articles" class="articles-section">
      <div class="container section-layout">
        <div class="section-heading">
          <p>News</p>
          <h2>ニュース</h2>
        </div>
        <div class="article-grid">
          {#each featuredArticles as article (article.slug)}
            <ArticleCard {article} />
          {/each}
        </div>
        <div class="section-action">
          <a href="/article/" class="button button-secondary">ニュース一覧へ</a>
        </div>
      </div>
    </section>

    <section id="company" class="company-section">
      <div class="container section-layout">
        <div class="section-heading">
          <p>Company</p>
          <h2>会社概要</h2>
        </div>
        <div class="company-content">
          <div class="company-info">
            <dl class="info-list">
              {#each companyDetails as item (item.label)}
                <div class="info-item">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              {/each}
            </dl>
          </div>
        </div>
      </div>
    </section>

    <section id="contact" class="contact-section">
      <div class="container section-layout">
        <div class="section-heading">
          <p>{contact.kicker}</p>
          <h2>{contact.title}</h2>
        </div>
        <div class="contact-content">
          <p class="contact-lead">{contact.lead}</p>
          <div class="contact-card">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  </main>

  <Footer />
  <ContactModal open={contactModalOpen} onClose={closeContactModal} />
</div>

<style>
  .page {
    background: var(--color-paper);
  }

  .hero-section {
    position: relative;
    overflow: hidden;
    isolation: isolate;
    min-height: 640px;
    padding: 3.25rem 0 4.75rem;
    background: linear-gradient(
      180deg,
      var(--color-paper) 0%,
      #f8f9f5 48%,
      #f5f7f4 100%
    );
    color: var(--color-indigo-dark);
  }

  .hero-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.75rem;
    align-items: center;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 680px;
  }

  .hero-kicker {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    color: var(--color-vector-blue);
    font-family: var(--font-monospace);
    font-size: 0.88rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-transform: uppercase;
  }

  .hero-kicker::before {
    content: "";
    width: 2.25rem;
    height: 1px;
    background: var(--color-vector-blue);
  }

  .hero-content h1 {
    color: var(--color-indigo-dark);
    font-family: var(--font-secondary);
    font-size: clamp(2.35rem, 10vw, 3.1rem);
    line-height: 1.18;
    margin-bottom: 1.15rem;
    text-wrap: balance;
  }

  .hero-subtitle {
    color: var(--color-indigo-dark);
    font-size: 1.08rem;
    line-height: 1.95;
    margin: 0 0 2rem;
    max-width: 640px;
  }

  .hero-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .hero-media {
    position: relative;
    display: flex;
    z-index: 1;
    justify-content: center;
    width: 100%;
    min-width: 0;
    margin: 0 auto;
  }

  .hero-video,
  .hero-video-fallback {
    display: block;
    width: min(1120px, 126vw);
    max-width: none;
    height: auto;
    background: #f5f7f4;
    filter: brightness(1.055) contrast(0.99);
    object-fit: contain;
    -webkit-mask-image:
      linear-gradient(
        90deg,
        transparent 0,
        #000 11%,
        #000 91%,
        transparent 100%
      ),
      linear-gradient(
        180deg,
        transparent 0,
        #000 10%,
        #000 92%,
        transparent 100%
      );
    -webkit-mask-composite: source-in;
    mask-image:
      linear-gradient(
        90deg,
        transparent 0,
        #000 11%,
        #000 91%,
        transparent 100%
      ),
      linear-gradient(
        180deg,
        transparent 0,
        #000 10%,
        #000 92%,
        transparent 100%
      );
    mask-composite: intersect;
  }

  section {
    scroll-margin-top: 5rem;
  }

  .section-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(1.75rem, 3vw, 2.75rem);
  }

  .section-heading {
    max-width: 42rem;
  }

  .section-heading p {
    color: var(--color-vector-blue);
    font-family: var(--font-monospace);
    font-size: 0.82rem;
    font-weight: 700;
    margin-bottom: 0.55rem;
    text-transform: uppercase;
  }

  .section-heading h2 {
    color: var(--color-indigo);
    font-size: 2rem;
    line-height: 1.2;
    margin: 0;
  }

  .section-heading--light p {
    color: var(--color-amber-soft);
  }

  .section-heading--light h2 {
    color: var(--color-white);
  }

  .concept-section {
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      var(--color-indigo);
    background-size: 42px 42px;
    color: var(--color-white);
  }

  .concept-layout {
    display: grid;
    gap: clamp(1.75rem, 3vw, 2.75rem);
  }

  .concept-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.6rem;
    max-width: 1100px;
  }

  .concept-copy {
    display: grid;
    max-width: 820px;
    gap: 1.1rem;
  }

  .concept-copy p {
    color: rgba(255, 255, 255, 0.78);
    font-size: 1.04rem;
    line-height: 1.95;
    margin: 0;
  }

  .concept-visual {
    position: relative;
    overflow: hidden;
    margin: 0;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 24px 52px rgba(0, 0, 0, 0.22);
  }

  .concept-visual::after {
    content: "";
    position: absolute;
    inset: 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    pointer-events: none;
  }

  .concept-video,
  .concept-video-fallback {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    object-fit: contain;
    background: #f4f7ff;
  }

  .articles-section {
    background: var(--color-white);
  }

  .article-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    max-width: 1100px;
    margin: 0;
  }

  .info-list {
    background-color: var(--color-white);
    border: 1px solid var(--color-line);
    border-radius: 8px;
    box-shadow: 0 14px 36px rgba(9, 27, 51, 0.07);
  }

  .section-action {
    margin-top: 0;
    text-align: left;
  }

  .company-section,
  .projects-section {
    background: var(--color-mist);
  }

  .company-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1100px;
    margin: 0;
  }

  .info-list {
    position: relative;
    overflow: hidden;
  }

  .info-list::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--color-gold);
  }

  .info-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
    padding: 1.35rem;
    margin: 0;
  }

  .info-item {
    display: grid;
    grid-template-columns: minmax(5rem, 0.35fr) 1fr;
    gap: 1rem;
    padding: 0.9rem 0;
    border-bottom: 1px solid var(--color-line);
  }

  .info-item:first-child {
    padding-top: 0;
  }

  .info-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .info-item dt {
    color: var(--color-indigo);
    font-weight: 700;
  }

  .info-item dd {
    color: var(--color-medium-text);
    margin: 0;
  }

  .swarrow-card {
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

  .swarrow-card:hover {
    border-color: rgba(47, 111, 237, 0.35);
    transform: translateY(-4px);
    box-shadow: var(--shadow-soft);
  }

  .swarrow-card a {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: inherit;
  }

  .swarrow-card-media {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 190px;
    padding: 1.25rem;
    background: var(--color-mist);
  }

  .swarrow-card-media img {
    display: block;
    width: auto;
    max-width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .swarrow-card-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 1.2rem;
  }

  .swarrow-card h3 {
    color: var(--color-indigo);
    font-size: 1.05rem;
    line-height: 1.45;
    margin-bottom: 0.45rem;
  }

  .swarrow-card p.swarrow-card-kind {
    display: block;
    order: -1;
    color: var(--color-vector-blue);
    font-family: var(--font-monospace);
    font-size: 0.78rem;
    margin-bottom: 0.7rem;
    text-transform: uppercase;
  }

  .swarrow-card p {
    color: var(--color-medium-text);
    font-size: 0.95rem;
    line-height: 1.7;
    margin: 0;
  }

  .swarrow-card p.swarrow-card-lede {
    color: var(--color-indigo);
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1.65;
    margin-bottom: 0.7rem;
  }

  .swarrow-card-lede span {
    display: block;
  }

  .swarrow-card p.swarrow-card-description {
    font-size: 0.88rem;
    line-height: 1.75;
  }

  .contact-section {
    background: var(--color-white);
  }

  .contact-content {
    display: grid;
    gap: 1.5rem;
    max-width: 720px;
  }

  .contact-lead {
    color: var(--color-medium-text);
    font-size: 1.04rem;
    line-height: 1.85;
    margin: 0;
  }

  .contact-card {
    background-color: var(--color-white);
    border: 1px solid var(--color-line);
    border-radius: 8px;
    box-shadow: 0 14px 36px rgba(9, 27, 51, 0.07);
    padding: 1.35rem;
  }

  @media (min-width: 600px) {
    .hero-actions {
      flex-direction: row;
      flex-wrap: wrap;
    }
  }

  @media (min-width: 769px) {
    .hero-section {
      padding: 4.75rem 0 5.75rem;
    }

    .hero-layout {
      grid-template-columns: minmax(400px, 0.44fr) minmax(0, 1fr);
      gap: clamp(0.75rem, 2vw, 1.75rem);
    }

    .hero-content h1 {
      font-size: 3.35rem;
    }

    .hero-subtitle {
      font-size: 1.22rem;
    }

    .hero-video,
    .hero-video-fallback {
      width: min(1120px, 116%);
    }

    .section-heading h2 {
      font-size: 2.2rem;
    }

    .concept-content {
      grid-template-columns: minmax(0, 0.78fr) minmax(300px, 0.72fr);
      gap: 2rem;
      align-items: center;
    }

    .concept-visual {
      width: 100%;
    }

    .article-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .info-list {
      padding: 2rem;
    }

    .contact-card {
      padding: 2rem;
    }
  }

  @media (max-width: 480px) {
    .hero-content h1 {
      font-size: 2.12rem;
    }

    .hero-subtitle {
      font-size: 1.05rem;
    }

    .hero-video,
    .hero-video-fallback {
      width: min(760px, 132vw);
    }

    .info-item {
      grid-template-columns: 1fr;
      gap: 0.35rem;
    }
  }
</style>
