import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap'
// @ts-check
import { defineConfig } from 'astro/config'
// https://astro.build/config
export default defineConfig({
  // 公開 URL。正しいサイトマップ生成に必須
  site: 'https://www.vecta.co.jp',
  // 追加の統合機能
  integrations: [sitemap(), mdx()],
})
