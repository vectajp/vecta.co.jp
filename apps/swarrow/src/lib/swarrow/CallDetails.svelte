<section class="details handoff" aria-labelledby="call-handoff-title">
  <div class="container">
    <h2 id="call-handoff-title">代表電話の取次と申し送り</h2>
    <p class="lead">AIが用件を聞き、担当職員に伝えてから通話をつなぎます。</p>
    <figure>
      <picture>
        <source
          media="(max-width: 860px)"
          srcset="/swarrow-call/handoff-mobile-v6.webp"
          width="887"
          height="1774"
        >
        <img
          src="/swarrow-call/handoff-desktop-v6.webp"
          alt="住民の用件をAIオペレーターが聞き取り、担当職員へ音声で伝え、職員の了承後に住民と職員の通話をつなぐ3段階の図解"
          width="1774"
          height="887"
          loading="lazy"
        >
      </picture>
      <figcaption>取次と申し送りのイメージ</figcaption>
    </figure>
  </div>
</section>

<section class="details applications" aria-labelledby="call-applications-title">
  <div class="container">
    <h2 id="call-applications-title">回答や予約受付にも活用</h2>
    <div class="application-grid">
      <article>
        <h3>よくある質問に音声で回答</h3>
        <img
          src="/swarrow-call/answer-v6.webp"
          alt="電話で必要な書類を尋ねる住民に、AIオペレーターがFAQや手順書を参照して音声で案内する図解"
          width="1536"
          height="1024"
          loading="lazy"
        >
        <p>登録したFAQや手順書をもとに、手続きや施設の利用方法を案内します。</p>
      </article>
      <article>
        <h3>電話で予約の希望を受付</h3>
        <img
          src="/swarrow-call/booking-v6.webp"
          alt="相談の予約を希望する住民に、AIオペレーターが希望日時と連絡先を聞いて受付する構成例"
          width="1536"
          height="1024"
          loading="lazy"
        >
        <p>
          希望日時や連絡先を聞き取ります。予約枠や外部システムとの連携は業務に合わせて設計します。
        </p>
      </article>
    </div>
    <aside class="outbound">
      <h3>リマインドや一括周知の発信</h3>
      <p>
        指定した日時にかけるタイマー架電や、対象者リストへの一括発信にも対応します。
      </p>
    </aside>
  </div>
</section>

<style>
  .container {
    width: 85.6%;
    max-width: 1360px;
    margin-inline: auto;
  }
  .details {
    padding-block: 64px;
    color: var(--sc-navy);
    background: white;
  }
  h2,
  h3,
  p,
  figure {
    margin: 0;
  }
  h2 {
    font-size: clamp(27px, 2.3vw, 40px);
    font-weight: 800;
    line-height: 1.4;
    letter-spacing: -0.035em;
  }
  h3 {
    font-size: clamp(21px, 1.8vw, 28px);
    font-weight: 750;
    line-height: 1.5;
  }
  p {
    color: var(--sc-text-secondary);
    font-size: 16px;
    line-height: 1.85;
  }
  .lead {
    margin-top: 20px;
    font-size: clamp(16px, 1.2vw, 20px);
  }
  figure {
    margin-top: 32px;
  }
  picture,
  img {
    display: block;
    width: 100%;
  }
  img {
    height: auto;
  }
  figcaption {
    color: var(--sc-text-secondary);
    text-align: center;
    font-size: 13px;
    margin-top: 12px;
  }
  .applications {
    padding-top: 40px;
  }
  .application-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 56px;
    margin-top: 36px;
  }
  .application-grid img {
    margin-block: 20px;
  }
  .outbound {
    display: grid;
    grid-template-columns: 1fr 1.7fr;
    gap: 40px;
    margin-top: 48px;
    padding-top: 28px;
    border-top: 1px solid #d6e2ee;
  }
  .outbound h3 {
    font-size: 21px;
  }
  @media (max-width: 860px) {
    .container {
      width: calc(100% - 40px);
    }
    .details {
      padding-block: 44px;
    }
    figure {
      margin-top: 24px;
    }
    .application-grid,
    .outbound {
      grid-template-columns: 1fr;
      gap: 36px;
    }
    .outbound {
      gap: 12px;
      margin-top: 32px;
    }
  }
</style>
