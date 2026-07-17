<script lang="ts">
  import { navItems } from './content'

  const year = new Date().getFullYear()
  const hrefFor = (href: string) => (href.startsWith('#') ? `/${href}` : href)
</script>

<footer class="site-footer">
  <div class="container">
    <div class="footer-content">
      <div class="footer-brand">
        <img
          src="/assets/logo_horizontal_inverted.svg"
          alt="Vecta"
          width="1030"
          height="365"
          loading="lazy"
          decoding="async"
        >
        <p>まちの知識を、未来へつなぐ。</p>
      </div>

      <nav class="footer-nav" aria-label="フッターナビゲーション">
        <h3>サイトマップ</h3>
        <ul>
          {#each navItems as item (item.href)}
            <li>
              <a href={hrefFor(item.href)}>{item.label}</a>
            </li>
          {/each}
          <li>
            <a href="/privacy/">プライバシーについて</a>
          </li>
        </ul>
      </nav>
    </div>

    <p class="copyright">&copy; {year} Vecta. All rights reserved.</p>
  </div>
</footer>

<style>
  .site-footer {
    background-color: var(--color-indigo);
    color: var(--color-white);
    padding: var(--section-padding-tablet) 0 1rem;
  }

  .footer-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .footer-brand img {
    display: block;
    width: 150px;
    height: auto;
    margin-bottom: 0.75rem;
  }

  .footer-brand p {
    color: rgba(255, 255, 255, 0.72);
    font-family: var(--font-monospace);
    font-size: 0.95rem;
    margin: 0;
  }

  .footer-nav h3 {
    color: rgba(255, 255, 255, 0.92);
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .footer-nav ul {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.55rem 1.25rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .footer-nav a {
    color: rgba(255, 255, 255, 0.7);
  }

  .footer-nav a:hover,
  .footer-nav a:focus-visible {
    color: var(--color-amber-soft);
  }

  .copyright {
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.58);
    font-size: 0.9rem;
    margin: 0;
    padding-top: 1rem;
    text-align: center;
  }

  @media (min-width: 769px) {
    .footer-content {
      grid-template-columns: 1fr auto;
      align-items: start;
      gap: 4rem;
    }

    .footer-nav ul {
      grid-template-columns: repeat(3, minmax(7rem, auto));
    }
  }
</style>
