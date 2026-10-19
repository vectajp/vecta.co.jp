<script lang="ts">
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import Clock from "@lucide/svelte/icons/clock";
  import Phone from "@lucide/svelte/icons/phone";
  import PhoneForwarded from "@lucide/svelte/icons/phone-forwarded";
  import PhoneOutgoing from "@lucide/svelte/icons/phone-outgoing";
  import Users from "@lucide/svelte/icons/users";
  import {
    callCapabilities,
    callCustomerSuccessSteps,
    callFeatureCopy,
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
  const featureIcons = [Phone, PhoneForwarded, PhoneOutgoing];
  const callFlows = [
    {
      from: Clock,
      fromLabel: "指定日時",
      to: PhoneOutgoing,
      toLabel: "電話を発信",
    },
    {
      from: Phone,
      fromLabel: "AIが受付",
      to: PhoneForwarded,
      toLabel: "担当部署へ",
    },
    {
      from: PhoneOutgoing,
      fromLabel: "一括発信",
      to: Users,
      toLabel: "対象者リスト",
    },
  ];
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
      <figure class="hero-illustration">
        <img
          src="/swarrow-call/phone-service.webp"
          alt="電話で相談する住民と、公式情報をもとに案内するAIのイメージ"
          width="1586"
          height="992"
          fetchpriority="high"
        >
      </figure>
    </div>
  </section>

  <section class="call-container introduction" aria-labelledby="answer-title">
    <h2 id="answer-title">電話の一次受付と案内</h2>
    <p class="section-lead">{callFeatureCopy.lead}</p>
    <ul class="features">
      {#each callFeatureCopy.list as feature, index (feature.title)}
        {@const Icon = featureIcons[index]}
        <li>
          <span class="feature-icon"
            ><Icon size={29} stroke-width={1.7} aria-hidden="true" /></span
          >
          <h3>{feature.title}</h3>
          <p>{feature.body}</p>
        </li>
      {/each}
    </ul>
  </section>

  <section class="capabilities-section" aria-labelledby="capabilities-title">
    <div class="call-container">
      <h2 id="capabilities-title">電話の取次と発信</h2>
      <div class="capabilities">
        {#each callCapabilities as capability, index (capability.title)}
          {@const flow = callFlows[index]}
          <article>
            <div class="call-flow" role="img" aria-label={capability.alt}>
              <div class="flow-node">
                <span><flow.from size={53} stroke-width={1.5} /></span>
                <strong>{flow.fromLabel}</strong>
              </div>
              <ArrowRight
                class="flow-arrow"
                size={36}
                stroke-width={1.5}
                aria-hidden="true"
              />
              <div class="flow-node destination">
                <span><flow.to size={53} stroke-width={1.5} /></span>
                <strong>{flow.toLabel}</strong>
              </div>
            </div>
            <h3>{capability.title}</h3>
            <p>{capability.body}</p>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <section
    id="support"
    class="call-container support-section"
    aria-labelledby="support-title"
  >
    <h2 id="support-title">導入から運用まで支援</h2>
    <ol class="support-steps">
      {#each callCustomerSuccessSteps as step (step.phase)}
        <li>
          <span class="step-number">0{step.phase}</span>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
        </li>
      {/each}
    </ol>
  </section>
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
  h3,
  p,
  figure {
    margin: 0;
  }
  p {
    line-height: 1.85;
    color: var(--sc-text-secondary);
  }
  h2 {
    font-size: clamp(27px, 2.3vw, 40px);
    line-height: 1.4;
    font-weight: 800;
    letter-spacing: -0.035em;
  }
  h3 {
    font-size: clamp(18px, 1.65vw, 27px);
    line-height: 1.5;
    font-weight: 750;
  }
  section[id] {
    scroll-margin-top: 110px;
  }
  .call-hero {
    background: var(--sc-bg-light);
    overflow: hidden;
  }
  .hero-grid {
    display: grid;
    grid-template-columns: 0.95fr 1.05fr;
    align-items: center;
    min-height: clamp(420px, 36vw, 650px);
    gap: 3%;
    padding-block: 48px;
  }
  .hero-copy {
    position: relative;
    z-index: 1;
  }
  h1 {
    font-size: clamp(30px, 2.7vw, 54px);
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
  .hero-illustration {
    width: 116%;
  }
  .hero-illustration img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
  .introduction {
    padding-block: 72px;
  }
  .section-lead {
    max-width: 850px;
    margin-top: 22px;
    font-size: clamp(16px, 1.2vw, 20px);
  }
  .features,
  .support-steps {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 44px;
    padding: 0;
    list-style: none;
    margin: 38px 0 0;
  }
  .feature-icon {
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    color: var(--sc-blue);
    background: var(--sc-bg-light);
    margin-bottom: 20px;
  }
  .features p,
  .support-steps p,
  .capabilities p {
    font-size: clamp(14px, 1.05vw, 18px);
    margin-top: 12px;
  }
  .capabilities-section {
    padding-block: 58px 66px;
    background: var(--sc-bg-light);
  }
  .capabilities {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 32px;
    margin-top: 28px;
  }
  .call-flow {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    gap: 8px;
    min-height: 210px;
    margin-bottom: 24px;
    border-radius: 14px;
    background: var(--sc-bg-card);
  }
  .flow-node {
    display: grid;
    justify-items: center;
    gap: 18px;
  }
  .flow-node span {
    display: grid;
    place-items: center;
    width: 80px;
    height: 80px;
    border-radius: 18px;
    color: var(--sc-blue);
    background: var(--sc-bg-light);
  }
  .destination span {
    color: var(--sc-diagram-green);
  }
  .flow-node strong {
    font-size: clamp(12px, 0.95vw, 16px);
    font-weight: 650;
  }
  .call-flow :global(.flow-arrow) {
    color: var(--sc-blue);
    flex-shrink: 0;
    margin-top: -35px;
  }
  .support-section {
    padding-block: 64px 72px;
  }
  .step-number {
    display: block;
    color: var(--sc-blue);
    font-size: 30px;
    font-weight: 750;
    margin-bottom: 14px;
  }
  @media (max-width: 1100px) {
    .features,
    .support-steps {
      gap: 28px;
    }
    .capabilities {
      gap: 22px;
    }
    .flow-node span {
      width: 64px;
      height: 64px;
    }
    .flow-node :global(svg) {
      width: 42px;
      height: 42px;
    }
    .call-flow :global(.flow-arrow) {
      width: 26px;
    }
  }
  @media (max-width: 860px) {
    .call-container {
      width: calc(100% - 40px);
    }
    .hero-grid {
      display: flex;
      flex-direction: column;
      padding-block: 40px 0;
      gap: 34px;
      min-height: auto;
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
    .hero-illustration {
      width: calc(100% + 40px);
    }
    .hero-illustration img {
      border-radius: 0;
    }
    .introduction {
      padding-block: 42px;
    }
    .features,
    .support-steps,
    .capabilities {
      grid-template-columns: 1fr;
      gap: 32px;
    }
    .features {
      margin-top: 28px;
    }
    .features li {
      display: grid;
      grid-template-columns: 54px 1fr;
      column-gap: 16px;
      align-items: center;
    }
    .feature-icon {
      grid-row: 1 / 3;
      width: 54px;
      height: 54px;
      margin: 0;
    }
    .features p {
      margin-top: 6px;
    }
    h2 {
      font-size: 27px;
    }
    h3 {
      font-size: 21px;
    }
    .capabilities-section {
      padding-block: 36px 42px;
    }
    .call-flow {
      min-height: 200px;
      margin-bottom: 18px;
    }
    .flow-node span {
      width: 88px;
      height: 88px;
    }
    .flow-node :global(svg) {
      width: 54px;
      height: 54px;
    }
    .flow-node strong {
      font-size: 15px;
    }
    .call-flow :global(.flow-arrow) {
      width: 36px;
    }
    .support-section {
      padding-block: 42px;
    }
    .support-steps {
      margin-top: 28px;
    }
    .support-steps li {
      position: relative;
      padding-left: 58px;
    }
    .step-number {
      position: absolute;
      left: 0;
      top: -3px;
      font-size: 26px;
    }
  }
</style>
