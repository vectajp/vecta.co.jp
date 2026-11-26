<script lang="ts">
  import ChevronDown from "@lucide/svelte/icons/chevron-down";

  const questions = [
    {
      question: "どのようなページを更新できますか",
      answer:
        "お知らせ、くらし・手続き、子育て・教育などの原稿を編集できます。トップページの画像や見出し、ナビゲーション、部品の並びも管理します。",
    },
    {
      question: "保存するとそのまま公開されますか",
      answer:
        "保存した内容は下書きとして扱います。承認と公開を分けて管理し、公開担当者が反映する内容を確認してから公開します。",
    },
    {
      question: "SwarrowChatと連携できますか",
      answer:
        "承認して公開した原稿を、ホームページとAI窓口の参照情報に反映できます。住民への案内に使う情報を、原稿の更新と合わせて管理できます。",
    },
  ];
</script>

<section class="cms-faq" aria-labelledby="cms-faq-title">
  <div class="container">
    <h2 id="cms-faq-title">よくある質問</h2>
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
  .cms-faq {
    color: var(--sc-navy);
    background: var(--sc-bg-light);
    padding-block: 56px 64px;
  }
  .container {
    width: min(1360px, calc(100% - 96px));
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
    .cms-faq {
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
