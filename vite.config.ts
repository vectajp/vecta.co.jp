import adapter from '@sveltejs/adapter-static'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

const DEV_SERVER_PORT = 4321
const PREVIEW_SERVER_PORT = 4173

export default defineConfig({
  server: {
    port: DEV_SERVER_PORT,
    strictPort: true,
  },
  preview: {
    port: PREVIEW_SERVER_PORT,
    strictPort: true,
  },
  plugins: [
    sveltekit({
      compilerOptions: {
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
      },
      files: {
        assets: 'public',
      },
      adapter: adapter({
        pages: 'dist',
        assets: 'dist',
        strict: true,
      }),
    }),
  ],
})
