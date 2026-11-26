<script lang="ts">
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import ClipboardCheck from "@lucide/svelte/icons/clipboard-check";
  import FileText from "@lucide/svelte/icons/file-text";
  import ImageIcon from "@lucide/svelte/icons/image";
  import Sparkles from "@lucide/svelte/icons/sparkles";

  const parts = [
    { name: "メイン表示", kind: "main" },
    { name: "分野別の入口", kind: "categories" },
    { name: "お知らせ", kind: "notices" },
    { name: "画像と文章", kind: "content" },
    { name: "リンク", kind: "links" },
  ];
  const steps = [
    {
      title: "構成や文言を相談",
      body: "編集したい内容をAIに伝える",
      icon: Sparkles,
    },
    {
      title: "提案を下書きへ適用",
      body: "内容を確認して編集に取り込む",
      icon: FileText,
    },
    {
      title: "職員が確認して公開",
      body: "保存・承認・公開は職員が操作",
      icon: ClipboardCheck,
    },
  ];
</script>

<section class="detail-section" aria-labelledby="site-builder-title">
  <div class="container">
    <h2 id="site-builder-title">トップページを部品から構成</h2>
    <div class="detail-grid builder">
      <figure>
        <div
          class="page-map"
          role="img"
          aria-label="メイン表示、分野別の入口、お知らせ、画像と文章、リンクを組み合わせたページ構成"
        >
          {#each parts as part (part.kind)}
            <div class="part-row">
              <div
                class="part-picture"
                class:main={part.kind === "main"}
                class:categories={part.kind === "categories"}
                class:notices={part.kind === "notices"}
                class:content={part.kind === "content"}
                class:links={part.kind === "links"}
                aria-hidden="true"
              >
                {#if part.kind === "main" || part.kind === "content"}
                  <ImageIcon size={38} stroke-width={1.3} />
                {/if}
                <span></span><span></span><span></span>
              </div>
              <span class="part-name">{part.name}</span>
            </div>
          {/each}
        </div>
        <figcaption>ページ構成のイメージ</figcaption>
      </figure>
      <div>
        <p class="lead">
          トップ画像や見出し、ナビゲーション、お知らせなどを部品として組み合わせ、配置やサイズを柔軟に調整できます。
        </p>
        <dl>
          <div>
            <dt>部品の配置と並び順</dt>
            <dd>横並び・縦並び、画像の左右配置、部品の順番を設定します。</dd>
          </div>
          <div>
            <dt>列数・サイズ・余白</dt>
            <dd>
              列数や部品の間隔、上下の余白を調整し、伝えたい内容に合わせてレイアウトを整えます。
            </dd>
          </div>
          <div>
            <dt>画面幅ごとの表示</dt>
            <dd>
              PC・タブレット・スマホごとに、列数や余白、部品の表示・非表示を設定できます。
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</section>

<section
  class="detail-section management"
  aria-labelledby="site-management-title"
>
  <div class="container detail-grid">
    <div>
      <h2 id="site-management-title">原稿・画像・PDFをまとめて管理</h2>
      <p class="lead">
        日々のお知らせから掲載する画像や添付資料まで、管理画面でまとめて扱えます。
      </p>
      <dl>
        <div>
          <dt>原稿の作成と編集</dt>
          <dd>見出し、文章、表、リンク、画像を使って記事を作成します。</dd>
        </div>
        <div>
          <dt>担当部署と承認状態</dt>
          <dd>
            原稿を検索し、担当部署や下書き・承認待ちなどの状態を一覧で確認します。
          </dd>
        </div>
        <div>
          <dt>画像と添付資料</dt>
          <dd>写真やPDFなどのファイルを登録し、ページに掲載できます。</dd>
        </div>
      </dl>
    </div>
    <figure class="management-screen">
      <a
        href="/cms/management.jpg"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="原稿一覧の画面を拡大して見る"
      >
        <img
          src="/cms/management.jpg"
          alt="原稿のタイトル、カテゴリ、担当部署、承認状態を一覧で確認するSwarrowSiteの管理画面"
          width="1440"
          height="900"
          loading="lazy"
        >
      </a>
      <figcaption>原稿一覧の表示例</figcaption>
    </figure>
  </div>
</section>

<section
  class="detail-section assistant"
  aria-labelledby="site-assistant-title"
>
  <div class="container">
    <h2 id="site-assistant-title">AIに構成や文言を相談</h2>
    <p class="lead">
      ページ全体や選んだ部品について、構成・文言・配置をAIに相談できます。提案を確認して下書きへ適用し、保存と公開は職員が操作します。
    </p>
    <ol class="assistant-flow">
      {#each steps as step, index (step.title)}
        <li>
          <span class="step-icon"
            ><step.icon size={34} stroke-width={1.5} aria-hidden="true" /></span
          >
          <h3>{step.title}</h3>
          <p>{step.body}</p>
          {#if index < steps.length - 1}
            <ArrowRight
              class="flow-arrow"
              size={26}
              stroke-width={1.5}
              aria-hidden="true"
            />
          {/if}
        </li>
      {/each}
    </ol>
  </div>
</section>

<style>
  .container {
    width: min(1360px, calc(100% - 96px));
    margin-inline: auto;
  }
  .detail-section {
    padding-block: 64px;
    color: var(--sc-navy);
  }
  h2 {
    margin: 0;
    border-left: 7px solid var(--sc-blue);
    padding-left: 22px;
    font-size: clamp(26px, 2.8vw, 39px);
    font-weight: 800;
    line-height: 1.55;
    letter-spacing: -0.025em;
  }
  p,
  figure,
  dl {
    margin: 0;
  }
  .detail-grid {
    display: grid;
    grid-template-columns: 0.9fr 1.1fr;
    align-items: center;
    gap: 64px;
  }
  .builder {
    margin-top: 38px;
  }
  .lead {
    font-size: 19px;
    line-height: 1.9;
  }
  dl {
    margin-top: 24px;
  }
  dl > div {
    display: grid;
    grid-template-columns: 0.9fr 1.1fr;
    gap: 22px;
    padding-block: 20px;
    border-bottom: 1px solid #d7e2ee;
  }
  dt {
    color: #2854a6;
    font-size: 18px;
    font-weight: 750;
    line-height: 1.7;
  }
  dd {
    margin: 0;
    font-size: 16px;
    line-height: 1.9;
  }
  figcaption {
    margin-top: 12px;
    text-align: center;
    font-size: 14px;
    line-height: 1.7;
  }
  .page-map {
    position: relative;
    display: grid;
    gap: 10px;
    padding: 38px 0 20px 20px;
  }
  .page-map::before {
    content: "";
    position: absolute;
    inset: 0 42% 0 0;
    border: 1px solid #bacbdf;
    border-top: 23px solid #dce6f3;
    border-radius: 7px;
    background: #fff;
  }
  .part-row {
    position: relative;
    display: grid;
    grid-template-columns: 55% 1fr;
    gap: 32px;
    align-items: center;
  }
  .part-picture {
    box-sizing: border-box;
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    padding: 12px;
    background: #edf4fd;
    border-radius: 3px;
    min-width: 0;
  }
  .part-picture span {
    display: block;
    height: 8px;
    background: #9bbdef;
    border-radius: 2px;
    flex: 1;
  }
  .part-picture.main {
    height: 88px;
    background: #c5dcfb;
    color: #4f8ed9;
  }
  .main span {
    height: 6px;
  }
  .main span:last-child {
    display: none;
  }
  .categories {
    height: 48px;
  }
  .categories span {
    height: 28px;
    background: #d1e3fb;
  }
  .notices {
    height: 70px;
    flex-direction: column;
    align-items: stretch;
  }
  .notices span {
    flex: none;
    height: 7px;
  }
  .notices span:last-child {
    width: 65%;
  }
  .content {
    height: 68px;
    color: #6c9cd8;
  }
  .content span:last-child {
    display: none;
  }
  .links {
    height: 32px;
  }
  .links span {
    height: 5px;
  }
  .part-name {
    position: relative;
    font-size: 17px;
    font-weight: 650;
    line-height: 1.5;
  }
  .part-name::before {
    content: "";
    position: absolute;
    top: 50%;
    left: -32px;
    width: 24px;
    height: 2px;
    background: #4072cf;
  }
  .management {
    background: var(--sc-bg-light);
  }
  .management h2 {
    font-size: clamp(26px, 2.5vw, 36px);
  }
  .management .lead {
    margin-top: 24px;
  }
  .management dl > div {
    display: block;
    padding-block: 16px;
  }
  .management dd {
    margin-top: 5px;
  }
  .management-screen a {
    display: block;
    border: 1px solid #c7d3df;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 7px 24px rgba(9, 32, 69, 0.07);
  }
  .management-screen img {
    display: block;
    width: 100%;
    height: auto;
  }
  .assistant .lead {
    max-width: 1000px;
    margin: 24px 0 0 29px;
  }
  .assistant-flow {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    list-style: none;
    padding: 0;
    margin: 40px 0 0;
    gap: 64px;
  }
  .assistant-flow li {
    position: relative;
    text-align: center;
  }
  .step-icon {
    display: grid;
    place-items: center;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #eaf2fd;
    color: #3267b4;
    margin: 0 auto 18px;
  }
  .assistant-flow li:last-child .step-icon {
    background: #edf6e8;
    color: #477c39;
  }
  .assistant-flow h3 {
    font-size: 22px;
    line-height: 1.6;
    margin: 0;
  }
  .assistant-flow p {
    font-size: 16px;
    line-height: 1.8;
    margin-top: 8px;
  }
  .assistant-flow :global(.flow-arrow) {
    position: absolute;
    top: 23px;
    right: -45px;
    color: #6d8eaf;
  }
  @media (max-width: 1000px) {
    .detail-grid {
      gap: 32px;
    }
    dl > div {
      display: block;
    }
    dd {
      margin-top: 5px;
    }
    .part-row {
      gap: 24px;
    }
    .part-name {
      font-size: 15px;
    }
    .part-name::before {
      left: -24px;
      width: 17px;
    }
  }
  @media (max-width: 860px) {
    .container {
      width: calc(100% - 40px);
    }
    .detail-section {
      padding-block: 38px;
    }
    h2,
    .management h2 {
      font-size: clamp(24px, 6.1vw, 34px);
      border-width: 5px;
      padding-left: 15px;
    }
    .detail-grid {
      grid-template-columns: 1fr;
      gap: 30px;
    }
    .builder {
      margin-top: 30px;
    }
    .lead {
      font-size: 17px;
    }
    dl {
      margin-top: 14px;
    }
    dl > div {
      padding-block: 16px;
    }
    dt {
      font-size: 18px;
    }
    .page-map {
      max-width: 530px;
      margin-inline: auto;
    }
    .part-name {
      font-size: 16px;
    }
    .management-screen {
      margin-top: 0;
    }
    .assistant .lead {
      margin: 18px 0 0;
    }
    .assistant-flow {
      grid-template-columns: 1fr;
      gap: 28px;
      margin-top: 30px;
    }
    .assistant-flow li {
      display: grid;
      grid-template-columns: 58px 1fr;
      gap: 0 18px;
      text-align: left;
    }
    .step-icon {
      grid-row: 1 / 3;
      width: 58px;
      height: 58px;
      margin: 0;
    }
    .assistant-flow h3 {
      font-size: 20px;
    }
    .assistant-flow p {
      margin-top: 5px;
    }
    .assistant-flow :global(.flow-arrow) {
      display: none;
    }
  }
</style>
