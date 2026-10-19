<script lang="ts">
  import { onMount } from 'svelte'
  import ContactForm from '$lib/vecta/ContactForm.svelte'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()
  const productName = $derived(
    data.product === 'chat' ? 'SwarrowChat' : 'SwarrowCall',
  )

  onMount(() => {
    const reportHeight = () =>
      window.parent.postMessage(
        {
          type: 'swarrow-contact-height',
          product: data.product,
          height: Math.ceil(document.body.getBoundingClientRect().height),
        },
        '*',
      )
    const observer = new ResizeObserver(reportHeight)
    observer.observe(document.body)
    reportHeight()
    return () => observer.disconnect()
  })
</script>
<svelte:head>
  <title>{productName}のお問い合わせ | Vecta</title>
  <meta name="robots" content="noindex,follow">
</svelte:head>
<main>
  <p class="product">お問い合わせ対象: {productName}</p>
  <ContactForm sourceProduct={data.product} />
  <p class="privacy">
    <a href="/privacy/" target="_blank" rel="noopener noreferrer"
      >個人情報の取り扱い</a
    >
  </p>
</main>
<style>
  main {
    max-width: 700px;
    margin: 0 auto;
    padding: 12px;
  }
  .product {
    color: var(--color-indigo);
    font-weight: 700;
    margin: 0 0 24px;
  }
  .privacy {
    font-size: 13px;
    margin: 20px 0 0;
  }
  .privacy a {
    text-decoration: underline;
  }
</style>
