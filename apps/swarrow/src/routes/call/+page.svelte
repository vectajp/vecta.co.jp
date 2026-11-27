<script lang="ts">
  import CallDetails from "$lib/swarrow/CallDetails.svelte";
  import CallFaq from "$lib/swarrow/CallFaq.svelte";
  import {
    pageDescription,
    productJsonLd,
    products,
    site,
    siteName,
    siteOgImage,
  } from "$lib/swarrow/content";
  import InquiryForm from "$lib/swarrow/InquiryForm.svelte";

  const product = products.find((item) => item.id === "call");
  const pageTitle = `SwarrowCall｜${product?.category ?? ""}`;
  const canonicalUrl = `${site}/call`;
  const ogImage = product?.ogImage ?? siteOgImage;
</script>
<svelte:head>
  <title>{pageTitle}</title>
  <meta
    name="description"
    content={product?.metaDescription ?? pageDescription}
  >
  <meta name="theme-color" content="#f4f4f6">
  <link rel="canonical" href={canonicalUrl}>
  <meta name="robots" content="index,follow">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content={siteName}>
  <meta property="og:locale" content="ja_JP">
  <meta property="og:title" content={pageTitle}>
  <meta
    property="og:description"
    content={product?.metaDescription ?? pageDescription}
  >
  <meta property="og:url" content={canonicalUrl}>
  <meta property="og:image" content={`${site}${ogImage.path}`}>
  <meta property="og:image:width" content={String(ogImage.width)}>
  <meta property="og:image:height" content={String(ogImage.height)}>

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content={pageTitle}>
  <meta
    name="twitter:description"
    content={product?.metaDescription ?? pageDescription}
  >
  <meta name="twitter:image" content={`${site}${ogImage.path}`}>

  {@html `<script type="application/ld+json">${JSON.stringify(productJsonLd("call"))}</script>`}
</svelte:head>

<main id="top" class="call-page">
  <section class="call-hero" aria-labelledby="call-title">
    <picture class="hero-art">
      <source
        media="(max-width: 860px)"
        srcset="/swarrow-call/hero-people-mobile-v5.webp"
      >
      <img
        src="/swarrow-call/hero-people-desktop-v5.webp"
        alt="海辺の街を背景に住民と職員が電話で話す通話イメージ"
        width="1942"
        height="809"
        fetchpriority="high"
      >
    </picture>
    <div class="call-container hero-grid">
      <div class="hero-copy">
        <h1 id="call-title">自治体AIコールセンター</h1>
        <p class="product-name">
          <img
            src="/swarrow/icon.png"
            alt=""
            width="120"
            height="120"
          >SwarrowCall
        </p>
      </div>
    </div>
    <p class="hero-caption">通話イメージ</p>
  </section>

  <CallDetails />

  <section
    id="support"
    class="call-container support-section"
    aria-labelledby="support-title"
  >
    <h2 id="support-title">導入から運用まで支援</h2>
    <p>
      電話設備と取次先を確認し、受付フローの設計・接続試験から運用後の改善まで支援します。
    </p>
  </section>
  <CallFaq />
  <InquiryForm product="call" />
</main>

<style>
  .call-page {
    background: var(--sc-bg-card);
    color: var(--sc-navy);
  }
  .call-container {
    width: 85.6%;
    max-width: 1644px;
    margin-inline: auto;
  }
  h1,
  h2,
  p {
    margin: 0;
  }
  h2 {
    font-size: clamp(27px, 2.3vw, 40px);
    line-height: 1.4;
    font-weight: 800;
    letter-spacing: -0.035em;
  }
  .call-hero {
    position: relative;
    background: #edf7fd;
    color: var(--sc-navy);
    overflow: hidden;
  }
  .hero-art,
  .hero-art img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .hero-art img {
    object-fit: cover;
    object-position: center;
  }
  .hero-grid {
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    min-height: clamp(500px, 39.88vw, 766px);
    padding-block: 64px 140px;
  }
  .hero-copy {
    position: relative;
    z-index: 1;
  }
  h1 {
    font-size: clamp(27px, 2.8vw, 54px);
    font-weight: 800;
    letter-spacing: -0.035em;
    line-height: 1.4;
  }
  .product-name {
    display: flex;
    align-items: center;
    gap: 1vw;
    color: var(--sc-navy);
    font-size: clamp(37px, 4.1vw, 81px);
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.045em;
    margin-top: 1.55vw;
    white-space: nowrap;
  }
  .product-name img {
    width: clamp(64px, 5.74vw, 114px);
    height: auto;
  }
  .hero-caption {
    position: absolute;
    left: 62%;
    right: 8%;
    bottom: 12px;
    text-align: center;
    color: var(--sc-navy);
    font-size: 14px;
  }
  .support-section {
    box-sizing: border-box;
    max-width: 1360px;
    padding-block: 32px 64px;
  }
  .support-section p {
    max-width: 850px;
    margin-top: 20px;
    color: var(--sc-text-secondary);
    font-size: 16px;
    line-height: 1.85;
  }
  @media (max-width: 860px) {
    .call-container {
      width: calc(100% - 40px);
    }
    .hero-grid {
      flex-direction: column;
      padding-block: 48px 320px;
      min-height: 580px;
    }
    .hero-copy {
      align-self: center;
    }
    h1 {
      font-size: clamp(23px, 6.3vw, 40px);
      text-align: center;
    }
    .product-name {
      justify-content: center;
      font-size: clamp(34px, 8.4vw, 58px);
      gap: 10px;
      margin-top: 20px;
    }
    .product-name img {
      width: 54px;
    }
    .hero-caption {
      left: 0;
      right: 0;
      font-size: 13px;
    }
    .support-section {
      padding-block: 24px 44px;
    }
  }
</style>
