<script lang="ts">
  import { site } from '$lib/vecta/content'
  import Footer from '$lib/vecta/Footer.svelte'
  import Header from '$lib/vecta/Header.svelte'
  import { buildPageSeo } from '$lib/vecta/seo'

  const seo = buildPageSeo({
    title: 'プライバシーについて',
    description: '株式会社Vectaの Google Analytics 利用に関するご案内です。',
    path: '/privacy/',
  })
</script>

<svelte:head>
  <title>{seo.title}</title>
  <meta name="description" content={seo.description}>
  <meta name="keywords" content={site.keywords}>
  <link rel="canonical" href={seo.canonical}>
  <meta name="robots" content="noindex">
</svelte:head>

<Header />

<main>
  <section class="privacy">
    <div class="container privacy-content">
      <p class="eyebrow">Privacy</p>
      <h1>プライバシーについて</h1>
      <p>
        株式会社Vectaは、当サイトの利用状況を把握し、内容や導線を改善するために
        Google Analytics 4 を利用しています。
      </p>

      <h2>収集される情報</h2>
      <p>
        Google Analytics 4 は Cookie
        等を利用して、閲覧したページ、利用した端末・ブラウザ、アクセス元などの利用状況を収集・処理します。当サイトでは、問い合わせフォームの入力内容、User
        ID、Google Ads 連携、リマーケティング、独自イベント計測は Google
        Analytics に送信しません。
      </p>

      <h2>Google による情報の利用</h2>
      <p>Google による情報の収集・利用については、以下をご確認ください。</p>
      <ul>
        <li>
          <a href="https://policies.google.com/technologies/partner-sites?hl=ja"
            >Google のサービスを使用するサイトやアプリから収集した情報の Google
            による使用</a
          >
        </li>
        <li>
          <a href="https://tools.google.com/dlpage/gaoptout?hl=ja"
            >Google Analytics Opt-out Browser Add-on</a
          >
        </li>
      </ul>
    </div>
  </section>
</main>

<Footer />

<style>
  .privacy {
    background: var(--color-paper);
    padding: 4rem 0 5rem;
  }

  .privacy-content {
    max-width: 760px;
  }

  .eyebrow {
    color: var(--color-vector-blue);
    font-family: var(--font-monospace);
    font-size: 0.82rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    text-transform: uppercase;
  }

  h1,
  h2 {
    color: var(--color-indigo);
  }

  h1 {
    font-size: 2.35rem;
    line-height: 1.2;
    margin: 0 0 2rem;
  }

  h2 {
    font-size: 1.35rem;
    margin: 2.5rem 0 0.75rem;
  }

  p,
  li {
    color: var(--color-sumi);
    line-height: 1.9;
  }

  ul {
    padding-left: 1.4rem;
  }

  a {
    color: var(--color-vector-blue);
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 0.18em;
  }

  @media (min-width: 769px) {
    .privacy {
      padding: 5rem 0 6rem;
    }

    h1 {
      font-size: 3rem;
    }
  }
</style>
