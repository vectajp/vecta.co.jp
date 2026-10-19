<script lang="ts">
  import { setContext } from "svelte";
  import ContactModal from "$lib/swarrow/ContactModal.svelte";
  import { companyOverviewLink, navItems } from "$lib/swarrow/content";
  import { vectaHref } from "$lib/swarrow/links";

  const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
  const companyHref = vectaHref(companyOverviewLink.href);

  let { children } = $props();

  const isBrowser = typeof window !== "undefined";

  let scrolled = $state(false);
  let reducedMotion = $state(
    isBrowser ? window.matchMedia(REDUCED_MOTION_QUERY).matches : false,
  );
  let motion = $state(false);
  let contactModalOpen = $state(false);
  const openContactModal = () => {
    contactModalOpen = true;
  };
  const closeContactModal = () => {
    contactModalOpen = false;
  };

  setContext("swarrow-download-modal", { openContactModal });
  setContext("swarrow-motion", { isReducedMotion: () => reducedMotion });

  $effect(() => {
    motion = !reducedMotion;
  });

  $effect(() => {
    const onScroll = () => {
      scrolled = window.scrollY > 40;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });

  const currentYear = new Date().getFullYear();
</script>

<svelte:head>
  <link rel="icon" type="image/png" sizes="120x120" href="/swarrow/icon.png">
</svelte:head>

<div class="lp" class:motion={motion}>
  <!-- Header: 透過ヘッダー。スクロールで薄い地を敷く。 -->
  <header class="sc-header" class:scrolled={scrolled}>
    <a class="brand" href="/#top" aria-label="Swarrow トップへ">
      <img
        class="brand-mark"
        src="/swarrow/icon.png"
        alt=""
        width="120"
        height="120"
        decoding="async"
      >
      <span class="brand-name">Swarrow</span>
    </a>

    <nav class="sc-nav" aria-label="グローバルナビゲーション">
      {#each navItems as item (item.label)}
        <a
          class="sc-nav-link"
          href={item === companyOverviewLink ? companyHref : item.href}
        >
          {item.label}
        </a>
      {/each}
    </nav>
  </header>

  {@render children()}

  <footer id="footer" class="vecta-footer">
    <div class="vecta-footer-inner">
      <div class="vecta-footer-content">
        <div class="vecta-footer-brand">
          <a
            class="vecta-footer-logo-link"
            href="https://www.vecta.co.jp"
            aria-label="Vectaのウェブサイトへ"
          >
            <img
              src="/vecta/logo_horizontal.svg"
              alt="Vecta"
              width="300"
              height="100"
              decoding="async"
            >
          </a>
        </div>
        <address class="vecta-footer-address">
          〒150-0002<br>
          東京都渋谷区渋谷2-19-15<br>
          宮益坂ビルディング609
        </address>
      </div>
      <p class="vecta-footer-privacy">
        <a href="/privacy/">プライバシーについて</a>
      </p>
      <p class="vecta-footer-copy">
        © {currentYear} Vecta. All rights reserved.
      </p>
    </div>
  </footer>

  <ContactModal open={contactModalOpen} onClose={closeContactModal} />
</div>

<style>
  :global(:root) {
    --sc-navy: #092045;
    --sc-orange: #e69500;
    --sc-orange-hover: #f3ac27;
    --sc-blue: #2366b5;
    --sc-diagram-green: #78a966;
    --sc-text-secondary: #42536b;
    --sc-bg-light: #edf7ff;
    --sc-bg-card: #fff;
    --sc-border: #d9e4ef;
    --sc-shadow: rgba(9, 32, 69, 0.1);
  }
  :global(body) {
    margin: 0;
    background: var(--sc-bg-card);
    font-family: "Noto Sans JP", sans-serif;
  }
  :global(button),
  :global(input),
  :global(textarea),
  :global(select) {
    font: inherit;
  }

  .lp {
    --bg: #f4f4f6;
    --ink: #333;
    --ink-soft: #5a5f63;
    --paper: #fff;
    --sage: #c6d0dc;
    --sage-light: #e4e9f0;
    --sage-deep: #092045;
    --curve-sage: #e5eef5;
    --navy: #092045;
    --navy-deep: #061936;
    --line: rgba(51, 51, 51, 0.14);
    --coral: #e07a66;

    background: var(--bg);
    color: var(--ink);
    line-height: 1.9;
    -webkit-font-smoothing: antialiased;
    overflow-x: clip;
  }

  .lp :global(:where(a)) {
    color: inherit;
    text-decoration: none;
  }
  .lp :global(:where(a, button):focus-visible) {
    outline: 3px solid color-mix(in srgb, var(--coral) 72%, white);
    outline-offset: 4px;
    border-radius: 6px;
  }
  #footer {
    scroll-margin-top: 5.5rem;
  }

  /* ===== Header ===== */
  .sc-header {
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    background: var(--sc-bg-card);
    padding: 12px 5.25%;
    transition:
      background 0.3s ease,
      box-shadow 0.3s ease;
  }
  .sc-header.scrolled {
    background: var(--sc-bg-card);
    backdrop-filter: blur(10px);
    box-shadow: 0 1px 0 var(--line);
  }
  .brand {
    margin-right: auto;
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    flex: 0 0 auto;
  }
  .brand-mark {
    display: block;
    width: 2.5rem;
    height: 2.5rem;
  }
  .brand-name {
    color: var(--navy);
    font-size: clamp(1.5rem, 2vw, 2.1rem);
    font-weight: 800;
    letter-spacing: 0.02em;
    line-height: 1;
  }
  .sc-nav {
    display: flex;
    align-items: center;
    gap: clamp(0.8rem, 2vw, 1.9rem);
  }
  .sc-nav-link {
    font-size: 0.95rem;
    font-weight: 600;
    white-space: nowrap;
  }
  .sc-nav-link:hover {
    color: var(--sage-deep);
  }

  /* ===== Footer ===== */
  .vecta-footer {
    background: var(--navy);
    color: #fff;
    padding: clamp(3rem, 6vw, 4.5rem) clamp(1.2rem, 4vw, 3.5rem) 1rem;
  }
  .vecta-footer-inner {
    max-width: 1180px;
    margin: 0 auto;
  }
  .vecta-footer-content {
    display: grid;
    gap: 2rem;
    margin-bottom: 2rem;
  }
  .vecta-footer-logo-link {
    display: inline-block;
    border-radius: 0.25rem;
  }
  .vecta-footer-logo-link:focus-visible {
    outline: 3px solid rgba(255, 255, 255, 0.72);
    outline-offset: 0.35rem;
  }
  .vecta-footer-brand img {
    display: block;
    width: 150px;
    height: auto;
    margin-bottom: 0.75rem;
    filter: brightness(0) invert(1);
  }
  .vecta-footer-address {
    margin: 0;
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.95rem;
    font-style: normal;
    line-height: 1.75;
  }
  .vecta-footer-privacy {
    margin: 0 0 0.75rem;
    text-align: center;
  }
  .vecta-footer-privacy a {
    color: inherit;
    font-size: 0.84rem;
  }
  .vecta-footer-copy {
    margin: 0;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.58);
    font-size: 0.9rem;
    text-align: center;
  }

  /* ===== Reveal(JS+モーション時のみ) =====
                                             [data-reveal] 要素自体は子ページ(+page.svelte 等)のテンプレートにのみ
                                             存在するため、Svelte のスタイルスコープが自コンポーネントの実在要素
                                             にしか適用されない制約を回避する目的でセレクタ全体を :global() 化する。 */
  :global(.motion [data-reveal]) {
    opacity: 0;
    transform: translateY(20px);
    transition:
      opacity 0.7s ease,
      transform 0.7s ease;
  }
  :global(.motion [data-reveal].is-in) {
    opacity: 1;
    transform: none;
  }

  /* ===== Responsive ===== */
  @media (min-width: 769px) {
    .vecta-footer-content {
      grid-template-columns: 1fr auto;
      align-items: start;
      gap: 4rem;
    }
    .vecta-footer-address {
      text-align: right;
    }
  }

  @media (max-width: 860px) {
    .sc-header {
      flex-wrap: wrap;
      gap: 4px;
      padding: 8px 20px;
    }
    .brand-mark {
      width: 26px;
      height: 26px;
    }
    .sc-nav {
      display: flex;
      order: 3;
      width: 100%;
      justify-content: space-between;
      gap: 10px;
    }
    .sc-nav-link {
      font-size: 12px;
      padding: 2px 0;
      line-height: 1.4;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .lp :global(*),
    .lp :global(*)::before,
    .lp :global(*)::after {
      animation-duration: 0.01ms;
      animation-iteration-count: 1;
      scroll-behavior: auto;
      transition-duration: 0.01ms;
    }
  }
</style>
