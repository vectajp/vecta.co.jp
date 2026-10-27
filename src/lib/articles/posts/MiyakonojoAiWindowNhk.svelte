<script lang="ts">
  import { siteHref } from '$lib/vecta/links'
</script>

<div class="article-body">
  <p class="image-caption">画像：報道内容をもとにしたイメージイラスト</p>
  <aside class="coverage-source" aria-label="NHKの掲載記事">
    <a
      href="https://news.web.nhk/newsweb/na/nd-20261017de60863"
      target="_blank"
      rel="noopener noreferrer"
      >NHKの掲載記事 <span aria-hidden="true">↗</span></a
    >
    <p>
      都城市ホームページにAI相談窓口 音声でやりとりも<br>2026年10月17日
      18:55公開・動画2分4秒
    </p>
    <p>2026年10月27日時点で、リンク先の記事は閲覧できない状態です。</p>
  </aside>
  <p>
    2026年10月17日、NHK宮崎放送局の「てげビビ！サタデー」で、都城市のホームページに設置されたAI相談窓口の取り組みが紹介されました。手続きや必要書類について相談できるAI窓口と、音声でのやり取りが紹介されています。
  </p>
  <p>
    この取り組みには、株式会社Vectaが提供する自治体ホームページ向けAIチャットボット「SwarrowChat」が活用されています。SwarrowChatは、令和8年度の都城市DXチャレンジプロジェクトの採択事例として、市の公式ホームページにも掲載されています。
  </p>
  <h2>既存の電子申請へつながる相談窓口</h2>
  <p>
    都城市の公式ホームページや電子申請ページなどの情報をもとに、住民の質問に答え、必要な手続きや情報への案内を支えます。市が整備している電子申請への入口としてAI窓口を加え、住民が必要なページを見つけやすくする取り組みです。
  </p>
  <p>
    Vectaは、回答内容や参照情報を確認しながら案内の改善を続け、自治体の情報を住民が使いやすい形で届けるサービスづくりに取り組みます。
  </p>
  <h2>関連リンク</h2>
  <ul>
    <li>
      <a
        href="https://news.web.nhk/newsweb/na/nd-20261017de60863"
        target="_blank"
        rel="noopener noreferrer"
        >NHK「都城市ホームページにAI相談窓口 音声でやりとりも」</a
      >
    </li>
    <li>
      <a
        href="https://www.city.miyakonojo.miyazaki.jp/soshiki/99/67085.html"
        target="_blank"
        rel="noopener noreferrer"
        >都城市「都城市DXチャレンジプロジェクト」採択事例</a
      >
    </li>
    <li>
      <a href={siteHref('https://swarrow.com/chat')}>SwarrowChat 製品ページ</a>
    </li>
  </ul>
</div>

<style>
  .image-caption {
    margin-top: -18px;
    color: var(--color-medium-text);
    font-size: 13px;
    line-height: 1.7;
  }
  .coverage-source {
    padding: 24px;
    margin-bottom: 32px;
    background: var(--color-mist);
    border-left: 3px solid var(--color-vector-blue);
  }
  .coverage-source a {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    font-size: 1.1rem;
  }
  .coverage-source p {
    margin: 12px 0 0;
    color: var(--color-medium-text);
    font-size: 0.9rem;
    line-height: 1.8;
  }
  @media (max-width: 600px) {
    .coverage-source {
      padding: 18px;
    }
  }
</style>
