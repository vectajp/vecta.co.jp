<script lang="ts">
  import ChevronDown from "@lucide/svelte/icons/chevron-down";

  const questions = [
    {
      question: "今の代表番号や内線を使えますか",
      answer:
        "現在の電話設備と転送経路を確認し、接続方法を設計します。代表番号、直通電話、内線など、利用したい環境に合わせて接続試験を行います。",
    },
    {
      question: "職員が電話に出られない場合はどうなりますか",
      answer:
        "受付時間や不在時の運用に合わせて、住民への案内や折り返しに必要な情報の聞き取りなどを設計します。導入時に担当部署と対応方法を決めます。",
    },
    {
      question: "回答や予約受付だけにも使えますか",
      answer:
        "FAQに基づく回答や、予約に必要な項目の聞き取りにも活用できます。予約枠の管理や外部システムとの連携範囲は、対象業務と既存システムを確認して決めます。",
    },
  ];
</script>

<section class="call-faq" aria-labelledby="call-faq-title">
  <div class="container">
    <h2 id="call-faq-title">よくある質問</h2>
    <div class="questions">
      {#each questions as item (item.question)}
        <details>
          <summary>
            <span>{item.question}</span>
            <ChevronDown size={21} stroke-width={1.7} aria-hidden="true" />
          </summary>
          <p>{item.answer}</p>
        </details>
      {/each}
    </div>
  </div>
</section>

<style>
  .call-faq {
    color: var(--sc-navy);
    background: var(--sc-bg-light);
    padding-block: 56px 64px;
  }
  .container {
    width: 85.6%;
    max-width: 1360px;
    margin-inline: auto;
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
  .questions {
    max-width: 1080px;
    margin: 32px auto 0;
  }
  details {
    border-bottom: 1px solid #cad9e7;
  }
  summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 24px 4px;
    font-size: 19px;
    font-weight: 650;
    line-height: 1.7;
    list-style: none;
    cursor: pointer;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  summary :global(svg) {
    flex-shrink: 0;
  }
  details[open] summary :global(svg) {
    transform: rotate(180deg);
  }
  summary:focus-visible {
    outline: 3px solid var(--sc-blue);
    outline-offset: 3px;
  }
  p {
    max-width: 980px;
    margin: 0;
    padding: 0 4px 24px;
    font-size: 17px;
    line-height: 1.9;
  }
  @media (max-width: 860px) {
    .call-faq {
      padding-block: 36px 42px;
    }
    .container {
      width: calc(100% - 40px);
    }
    h2 {
      font-size: clamp(24px, 6.1vw, 34px);
      border-width: 5px;
      padding-left: 15px;
    }
    .questions {
      margin-top: 20px;
    }
    summary {
      font-size: 17px;
      padding-block: 20px;
      gap: 16px;
    }
    p {
      font-size: 16px;
    }
  }
</style>
