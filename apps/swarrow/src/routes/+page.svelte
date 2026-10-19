<script lang="ts">
  import { getContext, onMount } from "svelte";
  import {
    cases,
    heroCopy,
    jsonLd,
    news,
    pageDescription,
    pageTitle,
    products,
    sharedKnowledge,
    showCaseStudies,
    site,
    siteName,
    siteOgImage,
  } from "$lib/swarrow/content";
  import { vectaHref } from "$lib/swarrow/links";

  const REVEAL_SELECTOR = "[data-reveal]";
  const AUTOPLAY_VIDEO_SELECTOR = [
    ".hero-video",
    ".knowledge-video",
    ".workflow-video",
  ].join(", ");

  const playVideo = (video: HTMLVideoElement) => {
    video.muted = true;
    void video.play().catch(() => {});
  };
  const runCleanups = (cleanups: Array<() => void>) => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };

  const { isReducedMotion } = getContext<{ isReducedMotion: () => boolean }>(
    "swarrow-motion",
  );

  // 演出は控えめに: reduced-motion / no-JS ではヒーロー動画を止め poster を見せる。
  let workflowVideo: HTMLVideoElement | undefined;
  let workflowVideoReady = $state(false);

  onMount(() => {
    const cleanups: Array<() => void> = [];

    const markWorkflowVideoReady = () => {
      workflowVideoReady = true;
    };
    if (workflowVideo) {
      workflowVideo.addEventListener("loadeddata", markWorkflowVideoReady);
      workflowVideo.addEventListener("canplay", markWorkflowVideoReady);
      workflowVideo.addEventListener("error", markWorkflowVideoReady);
      if (workflowVideo.readyState >= 2) {
        markWorkflowVideoReady();
      }
      cleanups.push(() => {
        workflowVideo?.removeEventListener(
          "loadeddata",
          markWorkflowVideoReady,
        );
        workflowVideo?.removeEventListener("canplay", markWorkflowVideoReady);
        workflowVideo?.removeEventListener("error", markWorkflowVideoReady);
      });
    }

    if (isReducedMotion()) {
      workflowVideoReady = true;
      for (const el of document.querySelectorAll<HTMLElement>(
        REVEAL_SELECTOR,
      )) {
        el.classList.add("is-in");
      }
      return () => runCleanups(cleanups);
    }

    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
    );
    const videos = Array.from(
      document.querySelectorAll<HTMLVideoElement>(AUTOPLAY_VIDEO_SELECTOR),
    );

    for (const video of videos) {
      video.muted = true;
    }

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              revealObserver.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
      );
      for (const el of revealTargets) {
        revealObserver.observe(el);
      }
      cleanups.push(() => revealObserver.disconnect());

      const videoObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const video = entry.target as HTMLVideoElement;
            if (entry.isIntersecting) {
              playVideo(video);
            } else {
              video.pause();
            }
          }
        },
        { threshold: 0.08, rootMargin: "180px 0px" },
      );
      for (const video of videos) {
        videoObserver.observe(video);
      }
      cleanups.push(() => {
        videoObserver.disconnect();
        for (const video of videos) {
          video.pause();
        }
      });
    } else {
      for (const el of revealTargets) {
        el.classList.add("is-in");
      }
      for (const video of videos) {
        playVideo(video);
      }
    }

    return () => runCleanups(cleanups);
  });
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription}>
  <meta name="theme-color" content="#f4f4f6">
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
  <!-- Hero: 8秒ループのアイソメトリック動画を大きく配置。動画背景とページ背景を合わせ、外縁の切れ目を消す -->
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-copy">
        <h1 class="hero-title">{heroCopy.title}</h1>
      </div>

      <div class="hero-media" aria-hidden="true">
        <video
          class="hero-video"
          poster="/swarrow-call/hero-city-poster.webp"
          muted
          loop
          playsinline
          preload="metadata"
          width="1280"
          height="720"
        >
          <source src="/swarrow-call/hero-city.webm" type="video/webm">
          <source src="/swarrow-call/hero-city.mp4" type="video/mp4">
          <img
            class="hero-video-fallback"
            src="/swarrow-call/hero-city.webp"
            alt=""
            width="960"
            height="540"
            loading="eager"
            decoding="async"
          >
        </video>
      </div>
    </div>

    <div class="hero-fade"></div>
  </section>

  <section id="products" class="products" aria-labelledby="products-title">
    <div
      class="section-curve-bg section-curve-bg--paper section-curve-bg--flip hero-products-curve"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 1600"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M-80 330C80 128 266 88 498 136C726 184 812 188 1008 76C1214 -42 1378 24 1508 214V1600H-80Z"
        ></path>
      </svg>
    </div>
    <div class="products-inner">
      <div class="products-head" data-reveal>
        <p class="products-kicker section-kicker">Products</p>
        <h2 id="products-title">問い合わせの入口に合わせて選べる2つの製品</h2>
        <p>
          ホームページから始めても、電話から始めても、両方を組み合わせても導入できます。
        </p>
      </div>

      <div class="products-grid">
        {#each products as product (product.id)}
          <article class="product-card product-card--{product.id}" data-reveal>
            <img
              class="product-card-watermark"
              src={product.backgroundIcon}
              alt=""
              width="900"
              height="720"
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            >
            <p class="product-category">{product.category}</p>
            <div class="product-name">
              <img
                class="product-name-icon"
                src={product.icon}
                alt=""
                width="961"
                height="1006"
                decoding="async"
              >
              <h3>{product.name}</h3>
            </div>
            <p class="product-benefit">{product.benefit}</p>
            <ul>
              {#each product.useCases as useCase (useCase)}
                <li>{useCase}</li>
              {/each}
            </ul>
            <a class="product-card-link" href={product.href}
              >{product.name}を見る</a
            >
          </article>
        {/each}
      </div>

      <p class="products-integration" data-reveal>
        <strong>{sharedKnowledge.adoption}</strong>
        <span>
          併用時は、同じ知識基盤をホームページと電話で共有できます。
        </span>
      </p>
    </div>
  </section>

  <!-- Shared Knowledge: 同じ知識を SwarrowChat と SwarrowCall で共有する。 -->
  <section id="knowledge" class="knowledge" aria-labelledby="knowledge-title">
    <div
      class="section-curve-bg section-curve-bg--mist section-curve-bg--flip knowledge-top-curve"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 1600"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M-80 330C80 128 266 88 498 136C726 184 812 188 1008 76C1214 -42 1378 24 1508 214V1600H-80Z"
        ></path>
      </svg>
    </div>
    <div class="knowledge-inner">
      <figure class="knowledge-visual" data-reveal>
        <video
          class="knowledge-video"
          poster="/swarrow-call/knowledge-flow-alpha.png"
          muted
          loop
          playsinline
          preload="none"
          width="1280"
          height="720"
          aria-label="文書やFAQをSwarrowChatとSwarrowCallで共有する知識基盤のイメージ"
        >
          <source
            src="/swarrow-call/knowledge-flow-alpha.webm"
            type="video/webm"
          >
          <source src="/swarrow-call/knowledge-flow-alpha.mp4" type="video/mp4">
          <img
            class="knowledge-image"
            src="/swarrow-call/knowledge-flow-alpha.png"
            alt="文書やFAQをSwarrowChatとSwarrowCallで共有する知識基盤のイメージ"
            width="1672"
            height="941"
            loading="lazy"
            decoding="async"
          >
        </video>
      </figure>

      <div class="knowledge-copy" data-reveal>
        <h2 id="knowledge-title" class="knowledge-title">
          {sharedKnowledge.title}
        </h2>
        <p class="knowledge-lead">{sharedKnowledge.description}</p>
        <ul class="knowledge-flow">
          <li>
            <span>
              <strong>散らばる知識をまとめる</strong>
              <small>FAQ、手順書、業務データ、画像資料を1か所へ。</small>
            </span>
          </li>
          <li>
            <span>
              <strong>一度の更新で案内をそろえる</strong>
              <small>制度変更や現場の気づきを共通知識へ反映。</small>
            </span>
          </li>
          <li>
            <span>
              <strong>ChatとCallの双方で使う</strong>
              <small>Webと電話で同じ根拠から住民へ案内。</small>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Workflow: 初期設定後に職員がノーコードで対話シナリオを更新する運用イメージ。 -->
  <section
    id="operations"
    class="feature-band feature-band--paper feature-band--last"
    aria-labelledby="operations-title"
  >
    <div class="section-curve-bg section-curve-bg--paper" aria-hidden="true">
      <svg
        viewBox="0 0 1440 1600"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M-80 330C80 128 266 88 498 136C726 184 812 188 1008 76C1214 -42 1378 24 1508 214V1600H-80Z"
        ></path>
      </svg>
    </div>
    <div class="workflow-inner">
      <div class="workflow-copy" data-reveal>
        <h2 id="operations-title" class="workflow-title">
          両製品の案内を職員が改善
        </h2>
        <p class="workflow-lead">
          SwarrowChatとSwarrowCallは、共通の知識と会話フローを利用します。制度変更や現場の気づきを一度の更新で反映し、ホームページと電話の案内を継続的に整えられます。
        </p>
        <ul class="workflow-list">
          <li>
            <strong>画面上で流れを組み替える</strong>
            <small>質問、回答、分岐、案内文を見ながら編集。</small>
          </li>
          <li>
            <strong>一度の更新を両製品へ反映</strong>
            <small>Webと電話の案内内容を同じ根拠へそろえます。</small>
          </li>
          <li>
            <strong>現場の気づきをすぐ反映</strong>
            <small>問い合わせの多い表現や不足する案内を職員が改善。</small>
          </li>
        </ul>
      </div>

      <figure class="workflow-media" data-reveal>
        <video
          class="workflow-video"
          poster="/swarrow-call/workflow-editor-alpha.png"
          muted
          loop
          playsinline
          preload="none"
          width="1280"
          height="720"
          bind:this={workflowVideo}
          class:ready={workflowVideoReady}
          aria-label="SwarrowChatとSwarrowCallの会話フローを編集する画面"
        >
          <source
            src="/swarrow-call/workflow-editor-alpha.webm"
            type="video/webm"
          >
          <img
            class="workflow-image"
            src="/swarrow-call/workflow-editor-alpha.png"
            alt="SwarrowChatとSwarrowCallの会話フローを編集する画面"
            width="1280"
            height="720"
            loading="lazy"
            decoding="async"
          >
        </video>
      </figure>
    </div>
  </section>

  {#if showCaseStudies}
    <!-- Case study: 白地。導入事例(差し替え用サンプル)。 -->
    <section id="case" class="case">
      <div
        class="section-curve-bg section-curve-bg--paper section-curve-bg--flip"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 1600"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M-80 330C80 128 266 88 498 136C726 184 812 188 1008 76C1214 -42 1378 24 1508 214V1600H-80Z"
          ></path>
        </svg>
      </div>
      <div class="case-head">
        <h2 class="case-title">導入事例と利用実績</h2>
      </div>

      <div class="case-grid">
        {#each cases as c (c.town)}
          <article class="case-card" data-reveal>
            <img
              class="case-card-photo"
              src={c.img}
              alt="{c.town}の取り組みイメージ(イメージイラスト)"
              width="1200"
              height="800"
              loading="lazy"
              decoding="async"
            >
            <div class="case-card-body">
              <span class="case-card-town">{c.town}</span>
              <h3 class="case-card-title">{c.title}</h3>
            </div>
          </article>
        {/each}
      </div>
    </section>
  {/if}

  <!-- News -->
  <section id="news" class="news">
    <div class="section-curve-bg section-curve-bg--mist" aria-hidden="true">
      <svg
        viewBox="0 0 1440 1600"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M-80 330C80 128 266 88 498 136C726 184 812 188 1008 76C1214 -42 1378 24 1508 214V1600H-80Z"
        ></path>
      </svg>
    </div>
    <div class="news-head">
      <h2 class="news-title">ニュース</h2>
      <a class="news-all" href={vectaHref("https://www.vecta.co.jp/article/")}
        >ニュース一覧</a
      >
    </div>
    <ul class="news-list">
      {#each news.slice(0, 3) as n (n.href)}
        <li class="news-item" data-reveal>
          <time class="news-date">{n.date}</time>
          <span class="news-category">{n.category}</span>
          <a class="news-text" href={vectaHref(n.href)}>{n.text}</a>
          <span class="news-go" aria-hidden="true">↗</span>
        </li>
      {/each}
    </ul>
  </section>
</main>

<style>
  #top,
  #knowledge,
  #products,
  #operations,
  #case,
  #news {
    scroll-margin-top: 5.5rem;
  }

  .ext {
    display: inline-block;
    margin-left: 0.25em;
    font-size: 0.82em;
    transform: translateY(-0.05em);
  }

  /* ===== Hero(アイソメトリック動画を中央のアートワークとして配置。動画背景と地色を合わせて継ぎ目を消す) ===== */
  .hero {
    position: relative;
    min-height: 660px;
    overflow: hidden;
    isolation: isolate;
    background: var(--bg);
  }
  .hero-media {
    position: relative;
    z-index: 1;
    display: flex;
    justify-self: stretch;
    justify-content: center;
    width: 100%;
    min-width: 0;
    transform: translateX(0);
  }
  .hero-video,
  .hero-video-fallback {
    position: relative;
    z-index: 1;
    display: block;
    width: min(1760px, 180%);
    max-width: none;
    height: auto;
    background: var(--bg);
    filter: brightness(1.055) contrast(0.99);
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
    object-fit: contain;
  }
  .hero-fade {
    display: none;
  }

  .hero-inner {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: minmax(400px, 44%) minmax(0, 1fr);
    align-items: start;
    gap: clamp(0.75rem, 2vw, 1.75rem);
    max-width: 1500px;
    min-height: 660px;
    margin: 0 auto;
    padding: 1.25rem clamp(1.2rem, 4vw, 3.5rem) 3.5rem;
  }
  .hero-copy {
    position: relative;
    z-index: 2;
    align-self: start;
    min-width: 0;
    margin-top: clamp(5.5rem, 7vw, 6.5rem);
    font-family: inherit;
  }

  .hero-title {
    margin: 0;
    color: var(--navy);
    font-family: inherit;
    font-size: 3.35rem;
    font-weight: 700;
    line-height: 1.18;
    letter-spacing: 0;
    text-wrap: balance;
  }

  /* ===== Knowledge ===== */
  .knowledge {
    --band-bg: var(--bg);

    position: relative;
    isolation: isolate;
    overflow: visible;
    margin-top: 0;
    background: transparent;
    padding: clamp(4rem, 8vw, 7rem) clamp(1.2rem, 4vw, 3.5rem)
      clamp(3rem, 7vw, 6rem);
  }
  .knowledge-inner {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: minmax(0, 1.08fr) minmax(340px, 0.92fr);
    gap: clamp(2rem, 5vw, 4.5rem);
    align-items: center;
    max-width: 1180px;
    margin: 0 auto;
  }
  .knowledge-visual {
    position: relative;
    left: clamp(2.5rem, 5vw, 4.5rem);
    justify-self: end;
    width: min(122%, 780px);
    margin: 0;
    min-width: 0;
  }
  .knowledge-video,
  .knowledge-image {
    display: block;
    width: 100%;
    height: auto;
    background: transparent;
  }
  .knowledge-copy {
    min-width: 0;
  }
  .knowledge-title {
    margin: 0;
    color: var(--sage-deep);
    font-size: clamp(1.55rem, 3vw, 2.35rem);
    font-weight: 700;
    letter-spacing: 0.06em;
    line-height: 1.55;
  }
  .knowledge-lead {
    margin: 1.2rem 0 1.6rem;
    color: var(--ink);
    font-size: clamp(0.95rem, 1.25vw, 1.05rem);
    line-height: 2;
  }
  .knowledge-flow {
    display: grid;
    gap: 0;
    margin: 0;
    padding: 0;
    list-style: none;
    border-bottom: 1px solid var(--line);
  }
  .knowledge-flow li {
    display: grid;
    grid-template-columns: 5.2rem 1fr;
    gap: 1rem;
    padding: 1rem 0;
    border-top: 1px solid var(--line);
  }
  .knowledge-flow-kicker {
    color: var(--sage-deep);
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .knowledge-flow strong,
  .knowledge-flow small {
    display: block;
  }
  .knowledge-flow strong {
    font-size: 1rem;
    line-height: 1.7;
  }
  .knowledge-flow small {
    margin-top: 0.25rem;
    color: var(--ink-soft);
    font-size: 0.88rem;
    line-height: 1.8;
  }
  /* ===== Products ===== */
  .products {
    --band-bg: var(--paper);

    position: relative;
    isolation: isolate;
    padding: clamp(4rem, 8vw, 7rem) clamp(1.2rem, 4vw, 3.5rem);
    background: transparent;
  }
  .products-inner {
    position: relative;
    z-index: 1;
    max-width: 1180px;
    margin: 0 auto;
  }
  .products-head {
    max-width: 860px;
  }
  .product-category {
    margin: 0;
    color: var(--sage-deep);
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.1em;
  }
  .products-head h2 {
    margin: 0;
    color: var(--navy);
    font-size: clamp(1.6rem, 3.2vw, 2.5rem);
    line-height: 1.5;
    white-space: nowrap;
  }
  .products-head > p:last-child {
    margin: 1rem 0 0;
    color: var(--ink-soft);
  }
  .products-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: clamp(1rem, 3vw, 2rem);
    margin-top: clamp(2rem, 5vw, 3.5rem);
  }
  .product-card {
    position: relative;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    min-height: 26rem;
    overflow: hidden;
    padding: clamp(1.5rem, 3vw, 2.2rem);
    border: 1px solid var(--line);
    border-radius: 22px;
    background: var(--paper);
    box-shadow: 0 18px 44px rgba(9, 32, 69, 0.08);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }
  .product-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 44px rgba(9, 32, 69, 0.14);
  }
  .product-card > :not(.product-card-watermark) {
    position: relative;
    z-index: 1;
  }
  .product-card-watermark {
    position: absolute;
    right: -2rem;
    bottom: 0.5rem;
    z-index: 0;
    width: min(70%, 24rem);
    height: auto;
    opacity: 0.045;
    pointer-events: none;
    user-select: none;
  }
  .product-name {
    display: flex;
    align-items: center;
    gap: clamp(0.65rem, 1.4vw, 0.9rem);
    margin-top: 0.55rem;
  }
  .product-name-icon {
    flex: 0 0 auto;
    width: clamp(2.5rem, 4vw, 3rem);
    height: auto;
  }
  .product-card h3 {
    margin: 0;
    color: var(--navy);
    font-size: clamp(1.5rem, 3vw, 2.2rem);
  }
  .product-benefit {
    margin: 1rem 0 0;
    color: var(--ink-soft);
  }
  .product-card ul {
    display: grid;
    gap: 0.5rem;
    margin: 1.2rem 0 1.5rem;
    padding-left: 1.2rem;
  }
  .product-card a {
    margin-top: auto;
    color: var(--navy);
    font-weight: 800;
  }
  .product-card .product-card-link {
    position: static;
  }
  .product-card-link::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 2;
  }
  .products-integration {
    display: grid;
    gap: 0.25rem;
    margin: 1.5rem 0 0;
    padding: 1.1rem 1.3rem;
    color: var(--navy);
    text-align: center;
  }

  /* ===== Workflow ===== */
  .feature-band {
    --band-bg: var(--bg);

    position: relative;
    isolation: isolate;
    background: transparent;
    padding: clamp(4.25rem, 7vw, 6.5rem) clamp(1.2rem, 4vw, 3.5rem);
  }
  .section-curve-bg {
    position: absolute;
    top: clamp(-4.5rem, -6vw, -2.5rem);
    left: var(--curve-left, 50%);
    z-index: 0;
    width: var(--curve-width, 100vw);
    height: calc(100% + clamp(6rem, 10vw, 9rem));
    color: var(--band-bg);
    pointer-events: none;
    transform: translateX(-50%);
  }
  .section-curve-bg svg {
    display: block;
    width: 100%;
    height: 100%;
  }
  .section-curve-bg path {
    fill: currentColor;
  }
  .section-curve-bg--flip svg {
    transform: scaleX(-1);
    transform-origin: center;
  }
  .section-curve-bg--mist {
    color: var(--bg);
  }
  .section-curve-bg--paper {
    color: var(--paper);
  }
  .feature-band > :not(.section-curve-bg) {
    position: relative;
    z-index: 1;
  }
  .feature-band + .feature-band {
    margin-top: clamp(-1.4rem, -1.8vw, -0.6rem);
    padding-top: clamp(5rem, 8vw, 7.25rem);
  }
  .feature-band--paper {
    --band-bg: var(--paper);
  }
  .feature-band--mist {
    --band-bg: var(--bg);
  }
  .feature-band--last {
    --curve-left: 52%;
    --curve-width: 124vw;

    padding-bottom: clamp(5rem, 10vw, 8.5rem);
  }
  .workflow-inner {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(340px, 0.54fr) minmax(0, 0.46fr);
    gap: clamp(2rem, 4.5vw, 4rem);
    align-items: center;
    max-width: 1900px;
    margin: 0 auto;
  }
  .workflow-copy {
    min-width: 0;
  }

  .workflow-title {
    margin: 0;
    color: var(--sage-deep);
    font-size: clamp(1.45rem, 2.8vw, 2.2rem);
    font-weight: 700;
    letter-spacing: 0.06em;
    line-height: 1.55;
  }
  .workflow-lead {
    margin: 1.2rem 0 1.5rem;
    color: var(--ink);
    font-size: clamp(0.95rem, 1.25vw, 1.05rem);
    line-height: 2;
  }
  .workflow-list {
    display: grid;
    gap: 0;
    margin: 0;
    padding: 0;
    list-style: none;
    border-bottom: 1px solid var(--line);
  }
  .workflow-list li {
    padding: 0.95rem 0;
    border-top: 1px solid var(--line);
  }
  .workflow-list strong,
  .workflow-list small {
    display: block;
  }
  .workflow-list strong {
    color: var(--sage-deep);
    font-size: 1rem;
    line-height: 1.7;
  }
  .workflow-list small {
    margin-top: 0.2rem;
    color: var(--ink-soft);
    font-size: 0.88rem;
    line-height: 1.8;
  }
  .workflow-media {
    position: relative;
    justify-self: stretch;
    align-self: center;
    min-width: 0;
    margin: 0;
    background: transparent;
    isolation: isolate;
    overflow: visible;
    width: min(114%, 960px);
    translate: clamp(-3.2rem, -2.5vw, -1.25rem) 0;
  }
  .workflow-media::before {
    content: "";
    position: absolute;
    right: -5%;
    bottom: -14%;
    left: -3%;
    z-index: 0;
    height: 80%;
    border-radius: 57% 43% 52% 48% / 58% 56% 44% 42%;
    background: radial-gradient(
      ellipse at 51% 52%,
      var(--bg) 0,
      color-mix(in srgb, var(--bg) 80%, transparent) 46%,
      color-mix(in srgb, var(--bg) 38%, transparent) 74%,
      transparent 100%
    );
    box-shadow: 0 24px 42px rgba(9, 32, 69, 0.04);
    filter: blur(3px);
    mask-image: radial-gradient(
      ellipse at 50% 54%,
      #000 0,
      #000 61%,
      rgba(0, 0, 0, 0.68) 78%,
      transparent 100%
    );
    pointer-events: none;
    transform: rotate(-1deg);
    -webkit-mask-image: radial-gradient(
      ellipse at 50% 54%,
      #000 0,
      #000 61%,
      rgba(0, 0, 0, 0.68) 78%,
      transparent 100%
    );
  }
  .workflow-media::after {
    content: "";
    position: absolute;
    right: 9%;
    bottom: -7%;
    left: 10%;
    z-index: 0;
    height: 20%;
    border-radius: 49% 51% 50% 50% / 50% 50% 54% 46%;
    background: radial-gradient(
      ellipse at 50% 58%,
      rgba(9, 32, 69, 0.105) 0,
      rgba(9, 32, 69, 0.05) 50%,
      rgba(9, 32, 69, 0) 84%
    );
    filter: blur(18px);
    opacity: 0.52;
    pointer-events: none;
    transform: rotate(0.8deg) translateY(8%);
  }
  .workflow-video,
  .workflow-image {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    background: transparent;
    filter: brightness(1.018);
    object-fit: cover;
    scale: 1.36;
    transform-origin: center;
    transition: opacity 0.18s ease;
  }
  :global(.motion) .workflow-video:not(.ready) {
    opacity: 0;
    transition: none;
  }

  /* ===== Case study ===== */
  .case {
    position: relative;
    isolation: isolate;
    background: transparent;
    margin-top: clamp(-2.1rem, -3vw, -1rem);
    padding: clamp(3rem, 8vw, 7rem) clamp(1.2rem, 4vw, 3.5rem);
  }
  .case > :not(.section-curve-bg) {
    position: relative;
    z-index: 1;
  }
  .case-head,
  .news-head {
    max-width: 1180px;
    margin: 0 auto 2.5rem;
  }
  .news-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  .news-all {
    color: var(--sc-blue);
    font-size: 14px;
    text-decoration: underline;
    text-underline-offset: 4px;
    white-space: nowrap;
  }
  .case-en,
  .case-title,
  .news-title {
    margin: 0.2rem 0 0;
    font-size: clamp(1.2rem, 2vw, 1.6rem);
    font-weight: 700;
    letter-spacing: 0.1em;
  }
  .case-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.6rem;
    max-width: 1180px;
    margin: 0 auto;
  }
  .case-card {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1.2rem;
    align-items: center;
    padding: 1rem;
    border-radius: 14px;
    border: 1px solid var(--line);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }
  .case-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 30px rgba(9, 32, 69, 0.1);
  }
  .case-card-photo {
    width: 100%;
    height: auto;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    border-radius: 10px;
  }
  .case-card-town {
    display: inline-block;
    margin-bottom: 0.4rem;
    padding: 0.2rem 0.7rem;
    border-radius: 999px;
    background: var(--sage-light);
    color: var(--sage-deep);
    font-size: 0.8rem;
    font-weight: 700;
  }
  .case-card-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.7;
  }
  /* ===== News ===== */
  .news {
    position: relative;
    isolation: isolate;
    margin-top: clamp(-2.2rem, -3vw, -1rem);
    background: transparent;
    padding: clamp(4.5rem, 9vw, 7rem) clamp(1.2rem, 4vw, 3.5rem)
      clamp(3rem, 8vw, 6rem);
  }
  .news > :not(.section-curve-bg) {
    position: relative;
    z-index: 1;
  }
  .news-list {
    list-style: none;
    margin: 0 auto;
    padding: 0;
    max-width: 1180px;
  }
  .news-item {
    display: grid;
    grid-template-columns: auto auto 1fr auto;
    gap: 1.5rem;
    align-items: baseline;
    padding: 1.3rem 0.4rem;
    border-bottom: 1px solid var(--line);
  }
  .news-date {
    font-weight: 700;
    font-size: 0.9rem;
    color: var(--sage-deep);
    white-space: nowrap;
  }
  .news-text {
    font-size: 0.95rem;
  }
  .news-category {
    width: fit-content;
    color: var(--ink-soft);
    font-size: 0.75rem;
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 3px 9px;
    white-space: nowrap;
  }
  .news-go {
    color: var(--ink-soft);
  }

  /* ===== CTA ===== */

  /* ===== Responsive ===== */
  @media (max-width: 1240px) {
    .workflow-inner {
      grid-template-columns: minmax(0, 0.5fr) minmax(0, 0.5fr);
    }
    .workflow-media {
      width: 100%;
      transform: none;
      translate: 0 0;
    }
    .workflow-video,
    .workflow-image {
      scale: 1.2;
    }
  }

  @media (max-width: 860px) {
    .hero {
      min-height: auto;
    }
    .hero-inner {
      grid-template-columns: minmax(0, 1fr);
      justify-items: center;
      text-align: center;
      width: 100%;
      box-sizing: border-box;
      min-height: auto;
      align-items: center;
      padding: 2rem clamp(1.2rem, 4vw, 3.5rem) 3rem;
    }
    .hero-copy {
      height: auto;
      margin-top: 0;
    }
    .hero-media {
      width: 100%;
      margin-top: 1.25rem;
      transform: none;
    }
    .hero-video,
    .hero-video-fallback {
      width: min(1240px, 190vw);
    }
    .hero-title {
      font-size: clamp(2.35rem, 10vw, 3.1rem);
    }

    .products-grid {
      grid-template-columns: 1fr;
    }
    .product-card {
      min-height: 0;
    }
    .product-card-watermark {
      right: -1.5rem;
      bottom: -0.25rem;
      width: min(76%, 20rem);
    }
    .knowledge {
      margin-top: 0;
      background: var(--band-bg);
      padding-top: clamp(2.5rem, 8vw, 3.5rem);
    }
    .feature-band {
      padding: clamp(3rem, 9vw, 4.75rem) clamp(1.2rem, 4vw, 3.5rem);
      padding-bottom: clamp(5.75rem, 18vw, 7.25rem);
    }
    .section-curve-bg {
      top: -3rem;
      width: var(--curve-width, 132vw);
      height: calc(100% + 4.5rem);
    }
    .feature-band,
    .products,
    .knowledge,
    .case,
    .news {
      background: var(--band-bg, var(--paper));
    }
    .case {
      --band-bg: var(--paper);
    }
    .news {
      --band-bg: var(--bg);
    }
    .section-curve-bg {
      display: none;
    }
    .feature-band::before,
    .products::before,
    .knowledge::before,
    .case::before,
    .news::before {
      position: absolute;
      top: clamp(-3rem, -9vw, -2.1rem);
      left: 50%;
      z-index: 0;
      width: 170vw;
      height: clamp(5.5rem, 22vw, 7.5rem);
      border-radius: 50%;
      background: var(--band-bg, var(--paper));
      content: "";
      pointer-events: none;
      transform: translateX(-50%);
    }
    .feature-band > :not(.section-curve-bg),
    .products > :not(.section-curve-bg),
    .knowledge > :not(.section-curve-bg),
    .case > :not(.section-curve-bg),
    .news > :not(.section-curve-bg) {
      position: relative;
      z-index: 2;
    }
    .feature-band + .feature-band {
      margin-top: 0;
      padding-top: clamp(4.25rem, 11vw, 5.75rem);
    }
    .feature-band--last {
      --curve-left: 54%;
      --curve-width: 148vw;

      padding-bottom: clamp(6.5rem, 18vw, 8rem);
    }
    .knowledge-visual {
      left: auto;
      justify-self: stretch;
      width: 100%;
    }
    .workflow-media {
      width: 100%;
      transform: none;
    }
    .workflow-video,
    .workflow-image {
      scale: 1.08;
    }
    .knowledge-inner,
    .workflow-inner,
    .case-grid {
      grid-template-columns: 1fr;
    }
    .knowledge-inner,
    .workflow-inner {
      row-gap: 0;
    }
    .knowledge-copy,
    .workflow-copy {
      display: contents;
    }
    .knowledge-en,
    .knowledge-title,
    .workflow-title {
      order: 2;
    }
    .knowledge-visual,
    .workflow-media {
      order: 3;
      margin-top: clamp(1.1rem, 5vw, 1.7rem);
      margin-bottom: clamp(1.2rem, 5vw, 1.9rem);
    }
    .knowledge-lead,
    .workflow-lead {
      order: 4;
      margin-top: 0;
    }
    .knowledge-flow,
    .workflow-list {
      order: 5;
    }
    .knowledge-flow li {
      grid-template-columns: 1fr;
      gap: 0.35rem;
    }
    .case-card {
      grid-template-columns: 1fr;
      gap: 0.9rem;
    }
    .case-card-body {
      order: 1;
    }
    .case-card-photo {
      order: 2;
    }
    .case {
      margin-top: 0;
      padding-top: clamp(4rem, 10vw, 5rem);
      padding-bottom: clamp(5.75rem, 18vw, 7.5rem);
    }
    .news {
      margin-top: 0;
      padding-top: clamp(4rem, 10vw, 5.5rem);
    }
    .news-item {
      grid-template-columns: 1fr;
      gap: 0.4rem;
    }
    .news-go {
      display: none;
    }
  }

  @media (max-width: 600px) {
    .products-head h2 {
      font-size: clamp(0.8rem, calc(4.7vw - 0.15rem), 1.6rem);
    }
  }

  @media (max-width: 480px) {
    .hero-title {
      font-size: 2.12rem;
    }
  }
</style>
