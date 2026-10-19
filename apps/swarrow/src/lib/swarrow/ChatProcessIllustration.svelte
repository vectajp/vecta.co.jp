<script lang="ts">
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import Building from "@lucide/svelte/icons/landmark";
  import Link from "@lucide/svelte/icons/link";
  import Pencil from "@lucide/svelte/icons/pencil";
  import Search from "@lucide/svelte/icons/search";
  import Send from "@lucide/svelte/icons/send";
  import ThumbsDown from "@lucide/svelte/icons/thumbs-down";
  import ThumbsUp from "@lucide/svelte/icons/thumbs-up";

  let { kind }: { kind: "question" | "search" | "answer" | "review" } =
    $props();
  const labels = {
    question: "知りたいことを文章で入力する図",
    search: "AIが複数の公式ページや資料から関連情報を検索する図",
    answer: "回答に参照元が付き、手続きのページを確認できる図",
    review: "質問履歴と評価を確認し、参照情報の見直しにつなげる図",
  };
</script>

{#snippet lines()}
  <span class="document-lines"><i></i><i></i><i></i><i></i></span>
{/snippet}

<div
  class="illustration"
  class:review={kind === "review"}
  role="img"
  aria-label={labels[kind]}
>
  <div class="scene" aria-hidden="true">
    {#if kind === "question"}
      <div class="question-bubble">引っ越しの<br>手続きを教えて</div>
      <div class="input-symbol"><i></i><Send stroke-width={1.8} /></div>
    {:else if kind === "search"}
      <div class="paper search-back">{@render lines()}</div>
      <div class="paper search-middle">{@render lines()}</div>
      <div class="paper search-front">
        <Building stroke-width={1.8} />{@render lines()}
      </div>
      <div class="magnifier"><Search stroke-width={1.6} /></div>
      <span class="ai-node">AI</span>
    {:else if kind === "answer"}
      <div class="paper answer-paper">
        <div class="answer-lines">
          <b>1</b><i></i><b>2</b><i></i><b>3</b><i></i>
        </div>
        <span class="reference-title">参照元</span>
        <div class="reference-line">
          <Link stroke-width={2} />
          <i></i>
        </div>
      </div>
      <div class="paper destination">
        <strong>手続きの案内</strong><Building stroke-width={1.8} />
        {@render lines()}
      </div>
      <div class="link-arrow"><ArrowRight stroke-width={2} /></div>
    {:else}
      <div class="history-stack">
        <div>引っ越しの手続きを教えて</div>
        <span></span><span></span>
      </div>
      <div class="review-arrow first"><ArrowRight stroke-width={2} /></div>
      <div class="feedback">
        <ThumbsUp stroke-width={1.8} /><ThumbsDown stroke-width={1.8} />
      </div>
      <div class="review-arrow second"><ArrowRight stroke-width={2} /></div>
      <div class="paper revision">
        {@render lines()}<Pencil stroke-width={1.8} />
      </div>
      <div class="return-line"><ArrowRight stroke-width={2} /></div>
    {/if}
  </div>
</div>

<style>
  .illustration {
    container-type: inline-size;
    width: 100%;
    aspect-ratio: 3 / 2;
    color: var(--sc-navy);
  }
  .scene {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .scene :global(*) {
    box-sizing: border-box;
  }
  .scene::before {
    content: "";
    position: absolute;
    inset: 5% 2% 4%;
    background: var(--sc-bg-light);
    border-radius: 48% 38% 32% 42%;
    transform: rotate(-4deg);
  }
  .question-bubble {
    position: absolute;
    top: 12%;
    left: 6%;
    width: 86%;
    height: 55%;
    display: grid;
    place-content: center;
    font-size: 6.9cqw;
    font-weight: 750;
    line-height: 1.5;
    background: color-mix(in srgb, var(--sc-blue) 17%, var(--sc-bg-card));
    border: 1cqw solid var(--sc-blue);
    border-radius: 18cqw 18cqw 18cqw 3cqw;
    transform: rotate(-2deg);
  }
  .input-symbol {
    position: absolute;
    left: 9%;
    top: 76%;
    width: 82%;
    height: 17%;
    border: 0.6cqw solid var(--sc-navy);
    border-radius: 4cqw;
    background: var(--sc-bg-card);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-inline: 5cqw;
  }
  .input-symbol i {
    height: 45%;
    width: 0.8cqw;
    background: var(--sc-border);
  }
  .input-symbol :global(svg) {
    width: 9cqw;
    height: 9cqw;
    color: var(--sc-blue);
  }
  .paper {
    position: absolute;
    background: var(--sc-bg-card);
    border: 0.65cqw solid var(--sc-navy);
    border-radius: 1.6cqw;
    overflow: hidden;
  }
  .paper::before {
    content: "";
    display: block;
    height: 3.3cqw;
    background: var(--sc-border);
  }
  .document-lines {
    display: grid;
    gap: 2cqw;
    margin: 3cqw;
  }
  .document-lines i {
    height: 1.6cqw;
    border-radius: 1cqw;
    background: var(--sc-border);
  }
  .document-lines i:nth-child(2) {
    width: 73%;
  }
  .document-lines i:last-child {
    width: 85%;
  }
  .search-back {
    left: 44%;
    top: 23%;
    width: 43%;
    height: 54%;
    transform: rotate(9deg);
  }
  .search-middle {
    left: 30%;
    top: 16%;
    width: 43%;
    height: 60%;
    transform: rotate(3deg);
  }
  .search-front {
    left: 9%;
    top: 11%;
    width: 45%;
    height: 70%;
    transform: rotate(-6deg);
  }
  .search-front :global(svg) {
    display: block;
    margin: 4cqw auto 2cqw;
    width: 15cqw;
    height: 15cqw;
    color: var(--sc-blue);
  }
  .search-front .document-lines i:nth-child(2) {
    background: var(--sc-diagram-green);
  }
  .magnifier {
    position: absolute;
    left: 29%;
    top: 42%;
    width: 43%;
    height: 57%;
  }
  .magnifier :global(svg) {
    width: 100%;
    height: 100%;
    transform: scaleX(-1);
    color: var(--sc-navy);
    fill: color-mix(in srgb, var(--sc-bg-card) 60%, transparent);
  }
  .ai-node {
    position: absolute;
    right: 5%;
    bottom: 5%;
    width: 20cqw;
    height: 20cqw;
    display: grid;
    place-items: center;
    background: var(--sc-blue);
    color: var(--sc-bg-card);
    border: 1cqw solid var(--sc-bg-card);
    border-radius: 50%;
    font-size: 9cqw;
    font-weight: 750;
  }
  .answer-paper {
    left: 5%;
    top: 8%;
    width: 53%;
    height: 83%;
    padding-bottom: 4cqw;
  }
  .answer-lines {
    display: grid;
    grid-template-columns: 7cqw 1fr;
    align-items: center;
    gap: 2.5cqw;
    margin: 5cqw 4cqw 4cqw;
  }
  .answer-lines b {
    display: grid;
    place-items: center;
    width: 7cqw;
    height: 7cqw;
    border-radius: 50%;
    background: var(--sc-blue);
    color: var(--sc-bg-card);
    font-size: 4.2cqw;
  }
  .answer-lines i {
    height: 2cqw;
    background: var(--sc-border);
    border-radius: 1cqw;
  }
  .reference-title {
    display: block;
    font-weight: 700;
    font-size: 4.7cqw;
    margin-inline: 4cqw;
  }
  .reference-line {
    display: flex;
    align-items: center;
    gap: 2cqw;
    margin: 1.5cqw 4cqw;
    color: var(--sc-blue);
  }
  .reference-line :global(svg) {
    width: 5.5cqw;
    height: 5.5cqw;
  }
  .reference-line i {
    width: 65%;
    height: 1.8cqw;
    border-bottom: 0.5cqw solid currentColor;
  }
  .destination {
    right: 2%;
    top: 24%;
    width: 33%;
    height: 61%;
    transform: rotate(4deg);
  }
  .destination strong {
    display: block;
    font-size: 4cqw;
    margin: 3cqw 1cqw 2cqw;
    text-align: center;
    white-space: nowrap;
  }
  .destination :global(svg) {
    display: block;
    width: 11cqw;
    height: 11cqw;
    margin: auto;
    color: var(--sc-blue);
  }
  .destination .document-lines {
    gap: 1.7cqw;
  }
  .link-arrow {
    position: absolute;
    left: 49%;
    bottom: 15%;
    color: var(--sc-blue);
    transform: rotate(-24deg);
  }
  .link-arrow :global(svg) {
    width: 24cqw;
    height: 12cqw;
  }
  .review {
    aspect-ratio: 2 / 1;
  }
  .history-stack {
    position: absolute;
    left: 4%;
    top: 21%;
    width: 34%;
  }
  .history-stack div {
    padding: 2.5cqw 1.5cqw;
    background: color-mix(in srgb, var(--sc-blue) 17%, var(--sc-bg-card));
    border: 0.55cqw solid var(--sc-blue);
    border-radius: 2cqw 2cqw 2cqw 0;
    font-size: 2.6cqw;
    font-weight: 650;
    white-space: nowrap;
  }
  .history-stack span {
    display: block;
    position: relative;
    height: 7cqw;
    background: var(--sc-bg-card);
    margin: 2cqw 0 0 3cqw;
    border: 0.55cqw solid var(--sc-border);
    border-radius: 2cqw 2cqw 0 2cqw;
  }
  .history-stack span::after {
    content: "";
    position: absolute;
    left: 3cqw;
    top: 2cqw;
    width: 65%;
    height: 1cqw;
    background: var(--sc-border);
  }
  .history-stack span:last-child {
    margin-left: 0;
    margin-right: 3cqw;
  }
  .feedback {
    position: absolute;
    left: 44%;
    top: 30%;
    width: 22%;
    height: 29%;
    background: var(--sc-bg-card);
    border: 0.55cqw solid var(--sc-navy);
    border-radius: 3cqw;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .feedback :global(svg) {
    width: 7cqw;
    height: 7cqw;
    color: var(--sc-blue);
  }
  .feedback :global(svg:last-child) {
    color: var(--sc-diagram-green);
  }
  .revision {
    right: 4%;
    top: 21%;
    width: 22%;
    height: 58%;
    transform: rotate(-7deg);
    overflow: visible;
  }
  .revision .document-lines {
    gap: 2.5cqw;
  }
  .revision .document-lines i:nth-child(3) {
    background: var(--sc-diagram-green);
  }
  .revision :global(svg) {
    position: absolute;
    width: 15cqw;
    height: 15cqw;
    right: -6cqw;
    bottom: 2cqw;
    color: var(--sc-blue);
    fill: var(--sc-bg-light);
  }
  .review-arrow {
    position: absolute;
    top: 18%;
    color: var(--sc-blue);
  }
  .review-arrow :global(svg) {
    width: 11cqw;
    height: 8cqw;
  }
  .review-arrow.first {
    left: 34%;
    transform: rotate(-15deg);
  }
  .review-arrow.second {
    left: 64%;
    transform: rotate(-15deg);
  }
  .return-line {
    position: absolute;
    bottom: 10%;
    left: 38%;
    width: 38%;
    height: 13%;
    border-bottom: 0.65cqw solid var(--sc-blue);
    border-right: 0.65cqw solid var(--sc-blue);
    border-radius: 0 0 60% 0;
    color: var(--sc-blue);
  }
  .return-line :global(svg) {
    position: absolute;
    left: -3cqw;
    bottom: -3.5cqw;
    width: 8cqw;
    height: 6cqw;
    transform: rotate(180deg);
  }
</style>
