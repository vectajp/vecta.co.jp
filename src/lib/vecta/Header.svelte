<script lang="ts">
  import { navItems } from './content'

  const hrefFor = (href: string) => (href.startsWith('#') ? `/${href}` : href)
</script>

<header class="site-header">
  <div class="container">
    <div class="header-content">
      <a class="brand" href="/" aria-label="Vecta トップページへ">
        <img
          src="/assets/logo_horizontal.svg"
          alt="Vecta"
          width="1030"
          height="365"
          loading="eager"
          decoding="async"
        >
      </a>

      <nav class="site-nav" aria-label="グローバルナビゲーション">
        {#each navItems as item (item.href)}
          <a class="nav-link" href={hrefFor(item.href)}>{item.label}</a>
        {/each}
      </nav>
    </div>
  </div>
</header>

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 20;
    width: 100%;
    background: rgba(251, 250, 247, 0.9);
    border-bottom: 1px solid var(--color-line);
    backdrop-filter: blur(18px);
  }

  .header-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 0;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .brand img {
    display: block;
    width: 132px;
    height: auto;
  }

  .site-nav {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    gap: 0.35rem;
    max-width: min(100%, calc(100vw - 11rem));
    overflow-x: auto;
    scrollbar-width: none;
  }

  .site-nav::-webkit-scrollbar {
    display: none;
  }

  .nav-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    flex: 0 0 auto;
    min-height: 2.25rem;
    padding: 0.45rem 0.65rem;
    border: 1px solid transparent;
    border-radius: 999px;
    color: var(--color-indigo-darker);
    font-family: var(--font-secondary);
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0;
  }

  .nav-link::after {
    content: "";
    position: absolute;
    left: 0.65rem;
    right: 0.65rem;
    bottom: 0.35rem;
    height: 2px;
    background: var(--color-gold);
    border-radius: 999px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .nav-link:hover,
  .nav-link:focus-visible {
    background: rgba(47, 111, 237, 0.08);
    border-color: rgba(47, 111, 237, 0.16);
    color: var(--color-indigo);
  }

  .nav-link:hover::after,
  .nav-link:focus-visible::after {
    opacity: 1;
  }

  @media (min-width: 769px) {
    .header-content {
      gap: 2rem;
      padding: 0.9rem 0;
    }

    .brand img {
      width: 154px;
    }

    .site-nav {
      gap: 0.25rem;
      max-width: none;
    }

    .nav-link {
      padding: 0.5rem 0.82rem;
      font-size: 0.9rem;
    }
  }
</style>
