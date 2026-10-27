<script lang="ts">
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import Building from "@lucide/svelte/icons/building-2";
  import ChartColumn from "@lucide/svelte/icons/chart-column";
  import FileCheck from "@lucide/svelte/icons/file-check";
  import FileText from "@lucide/svelte/icons/file-text";
  import Globe from "@lucide/svelte/icons/globe";
  import Laptop from "@lucide/svelte/icons/laptop";
  import MessageSquare from "@lucide/svelte/icons/message-square";
  import Settings from "@lucide/svelte/icons/settings";
  import {
    chatCustomerSuccessSteps,
    chatNews,
    pageDescription,
    productJsonLd,
    products,
    site,
    siteName,
    siteOgImage,
  } from "$lib/swarrow/content";
  import InquiryForm from "$lib/swarrow/InquiryForm.svelte";
  import { vectaHref } from "$lib/swarrow/links";

  const product = products.find((item) => item.id === "chat");
  const pageTitle = "SwarrowChat｜自治体ホームページ AIチャットボット";
  const canonicalUrl = `${site}/chat`;
  const ogImage = product?.ogImage ?? siteOgImage;
  const latestNews = chatNews.slice(0, 3);
  const highlightedNews = latestNews[0];
  const steps = [
    {
      title: "ホームページ・PDFを取得",
      body: "公式ホームページや電子申請ページ、PDFをまとめて取り込みます。対象にするURLや取得範囲を設定できます。",
    },
    {
      title: "資料の内容を整理",
      body: "見出し・本文・表のまとまりを読み取り、制度や手続きの情報を整理します。必要に応じて内容を確認・調整できます。",
    },
    {
      title: "回答用データに登録",
      body: "整理した情報を参照元URLとともに登録します。複数のページや資料をまとめて回答に使える状態にします。",
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

  {@html `<script type="application/ld+json">${JSON.stringify(productJsonLd("chat"))}</script>`}
</svelte:head>

{#snippet arrow()}
  <ArrowRight size={22} stroke-width={1.8} aria-hidden="true" />
{/snippet}
<main class="chat-page">
  <section class="chat-hero" aria-labelledby="chat-title">
    <picture class="hero-landscape">
      <source
        media="(max-width: 860px)"
        srcset="/swarrow-chat/hero-civic-mobile.webp"
      >
      <img
        src="/swarrow-chat/hero-civic-desktop.webp"
        alt=""
        width="1986"
        height="792"
        fetchpriority="high"
      >
    </picture>
    <div class="chat-container hero-grid">
      <div class="hero-copy">
        <h1 id="chat-title">
          <span>自治体ホームページ</span><span>AIチャットボット</span>
        </h1>
        <p class="product-name">
          <img
            src="/swarrow/icon.png"
            alt=""
            width="120"
            height="120"
          >SwarrowChat
        </p>
      </div>
      <figure class="hero-screen" id="screen">
        <img
          src="/swarrow-chat/sample-chat-balanced.webp"
          alt="引っ越しの手続きに回答するSwarrowChatの実画面"
          width="800"
          height="740"
          fetchpriority="high"
        >
      </figure>
    </div>
  </section>
  {#if highlightedNews}
    <div class="news-strip chat-container">
      <span class="news-strip-label">ニュース</span>
      <time datetime={highlightedNews.date.replaceAll(".", "-")}
        >{highlightedNews.date}</time
      >
      <a href={vectaHref(highlightedNews.href)}
        >{highlightedNews.text} {@render arrow()}</a
      >
    </div>
  {/if}
  <section
    id="data"
    class="steps-section chat-container"
    aria-labelledby="steps-title"
  >
    <h2 id="steps-title">公式情報の取り込み</h2>
    <div class="ingestion-grid">
      <ol class="journey">
        {#each steps as step, index (step.title)}
          <li>
            <span class="data-step-number" aria-hidden="true"
              >0{index + 1}</span
            >
            <div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </li>
        {/each}
      </ol>
      <figure class="ingestion-visual">
        <img
          src="/swarrow-chat/information-ingestion.webp"
          alt="ホームページ・電子申請ページ・PDFなどの情報を回答用データベースへ集める仕組みの図"
          width="1693"
          height="929"
          loading="lazy"
        >
      </figure>
    </div>
  </section>
  <section
    id="updates"
    class="updates-section chat-container feature-grid"
    aria-labelledby="updates-title"
  >
    <div class="feature-copy">
      <h2 id="updates-title">
        <span>ホームページの</span><span>最新情報を定期取得</span>
      </h2>
      <p>
        公式ホームページを定期的に再取得し、SwarrowChatの回答用データに最新の内容を反映します。情報の更新頻度に合わせて、日次・週次・月次などの取得間隔を設定できます。
      </p>
      <table class="refresh-sources">
        <caption>
          取得間隔の設定例
        </caption>
        <thead>
          <tr>
            <th scope="col">対象情報</th>
            <th scope="col">取得の間隔</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">お知らせ・募集</th>
            <td>日次</td>
          </tr>
          <tr>
            <th scope="row">制度・手続き</th>
            <td>週次・月次</td>
          </tr>
          <tr>
            <th scope="row">重点ページ</th>
            <td>必要に応じて再取得</td>
          </tr>
        </tbody>
      </table>
    </div>
    <figure class="refresh-visual">
      <img
        src="/swarrow-chat/information-refresh.webp"
        alt="公式ホームページの情報を設定した間隔で取得し、SwarrowChatの回答用データへ反映する仕組みの図"
        width="1536"
        height="1024"
        loading="lazy"
      >
      <figcaption>
        <span>公式ホームページ</span><span>定期取得</span
        ><span>回答用データ</span>
      </figcaption>
    </figure>
  </section>
  <section
    class="answer-section chat-container feature-grid"
    aria-labelledby="answer-title"
  >
    <figure class="answer-screen">
      <img
        src="/swarrow-chat/sample-chat-wide.webp"
        alt="回答と参照元を確認できるSwarrowChatの実画面"
        width="980"
        height="760"
        loading="lazy"
      >
    </figure>
    <div class="feature-copy">
      <h2 id="answer-title">公式情報をもとに回答</h2>
      <p>
        自治体のホームページや資料から、質問に関連する情報を探して回答します。根拠となるページも、その場で確認できます。
      </p>
      <ul class="use-case-list">
        <li>
          <span class="use-case-icon"
            ><FileText size={24} stroke-width={1.8} aria-hidden="true" /></span
          >引っ越しの手続き
        </li>
        <li>
          <span class="use-case-icon"
            ><FileCheck size={24} stroke-width={1.8} aria-hidden="true" /></span
          >証明書や必要書類
        </li>
        <li>
          <span class="use-case-icon"
            ><Building size={24} stroke-width={1.8} aria-hidden="true" /></span
          >制度や施設の案内
        </li>
        <li>
          <span class="use-case-icon"
            ><Laptop size={24} stroke-width={1.8} aria-hidden="true" /></span
          >電子申請への案内
        </li>
      </ul>
    </div>
  </section>
  <section
    id="languages"
    class="languages-section chat-container feature-grid"
    aria-labelledby="languages-title"
  >
    <figure
      class="multilingual-visual"
      aria-label="日本語の公式情報をもとに多言語で案内する仕組みの図"
    >
      <div class="language-source">
        <Globe size={48} stroke-width={1.4} aria-hidden="true" />
        <strong>日本語の公式情報</strong>
        <span>ホームページ・資料</span>
      </div>
      <ArrowRight
        class="language-arrow"
        size={30}
        stroke-width={1.5}
        aria-hidden="true"
      />
      <ul class="language-options" aria-label="回答言語の例">
        <li>日本語</li>
        <li lang="en">English</li>
        <li lang="zh">中文</li>
        <li lang="ko">한국어</li>
      </ul>
    </figure>
    <div class="feature-copy">
      <h2 id="languages-title">多言語で案内</h2>
      <p>
        日本語の公式情報をもとに、質問に使われた言語に合わせて回答します。窓口の運用に合わせ、利用する言語や回答言語を設定できます。
      </p>
    </div>
  </section>
  <section class="voice-section" aria-labelledby="voice-title">
    <div class="chat-container voice-grid">
      <div class="feature-copy">
        <h2 id="voice-title">音声でも相談</h2>
        <p>
          アバターと話しながら質問できます。文字を入力するチャットと、音声での会話を切り替えて使えます。
        </p>
      </div>
      <figure class="voice-visual">
        <img
          class="voice-scene"
          src="/swarrow-chat/voice-scene.webp"
          alt="スマートフォンに話しかけて相談する利用場面のイラスト"
          width="1983"
          height="793"
          loading="lazy"
        >
        <img
          class="voice-screen"
          src="/swarrow-chat/sample-avatar.webp"
          alt="SwarrowChatの音声会話の待機画面"
          width="480"
          height="611"
          loading="lazy"
        >
      </figure>
    </div>
  </section>
  <section
    class="operations-section chat-container feature-grid"
    aria-labelledby="operations-title"
  >
    <figure class="improvement-visual">
      <img
        src="/swarrow-chat/information-improvement.webp"
        alt="問い合わせの記録と評価を確認し、参照情報と回答用データの改善につなげる流れの図"
        width="1672"
        height="941"
        loading="lazy"
      >
    </figure>
    <div class="feature-copy">
      <h2 id="operations-title">回答を確認して改善</h2>
      <ol class="operations-list">
        <li>
          <span class="operation-icon"
            ><MessageSquare
              size={23}
              stroke-width={1.8}
              aria-hidden="true"
            /></span
          >
          <h3>質問履歴を確認</h3>
          <p>
            寄せられた質問や回答から、よくある問い合わせと案内の不足を把握します。
          </p>
        </li>
        <li>
          <span class="operation-icon"
            ><ChartColumn
              size={23}
              stroke-width={1.8}
              aria-hidden="true"
            /></span
          >
          <h3>評価を集める</h3>
          <p>回答に対する利用者の評価をもとに、見直すべき内容を確認します。</p>
        </li>
        <li>
          <span class="operation-icon"
            ><Settings size={23} stroke-width={1.8} aria-hidden="true" /></span
          >
          <h3>参照情報を見直す</h3>
          <p>資料や回答ルールを更新し、公開後も案内の内容を改善します。</p>
        </li>
      </ol>
    </div>
  </section>
  <section id="support" class="support-section" aria-labelledby="support-title">
    <div class="chat-container">
      <h2 id="support-title">導入から運用まで支援</h2>
      <ol class="support-steps">
        {#each chatCustomerSuccessSteps as step (step.phase)}
          <li>
            <span class="step-number">0{step.phase}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </li>
        {/each}
      </ol>
    </div>
  </section>
  <section
    id="news"
    class="chat-container information-section news-section"
    aria-labelledby="news-title"
  >
    <div class="news-heading">
      <h2 id="news-title">ニュース</h2>
      <a class="news-all" href={vectaHref("https://www.vecta.co.jp/article/")}
        >ニュース一覧</a
      >
    </div>
    <ul class="news-list">
      {#each latestNews as item (item.href)}
        <li>
          <div class="news-meta">
            <time>{item.date}</time
            ><span class="news-category">{item.category}</span>
          </div>
          <a href={vectaHref(item.href)}>{item.text} {@render arrow()}</a>
        </li>
      {/each}
    </ul>
  </section>
  <section
    id="faq"
    class="chat-container information-section faq-section"
    aria-labelledby="faq-title"
  >
    <h2 id="faq-title">よくある質問</h2>
    <details>
      <summary>どのような情報をもとに回答しますか？</summary>
      <p>
        自治体の公式ホームページ、FAQ、制度資料や手順書などをもとに案内します。対象とする情報や回答ルールは導入時に整理します。
      </p>
    </details>
    <details>
      <summary>ホームページの更新は反映できますか？</summary>
      <p>
        対象ページを設定した間隔で再取得し、回答用データを更新できます。情報の更新頻度に応じた取得間隔や、見直すページの範囲を設定します。
      </p>
    </details>
    <details>
      <summary>多言語で利用できますか？</summary>
      <p>
        日本語の公式情報をもとに、質問の言語に合わせた回答や、指定した言語での回答を設定できます。利用する言語と案内する内容は、窓口の運用に合わせて確認します。
      </p>
    </details>
    <details>
      <summary>SwarrowChatだけでも導入できますか？</summary>
      <p>
        SwarrowChatとSwarrowCallは、それぞれ単独で導入できます。両方を使う場合は、共通の知識基盤を活用できます。
      </p>
    </details>
    <details>
      <summary>公開後も回答内容を見直せますか？</summary>
      <p>
        質問履歴や回答への評価を確認し、参照情報や案内を見直します。公開後の運用改善も支援します。
      </p>
    </details>
  </section>
  <InquiryForm product="chat" />
</main>
<style>
  .chat-page {
    background: var(--sc-bg-card);
    color: var(--sc-navy);
  }
  .chat-container {
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
  section[id],
  #screen {
    scroll-margin-top: 110px;
  }
  img {
    display: block;
    max-width: 100%;
    height: auto;
  }
  .chat-hero {
    position: relative;
    aspect-ratio: 1986 / 792;
  }
  .hero-landscape,
  .hero-landscape img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .hero-landscape img {
    object-fit: cover;
  }
  .hero-grid {
    position: relative;
    height: 100%;
  }
  .hero-copy {
    position: absolute;
    top: 14%;
    left: 0;
  }
  h1 {
    font-size: clamp(30px, 3.8vw, 75px);
    line-height: 1.35;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  h1 span {
    display: block;
    white-space: nowrap;
  }
  .product-name {
    display: flex;
    align-items: center;
    gap: 1vw;
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
  .hero-screen {
    box-sizing: border-box;
    position: absolute;
    top: 9.3%;
    left: 47.4%;
    width: 40.8%;
    border: 3px solid var(--sc-bg-card);
    border-radius: 14px;
    overflow: hidden;
    background: var(--sc-bg-card);
    box-shadow: 0 12px 32px var(--sc-shadow);
  }
  .hero-screen img {
    width: 100%;
  }
  .news-strip {
    box-sizing: border-box;
    line-height: 1.4;
    display: flex;
    align-items: center;
    gap: 32px;
    min-height: 64px;
    padding-block: 16px;
    border-bottom: 1px solid var(--sc-border);
    font-size: clamp(13px, 1vw, 17px);
  }
  .news-strip-label {
    font-size: 1.3em;
    font-weight: 750;
    padding-right: 32px;
    border-right: 1px solid var(--sc-border);
    white-space: nowrap;
  }
  .news-strip time {
    white-space: nowrap;
  }
  .news-strip a {
    display: flex;
    align-items: center;
    gap: 24px;
    flex: 1;
    line-height: 1.6;
  }
  .news-strip :global(svg) {
    margin-left: auto;
    flex-shrink: 0;
  }
  .steps-section {
    padding-block: 36px 64px;
  }
  .ingestion-grid {
    display: grid;
    grid-template-columns: 0.85fr 1.65fr;
    align-items: center;
    gap: 4%;
    margin-top: 36px;
  }
  .journey {
    display: grid;
    gap: 28px;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .journey h3 {
    font-size: clamp(18px, 1.4vw, 24px);
  }
  .journey li {
    display: grid;
    grid-template-columns: 30px 1fr;
    gap: 16px;
  }
  .data-step-number {
    font-size: 17px;
    font-weight: 650;
    line-height: 1.9;
    color: var(--sc-blue);
  }
  .journey p {
    font-size: clamp(14px, 1vw, 17px);
    color: var(--sc-text-secondary);
    margin-top: 8px;
  }
  .ingestion-visual img,
  .improvement-visual img {
    width: 100%;
  }
  .feature-grid {
    display: grid;
    grid-template-columns: 1.18fr 1fr;
    align-items: center;
    gap: 4.2%;
  }
  .answer-section {
    padding-block: 4px 64px;
  }
  .updates-section {
    padding-block: 8px 64px;
    grid-template-columns: 1fr 1.25fr;
    gap: 5%;
  }
  #updates-title span {
    display: inline-block;
  }
  .refresh-visual {
    min-width: 0;
  }
  .refresh-visual img {
    width: 100%;
    aspect-ratio: 2 / 1;
    object-fit: cover;
  }
  .refresh-visual figcaption {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    text-align: center;
    font-size: clamp(12px, 1vw, 17px);
    font-weight: 650;
    margin-top: 8px;
  }
  .refresh-sources {
    width: 100%;
    border-collapse: collapse;
    margin-top: 28px;
    font-size: clamp(13px, 1vw, 17px);
  }
  .refresh-sources caption {
    text-align: left;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  .refresh-sources th,
  .refresh-sources td {
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid var(--sc-border);
    line-height: 1.7;
  }
  .refresh-sources th {
    font-weight: 600;
  }
  .refresh-sources thead {
    background: var(--sc-bg-light);
  }
  .refresh-sources td {
    color: var(--sc-blue);
  }
  .languages-section {
    padding-block: 0 56px;
  }
  .multilingual-visual {
    display: grid;
    grid-template-columns: 1fr 30px 1fr;
    gap: 20px;
    align-items: center;
    padding: 42px 30px;
    background: var(--sc-bg-light);
    border-radius: 8px;
  }
  .language-source {
    display: grid;
    justify-items: center;
    text-align: center;
    gap: 12px;
    color: var(--sc-blue);
  }
  .language-source strong {
    color: var(--sc-navy);
    font-size: clamp(15px, 1.1vw, 20px);
    font-weight: 650;
  }
  .language-source span {
    color: var(--sc-text-secondary);
    font-size: 12px;
  }
  .multilingual-visual :global(.language-arrow) {
    color: var(--sc-blue);
  }
  .language-options {
    list-style: none;
    display: grid;
    gap: 10px;
    margin: 0;
    padding: 0;
  }
  .language-options li {
    padding: 10px 12px;
    background: var(--sc-bg-card);
    border: 1px solid var(--sc-border);
    border-radius: 4px;
    text-align: center;
    font-size: clamp(14px, 1.1vw, 19px);
    font-weight: 600;
  }
  .answer-screen {
    min-width: 0;
    border: 1px solid var(--sc-border);
    border-radius: 12px;
    overflow: hidden;
  }
  .answer-screen img {
    width: 100%;
  }

  .feature-copy > p {
    margin-top: 20px;
    color: var(--sc-text-secondary);
    font-size: clamp(15px, 1.1vw, 19px);
  }
  .use-case-list {
    padding: 0;
    list-style: none;
    margin: 24px 0 0;
    font-weight: 650;
    font-size: clamp(16px, 1.2vw, 21px);
  }
  .use-case-list li {
    display: flex;
    align-items: center;
    gap: 15px;
    padding-block: 12px;
    border-bottom: 1px solid var(--sc-border);
  }
  .use-case-icon {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    flex: 0 0 auto;
    border-radius: 50%;
    background: var(--sc-bg-light);
    color: var(--sc-blue);
  }
  .operation-icon {
    grid-row: 1 / 3;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--sc-bg-light);
    color: var(--sc-blue);
  }
  .operations-list li {
    display: grid;
    grid-template-columns: 40px 1fr;
    column-gap: 14px;
    align-items: start;
  }
  .voice-section {
    background: var(--sc-bg-light);
    padding-block: 34px;
  }
  .voice-grid {
    display: grid;
    grid-template-columns: 0.55fr 1fr;
    align-items: center;
    gap: 5%;
  }
  .voice-visual {
    position: relative;
  }
  .voice-scene {
    width: 100%;
    border-radius: 4px;
  }
  .voice-screen {
    position: absolute;
    right: 3%;
    top: 7%;
    width: 27%;
    border: 3px solid var(--sc-bg-card);
    border-radius: 10px;
    box-shadow: 0 7px 18px var(--sc-shadow);
  }
  .operations-section {
    padding-block: 46px;
    grid-template-columns: 1.12fr 1fr;
  }

  .operations-list {
    padding: 0;
    list-style: none;
    margin: 20px 0 0;
    display: grid;
    gap: 18px;
  }
  .operations-list h3 {
    font-size: clamp(16px, 1.2vw, 21px);
  }
  .operations-list p {
    font-size: clamp(14px, 1vw, 17px);
    margin-top: 4px;
    color: var(--sc-text-secondary);
  }
  .support-section {
    padding-block: 34px;
    background: var(--sc-bg-light);
  }
  .support-steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 44px;
    margin: 26px 0 0;
    padding: 0;
    list-style: none;
  }
  .support-steps li {
    display: flex;
    gap: 20px;
  }
  .step-number {
    color: var(--sc-blue);
    font-size: 25px;
    font-weight: 600;
    line-height: 1.5;
  }
  .support-steps h3 {
    font-size: 20px;
  }
  .support-steps p {
    font-size: 15px;
    color: var(--sc-text-secondary);
    margin-top: 8px;
  }
  .information-section {
    max-width: 1120px;
    padding-block: 48px;
  }
  .information-section h2 {
    font-size: 28px;
    margin-bottom: 18px;
  }
  .news-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 18px;
  }
  .news-heading h2 {
    margin: 0;
  }
  .news-all {
    font-size: 14px;
    color: var(--sc-blue);
    text-decoration: underline;
    text-underline-offset: 4px;
    white-space: nowrap;
  }
  .news-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .news-list li {
    border-bottom: 1px solid var(--sc-border);
    padding-block: 20px;
  }
  .news-list time {
    font-size: 12px;
    color: var(--sc-text-secondary);
  }
  .news-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px 16px;
    margin-bottom: 10px;
  }
  .news-category {
    color: var(--sc-text-secondary);
    font-size: 11px;
    border: 1px solid var(--sc-border);
    border-radius: 4px;
    padding: 2px 8px;
  }
  .news-list a {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
    font-size: 15px;
    line-height: 1.8;
  }
  .news-list :global(svg) {
    flex-shrink: 0;
  }
  .faq-section details {
    padding-block: 20px;
    border-bottom: 1px solid var(--sc-border);
    font-size: 15px;
  }
  .faq-section summary {
    cursor: pointer;
    font-weight: 600;
    line-height: 1.7;
  }
  .faq-section details p {
    margin-top: 16px;
    color: var(--sc-text-secondary);
  }
  @media (min-width: 1921px) {
    .chat-hero {
      aspect-ratio: auto;
      height: 766px;
    }
    .hero-landscape img {
      object-position: center bottom;
    }
    .hero-screen {
      width: 40.8%;
    }
  }
  @media (max-width: 1100px) and (min-width: 861px) {
    .product-name {
      gap: 10px;
      font-size: 3.8vw;
    }
    .product-name img {
      width: 5.74vw;
    }
    .news-strip {
      gap: 20px;
    }
    .news-strip-label {
      padding-right: 20px;
    }
    .use-case-list li {
      padding-block: 10px;
    }
    .feature-copy > p {
      margin-top: 12px;
    }
    .operations-list {
      gap: 10px;
      margin-top: 12px;
    }
  }
  @media (max-width: 860px) {
    .chat-container {
      width: calc(100% - 40px);
    }
    .chat-hero {
      aspect-ratio: auto;
    }
    .hero-grid {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 38px;
      padding-bottom: 76px;
      gap: 26px;
    }
    .hero-copy {
      position: static;
      text-align: center;
    }
    h1 {
      font-size: clamp(26px, 7.25vw, 48px);
      line-height: 1.45;
    }
    .product-name {
      justify-content: center;
      font-size: clamp(29px, 7.65vw, 51px);
      gap: 10px;
      margin-top: 16px;
    }
    .product-name img {
      width: clamp(43px, 11.2vw, 72px);
    }
    .hero-screen {
      position: static;
      width: 82%;
      max-width: 530px;
      border-width: 2px;
      border-radius: 9px;
    }
    .hero-landscape img {
      object-fit: cover;
      object-position: center bottom;
    }
    .news-strip {
      min-height: 0;
      flex-wrap: wrap;
      gap: 10px 16px;
      padding-block: 20px;
      font-size: 12px;
    }
    .news-strip-label {
      font-size: 16px;
      padding-right: 16px;
    }
    .news-strip a {
      flex-basis: 100%;
      gap: 18px;
    }
    .steps-section {
      padding-block: 38px 44px;
    }
    .ingestion-grid {
      grid-template-columns: 1fr;
      gap: 26px;
      margin-top: 22px;
    }
    .ingestion-visual {
      order: -1;
    }
    .journey {
      gap: 26px;
    }
    .journey h3 {
      font-size: 19px;
    }
    .journey p {
      font-size: 14px;
    }
    .feature-grid,
    .voice-grid {
      grid-template-columns: 1fr;
      gap: 26px;
    }
    .updates-section {
      padding-block: 0 44px;
    }
    .refresh-sources th,
    .refresh-sources td {
      padding: 12px 8px;
    }
    .languages-section {
      padding-block: 0 44px;
    }
    .languages-section .feature-copy {
      order: -1;
    }
    .multilingual-visual {
      padding: 28px 20px;
      gap: 12px;
    }
    .answer-section {
      padding-block: 0 44px;
    }
    .answer-screen {
      order: 2;
    }
    .feature-copy > p {
      font-size: 15px;
      margin-top: 14px;
    }
    .use-case-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 14px;
      font-size: 13px;
      margin-top: 16px;
    }
    .use-case-list li {
      gap: 8px;
      padding-block: 13px;
    }
    .use-case-icon {
      width: 30px;
      height: 30px;
    }
    .use-case-icon :global(svg) {
      width: 18px;
      height: 18px;
    }
    .voice-section {
      padding-block: 36px;
    }
    .voice-screen {
      border-width: 2px;
      border-radius: 7px;
    }
    .operations-section {
      padding-block: 40px;
    }
    .operations-list {
      gap: 18px;
    }
    .operations-list h3 {
      font-size: 17px;
    }
    .operations-list p {
      font-size: 14px;
    }
    .support-section {
      padding-block: 32px;
    }
    .support-steps {
      grid-template-columns: 1fr;
      gap: 24px;
      margin-top: 24px;
    }
    .support-steps h3 {
      font-size: 18px;
    }
    .support-steps p {
      font-size: 14px;
      margin-top: 4px;
    }
    .information-section {
      padding-block: 32px;
    }
    .information-section h2 {
      font-size: 26px;
    }
    .news-list a,
    .faq-section details {
      font-size: 14px;
    }
  }
  @media (min-width: 540px) and (max-width: 860px) {
    .chat-hero {
      max-height: none;
    }
    .hero-grid {
      padding-top: 50px;
      padding-bottom: 110px;
    }
    .voice-visual {
      max-width: 620px;
    }
  }
</style>
