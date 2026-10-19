import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

const DEV_SERVER_PORT = 5179;
const PREVIEW_SERVER_PORT = 4174;

export default defineConfig({
  ssr: {
    noExternal: ["@lucide/svelte"],
  },
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
        // Svelte 6 で不要になるまでの暫定措置: node_modules 配下のライブラリを除き runes モードを強制する。
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
      },
      adapter: adapter(),
    }),
  ],
});
