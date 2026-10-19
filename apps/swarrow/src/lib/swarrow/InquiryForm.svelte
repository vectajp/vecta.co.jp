<script lang="ts">
  import { env } from "$env/dynamic/public";
  import type { ProductId } from "./content";

  let { product }: { product: ProductId } = $props();
  const baseUrl = env.PUBLIC_CONTACT_FORM_BASE_URL || "https://www.vecta.co.jp";
  const origin = new URL(baseUrl).origin;
  const src = $derived(new URL(`/contact/${product}/`, baseUrl).href);
  const productName = $derived(
    product === "chat" ? "SwarrowChat" : "SwarrowCall",
  );
  let frame: HTMLIFrameElement | undefined = $state();
  let height = $state(1080);

  function resize(event: MessageEvent) {
    if (event.origin !== origin || event.source !== frame?.contentWindow)
      return;
    const message = event.data;
    if (
      message?.type !== "swarrow-contact-height" ||
      message.product !== product
    )
      return;
    if (typeof message.height !== "number" || !Number.isFinite(message.height))
      return;
    height = Math.max(400, Math.min(2400, message.height));
  }
</script>
<svelte:window onmessage={resize} />
<section id="contact" class="inquiry" aria-labelledby="inquiry-title">
  <h2 id="inquiry-title">お問い合わせ</h2>
  <iframe
    bind:this={frame}
    {src}
    title={`${productName}のお問い合わせフォーム`}
    style:height={`${height}px`}
    loading="lazy"
  ></iframe>
</section>
<style>
  .inquiry {
    background: var(--sc-bg-card);
    color: var(--sc-navy);
    padding: 64px 20px;
    scroll-margin-top: 120px;
  }
  h2 {
    text-align: center;
    font-size: clamp(28px, 3vw, 38px);
    margin: 0 0 32px;
  }
  iframe {
    display: block;
    width: 100%;
    max-width: 724px;
    margin: 0 auto;
    border: 0;
  }
</style>
