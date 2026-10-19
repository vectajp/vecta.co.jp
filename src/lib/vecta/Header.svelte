<script lang="ts">
  import { navItems } from './content'
  import { siteHref } from './links'
</script>
<header class="site-header">
  <div class="container header-content">
    <a class="brand" href="/" aria-label="Vecta トップページへ"
      ><img
        src="/assets/logo_horizontal.svg"
        alt="Vecta"
        width="1030"
        height="365"
      ></a
    >
    <nav class="site-nav" aria-label="グローバルナビゲーション">
      {#each navItems as item (item.href)}
        <a href={siteHref(item.href)}>{item.label}</a>
      {/each}
    </nav>
  </div>
</header>
<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 20;
    background: var(--color-white);
    border-bottom: 1px solid var(--color-line);
  }
  .header-content {
    display: flex;
    align-items: center;
    gap: 32px;
    min-height: 84px;
  }
  .brand {
    margin-right: auto;
    display: flex;
  }
  .brand img {
    display: block;
    width: 150px;
    height: auto;
  }
  .site-nav {
    display: flex;
    align-items: center;
    gap: 28px;
  }
  .site-nav a {
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
  }
  @media (max-width: 800px) {
    .header-content {
      gap: 12px;
      flex-wrap: wrap;
      padding-top: 12px;
      padding-bottom: 12px;
    }
    .brand img {
      width: 114px;
    }
    .site-nav {
      order: 3;
      width: 100%;
      justify-content: space-between;
      gap: 12px;
    }
    .site-nav a {
      font-size: 12px;
      padding: 8px 0;
    }
  }
</style>
