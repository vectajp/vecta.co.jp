<script lang="ts">
  import { inquiryProducts } from "@vecta/site-content/inquiries";
  import { site, siteName } from "./content";
  import FeatureIllustration from "./FeatureIllustration.svelte";
  import InquiryForm from "./InquiryForm.svelte";
  import { type LandingId, landingPages } from "./landingPages";

  let { product }: { product: LandingId } = $props();
  const content = $derived(landingPages[product]);
  const canonical = $derived(`${site}/${product}`);
  const structuredData = $derived({
    "@context": "https://schema.org",
    "@type": "Service",
    name: inquiryProducts[product],
    serviceType: content.title,
    description: content.lead,
    url: canonical,
    provider: {
      "@type": "Organization",
      name: "株式会社Vecta",
      url: "https://www.vecta.co.jp/",
    },
    audience: { "@type": "Audience", audienceType: "自治体" },
  });
</script>

<svelte:head>
  <title>{content.pageTitle}</title>
  <meta name="description" content={content.lead}>
  <meta name="robots" content="index,follow">
  <meta name="theme-color" content="#ffffff">
  <link rel="canonical" href={canonical}>
  <meta property="og:type" content="website">
  <meta property="og:site_name" content={siteName}>
  <meta property="og:locale" content="ja_JP">
  <meta property="og:title" content={content.pageTitle}>
  <meta property="og:description" content={content.lead}>
  <meta property="og:url" content={canonical}>
  <meta property="og:image" content={`${site}${content.image}`}>
  <meta property="og:image:width" content={String(content.imageWidth)}>
  <meta property="og:image:height" content={String(content.imageHeight)}>
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content={content.pageTitle}>
  <meta name="twitter:description" content={content.lead}>
  <meta name="twitter:image" content={`${site}${content.image}`}>
  {@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<main
  class="channel-page"
  class:cms={product === "cms"}
  class:post={product === "line"}
>
  <section class="hero" aria-labelledby="page-title">
    {#if product === "cms"}
      <img
        class="scenery"
        src="/cms/scenery.webp"
        alt=""
        width="1376"
        height="1143"
        decoding="async"
      >
    {/if}
    <div class="container hero-grid">
      <div class="hero-copy">
        <h1 id="page-title">{content.title}</h1>
        {#if product === "cms"}
          <p class="product-name">
            <img
              src="/cms/mark.webp"
              alt=""
              width="192"
              height="192"
            >SwarrowSite
          </p>
        {:else}
          <p class="product-name">SwarrowPost</p>
        {/if}
        <p class="lead">{content.lead}</p>
      </div>
      <figure class="hero-media">
        <a
          class="screen-link"
          href={content.image}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${inquiryProducts[product]}の画面を拡大して見る`}
        >
          <img
            src={content.image}
            alt={content.imageAlt}
            width={content.imageWidth}
            height={content.imageHeight}
            fetchpriority="high"
          >
        </a>
        <figcaption>{content.caption}</figcaption>
      </figure>
    </div>
  </section>

  <section class="features" aria-labelledby="features-title">
    <div class="container">
      <h2 id="features-title">{content.featureTitle}</h2>
      <div class="feature-grid">
        {#each content.features as feature (feature.title)}
          <article>
            <div class="feature-image">
              <FeatureIllustration kind={feature.icon} />
            </div>
            <div class="feature-copy">
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </div>
          </article>
        {/each}
      </div>
    </div>
  </section>

  {#if product === "line"}
    <section class="menu-section container" aria-labelledby="menu-title">
      <h2 id="menu-title">リッチメニューを職員が編集</h2>
      <p class="workflow-lead">
        画面上でタップする範囲と動作を設定し、住民がよく使う手続きや情報への入り口を整理します。
      </p>
      <figure class="menu-screen">
        <a
          class="screen-link"
          href="/line/rich-menu.jpg"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="リッチメニュー編集画面を拡大して見る"
        >
          <img
            src="/line/rich-menu.jpg"
            alt="タップ範囲の配置と、選んだ領域の表示名・動作を設定するリッチメニュー編集画面"
            width="1248"
            height="850"
            loading="lazy"
          >
        </a>
        <figcaption>リッチメニュー編集画面の表示例</figcaption>
      </figure>
    </section>
  {/if}
  <section class="workflow container" aria-labelledby="workflow-title">
    <h2 id="workflow-title">{content.flowTitle}</h2>
    <p class="workflow-lead">{content.flowBody}</p>
    <ol class="stages">
      {#each content.stages as stage (stage)}
        <li><span>{stage}</span></li>
      {/each}
    </ol>
    <p class="related"><a href="/chat">SwarrowChatの機能を見る</a></p>
  </section>
  <InquiryForm {product} />
</main>

<style>
  .channel-page {
    background: #fff;
    color: var(--sc-navy);
  }
  .container {
    width: min(1360px, calc(100% - 96px));
    margin-inline: auto;
  }
  .hero {
    position: relative;
    overflow: hidden;
  }
  .hero-grid {
    position: relative;
    display: grid;
    grid-template-columns: 0.9fr 1.5fr;
    align-items: center;
    min-height: 610px;
    padding-block: 40px 24px;
    gap: 16px;
  }
  .hero-copy {
    position: relative;
    z-index: 1;
  }
  h1,
  h2,
  h3,
  p,
  figure {
    margin: 0;
  }
  h1 {
    font-size: clamp(30px, 3.3vw, 49px);
    line-height: 1.5;
    letter-spacing: -0.035em;
    font-weight: 800;
  }
  .lead {
    font-size: clamp(18px, 1.65vw, 24px);
    line-height: 1.9;
    margin-top: 24px;
    max-width: 490px;
    font-weight: 500;
  }
  .hero-media {
    min-width: 0;
  }
  .hero-media img {
    display: block;
    width: 100%;
    height: auto;
  }
  figcaption {
    text-align: center;
    font-size: 15px;
    margin-top: 12px;
  }
  .cms .hero-grid {
    grid-template-columns: 0.92fr 1.3fr;
    gap: 36px;
    min-height: 600px;
    align-items: start;
    padding-top: 56px;
  }
  .cms h1 {
    font-size: clamp(25px, 2.65vw, 39px);
  }
  .product-name {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: clamp(35px, 4.1vw, 60px);
    font-weight: 800;
    letter-spacing: -0.035em;
    line-height: 1.2;
    margin-top: 20px;
    white-space: nowrap;
  }
  .product-name img {
    width: 76px;
    height: 76px;
  }
  .cms .lead {
    font-size: clamp(18px, 1.5vw, 22px);
  }
  .scenery {
    position: absolute;
    width: 46%;
    height: 270px;
    object-fit: cover;
    object-position: center 65%;
    left: 0;
    bottom: 0;
    mask-image: linear-gradient(
      to bottom,
      transparent,
      black 25%,
      black 80%,
      transparent
    );
  }
  .screen-link {
    display: block;
    border: 1px solid #c7d3df;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 7px 24px rgba(9, 32, 69, 0.1);
  }
  .features {
    background: var(--sc-bg-light);
    padding-block: 48px 56px;
  }
  h2 {
    border-left: 7px solid var(--sc-blue);
    padding-left: 22px;
    font-size: clamp(26px, 2.8vw, 39px);
    font-weight: 800;
    line-height: 1.55;
    letter-spacing: -0.025em;
  }
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 42px;
    margin-top: 40px;
  }
  article {
    min-width: 0;
    text-align: left;
  }
  .feature-image {
    width: 130px;
    margin-bottom: 18px;
  }
  h3 {
    font-size: clamp(22px, 2vw, 28px);
    line-height: 1.55;
    font-weight: 750;
    letter-spacing: -0.025em;
  }
  .feature-copy p {
    font-size: 18px;
    line-height: 1.9;
    margin-top: 12px;
  }
  .cms article {
    display: flex;
    gap: 16px;
    align-items: start;
  }
  .cms .feature-image {
    width: 100px;
    flex: 0 0 100px;
    margin: 0;
  }
  .cms h3 {
    font-size: 23px;
  }
  .cms .feature-grid {
    gap: 28px;
  }
  .cms .feature-copy p {
    font-size: 16px;
  }
  .workflow {
    padding-block: 56px 46px;
  }
  .workflow-lead {
    font-size: 19px;
    line-height: 1.9;
    margin: 20px 0 0 29px;
    max-width: 1080px;
  }
  .stages {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 34px 29px 0;
  }
  .stages li {
    background: #e1f2fc;
    padding: 14px 12px;
    clip-path: polygon(
      0 0,
      calc(100% - 18px) 0,
      100% 50%,
      calc(100% - 18px) 100%,
      0 100%,
      18px 50%
    );
    font-size: 24px;
    font-weight: 700;
    text-align: center;
  }
  .stages li:first-child {
    clip-path: polygon(
      0 0,
      calc(100% - 18px) 0,
      100% 50%,
      calc(100% - 18px) 100%,
      0 100%
    );
  }
  .stages li:last-child {
    background: #e5f4df;
    color: #35632b;
  }
  .related {
    text-align: center;
    margin-top: 32px;
    font-size: 19px;
  }
  .related a {
    color: var(--sc-blue);
    text-decoration: underline;
    text-underline-offset: 5px;
  }
  .channel-page :global(.inquiry) {
    border-top: 1px solid var(--sc-border);
  }
  .post .hero-grid {
    grid-template-columns: 1fr;
    min-height: 0;
    gap: 32px;
    padding-block: 44px 36px;
  }
  .post .hero-copy {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 48px;
    align-items: center;
  }
  .post h1 {
    font-size: clamp(26px, 2.4vw, 36px);
  }
  .post .product-name {
    grid-column: 1;
    margin-top: 12px;
  }
  .post .lead {
    grid-column: 2;
    grid-row: 1 / 3;
    margin: 0;
    max-width: none;
  }
  .menu-section {
    padding-block: 52px 20px;
  }
  .menu-screen {
    max-width: 1120px;
    margin: 32px auto 0;
  }
  .menu-screen img {
    display: block;
    width: 100%;
    height: auto;
  }
  @media (max-width: 1150px) and (min-width: 861px) {
    .container {
      width: calc(100% - 64px);
    }
    .cms article {
      flex-direction: column;
    }
    .cms .feature-image {
      flex-basis: auto;
    }
    .product-name {
      gap: 8px;
    }
    .product-name img {
      width: 60px;
      height: 60px;
    }
    .cms .hero-grid {
      min-height: 570px;
    }
  }
  @media (max-width: 860px) {
    .container {
      width: calc(100% - 40px);
    }
    .hero-grid,
    .cms .hero-grid {
      grid-template-columns: 1fr;
      gap: 26px;
      min-height: 0;
      padding-block: 34px 30px;
    }
    h1 {
      font-size: clamp(29px, 7.5vw, 44px);
    }
    .cms h1 {
      font-size: clamp(24px, 6.2vw, 37px);
    }
    .lead,
    .cms .lead {
      font-size: 18px;
      margin-top: 18px;
      max-width: 650px;
      line-height: 1.85;
    }
    .hero-media {
      max-width: 680px;
      width: 100%;
      margin-inline: auto;
    }
    figcaption {
      font-size: 13px;
      margin-top: 10px;
    }
    .product-name {
      font-size: clamp(35px, 9vw, 58px);
      margin-top: 14px;
      gap: 12px;
    }
    .product-name img {
      width: 56px;
      height: 56px;
    }
    .scenery {
      display: none;
    }
    .features {
      padding-block: 34px 36px;
    }
    h2 {
      font-size: clamp(24px, 6.1vw, 34px);
      border-width: 5px;
      padding-left: 15px;
    }
    .feature-grid,
    .cms .feature-grid {
      grid-template-columns: 1fr;
      gap: 30px;
      margin-top: 30px;
    }
    article,
    .cms article {
      display: flex;
      text-align: left;
      align-items: start;
      gap: 16px;
    }
    .feature-image,
    .cms .feature-image {
      width: 84px;
      flex: 0 0 84px;
      margin: 0;
    }
    h3,
    .cms h3 {
      font-size: 21px;
    }
    .feature-copy p,
    .cms .feature-copy p {
      font-size: 16px;
      margin-top: 8px;
      line-height: 1.85;
    }
    .workflow {
      padding-block: 36px;
    }
    .workflow-lead {
      font-size: 17px;
      margin: 18px 0 0;
    }
    .stages {
      grid-template-columns: 1fr;
      gap: 8px;
      margin: 28px 0 0;
    }
    .stages li,
    .stages li:first-child {
      clip-path: none;
      font-size: 21px;
      padding-block: 12px;
    }
    .post .hero-grid {
      padding-block: 30px;
      gap: 24px;
    }
    .post .hero-copy {
      display: block;
    }
    .post h1 {
      font-size: clamp(24px, 6.2vw, 34px);
    }
    .post .lead {
      font-size: 18px;
      margin-top: 18px;
    }
    .menu-section {
      padding-block: 36px 0;
    }
    .menu-screen {
      margin-top: 24px;
    }
    .related {
      font-size: 17px;
      margin-top: 28px;
    }
  }
</style>
