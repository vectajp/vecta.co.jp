<script lang="ts">
  import { site, siteName } from "$lib/swarrow/content";
</script>

<svelte:head>
  <title>プライバシーについて | {siteName}</title>
  <meta
    name="description"
    content="Swarrow の Google Analytics 利用に関するご案内です。"
  >
  <link rel="canonical" href={`${site}/privacy/`}>
  <meta name="robots" content="noindex">
</svelte:head>

<main class="privacy-page">
  <a class="brand" href="/" aria-label="Swarrow トップへ">Swarrow</a>
  <article>
    <p class="eyebrow">Privacy</p>
    <h1>プライバシーについて</h1>
    <p>
      株式会社Vectaは、Swarrow
      サイトの利用状況を把握し、内容や導線を改善するために Google Analytics 4
      を利用しています。
    </p>

    <h2>収集される情報</h2>
    <p>
      Google Analytics 4 は Cookie
      等を利用して、閲覧したページ、利用した端末・ブラウザ、アクセス元などの利用状況を収集・処理します。当サイトでは、資料請求フォームの入力内容、User
      ID、Google Ads 連携、リマーケティング、独自イベント計測は Google Analytics
      に送信しません。
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
  </article>
</main>

<style>
  :global(body) {
    margin: 0;
    background: #f4f4f6;
    color: #333;
    font-family: inherit;
  }

  .privacy-page {
    box-sizing: border-box;
    max-width: 760px;
    min-height: calc(100vh - 5rem);
    margin: 0 auto;
    padding: 2rem 1.25rem 4rem;
  }

  .brand {
    color: #333;
    font-family: Montserrat, sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    text-decoration: none;
  }

  article {
    margin-top: 4rem;
  }

  .eyebrow {
    color: #5a5f63;
    font-family: Montserrat, sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1,
  h2 {
    color: #333;
  }

  h1 {
    font-size: clamp(2rem, 7vw, 3rem);
    line-height: 1.2;
    margin: 0.5rem 0 2rem;
  }

  h2 {
    font-size: 1.25rem;
    margin-top: 2.5rem;
  }

  p,
  li {
    line-height: 1.9;
  }

  ul {
    padding-left: 1.25rem;
  }

  a {
    color: inherit;
  }

  article a {
    color: #315f66;
    font-weight: 700;
  }
</style>
