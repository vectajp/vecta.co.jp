<script lang="ts">
  let {
    variant = 'summary',
    detailsHref = 'https://www.vecta.co.jp/company/#isms',
  }: {
    variant?: 'compact' | 'summary' | 'details'
    detailsHref?: string
  } = $props()
</script>

<div class="certification" class:compact={variant === 'compact'}>
  <figure>
    <img
      src="/certifications/jqa-iso27001.jpg"
      alt="JQA ISO/IEC 27001認証登録マーク"
      width="236"
      height="295"
      loading="lazy"
      decoding="async"
    >
    <figcaption>JQA-IM2262</figcaption>
  </figure>
  <div class="certification-copy">
    {#if variant === 'compact'}
      <p class="certification-title">株式会社VectaのISMS認証</p>
      <p>ISO/IEC 27001:2022</p>
      <a href={detailsHref}>認証情報を確認</a>
    {:else}
      <h3>ISMS認証取得</h3>
      <p>
        株式会社Vectaは、情報セキュリティマネジメントシステムの国際規格ISO/IEC
        27001:2022の認証を取得しています。
      </p>
      {#if variant === 'details'}
        <dl>
          <div>
            <dt>認証組織</dt>
            <dd>株式会社Vecta</dd>
          </div>
          <div>
            <dt>認証規格</dt>
            <dd>ISO/IEC 27001:2022</dd>
          </div>
          <div>
            <dt>登録日</dt>
            <dd>2026年11月6日</dd>
          </div>
          <div>
            <dt>有効期限</dt>
            <dd>2029年11月5日</dd>
          </div>
          <div>
            <dt>登録活動範囲</dt>
            <dd>
              AIを活用したサービスの開発および運用<br>すべての活動は遠隔で実施
            </dd>
          </div>
          <div>
            <dt>認証機関</dt>
            <dd>一般財団法人日本品質保証機構（JQA）</dd>
          </div>
        </dl>
      {:else}
        <p class="certification-scope">
          登録活動範囲：AIを活用したサービスの開発および運用
        </p>
        <a href={detailsHref}>認証情報を確認</a>
      {/if}
    {/if}
  </div>
</div>

<style>
  .certification {
    display: flex;
    align-items: flex-start;
    gap: 1.75rem;
    color: inherit;
    font-size: 1rem;
    line-height: 1.8;
  }
  figure {
    flex: 0 0 118px;
    width: 118px;
    margin: 0;
    text-align: center;
  }
  img {
    display: block;
    width: 118px;
    height: auto;
  }
  figcaption {
    margin-top: 0.375rem;
    font-size: 0.875rem;
    line-height: 1.5;
    white-space: nowrap;
  }
  .certification-copy {
    min-width: 0;
  }
  h3,
  .certification-title {
    margin: 0 0 0.5rem;
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.6;
  }
  p {
    margin: 0 0 0.75rem;
  }
  .certification-scope {
    font-size: 0.875rem;
  }
  a {
    color: inherit;
    font-size: 0.875rem;
    text-decoration: underline;
    text-underline-offset: 0.25em;
  }
  dl {
    display: grid;
    gap: 0.75rem;
    margin: 1.5rem 0 0;
  }
  dl > div {
    display: grid;
    grid-template-columns: 7rem minmax(0, 1fr);
    gap: 1rem;
  }
  dt {
    font-weight: 700;
  }
  dd {
    margin: 0;
  }
  .compact {
    align-items: center;
    gap: 1.25rem;
    margin-top: 1.5rem;
  }
  .compact .certification-title {
    font-size: 1rem;
  }
  .compact p {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
  @media (max-width: 600px) {
    .certification:not(.compact) {
      flex-direction: column;
      gap: 1.25rem;
    }
    figure {
      flex-basis: auto;
    }
    dl > div {
      grid-template-columns: 1fr;
      gap: 0.125rem;
    }
  }
</style>
