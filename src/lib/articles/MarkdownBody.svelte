<script lang="ts">
  import { renderMarkdown } from './markdown'

  type Props = {
    source: string
  }

  let { source }: Props = $props()

  const html = $derived(renderMarkdown(source))
</script>

<article class="article-body">
  {@html html}
</article>
