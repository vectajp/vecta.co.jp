---
paths:
  - "tsconfig.json"
  - "**/tsconfig.json"
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.svelte"
---

# tsconfig.json の規約

ルートの `tsconfig.json` は常に `strict` を有効にしている。これを緩めないこと(`any` への設定上の逃げ道を作らず、型そのものを直す)。

- **ルートの `tsconfig.json` は `./.svelte-kit/tsconfig.json`(SvelteKit が `svelte-kit sync` で生成する設定、gitignore 対象)を `extends` する。** `$lib` / `$app/*` のパスエイリアスや `lib`(`esnext`/`DOM`/`DOM.Iterable`)、`moduleResolution`/`module`/`target`/`noEmit` はこの生成ファイル側で決まるため、ルート側で重複定義しない。生成ファイルが存在しないと(`bun install` 前など)壊れるので、必ず `prepare` スクリプト(`bun.md` 参照)で `svelte-kit sync` を先に走らせる。
- **`noEmit: true` は `.svelte-kit/tsconfig.json` 側で設定される意図的な値。** 型チェックとエディタ補完のためだけに存在し、`bunx tsc --noEmit` および `bunx svelte-check --tsconfig ./tsconfig.json` で実行する(lefthook の pre-commit フックにも組み込み済み、`git-hooks.md` 参照)。本番用ビルドは `tsc` ではなく `vite build`(adapter-static、`build` スクリプト、`bun.md` 参照)が担う。
- **`.svelte` ファイルの型チェックは `tsc` ではなく `svelte-check` が担う。** 素の `tsc` は `.svelte` 構文を解釈できないため、`<script>` ブロックの型エラーやプロパティの型不整合は `bun run check` に含まれる `svelte-check --tsconfig ./tsconfig.json` でのみ検出できる。`tsc --noEmit` はあくまで `tools/` や `src/lib` の `.ts` ファイル向けの補助チェックという位置づけ。
- **`compilerOptions.types` はルートでは指定しない。** SvelteKit 公式スキャフォールドに合わせているため、ここに `["bun"]` 等を追加しないこと(ブラウザ側コードに Bun のグローバル型が誤って混入する)。
- **`tools/tsconfig.json` はルート設定を `extends` し、`include: ["**/*.ts"]` に加えて `compilerOptions.types: ["bun"]` を独自に指定している。** ルートが `.svelte-kit/tsconfig.json` の chain に乗り Bun 型を含まなくなったため、`tools/` 配下で使う Bun 固有のグローバル(`Bun.spawnSync`、`Bun.file`)や Node 由来の `process` を解決するにはここで明示的に再指定する必要がある(継承任せにすると `Cannot find name 'Bun'` 等で `bunx tsc --noEmit -p tools/tsconfig.json` が失敗する。実際に検証済み)。新しいトップレベルディレクトリに独自の `.ts` を追加する場合も、ルートの `include` を広げるのではなく、この extend + スコープ限定 + 必要な `types` 明示のパターンを踏襲する。
- **`skipLibCheck` / `esModuleInterop` はサードパーティ依存との互換性のために設定している。** 「より厳格にする」ためにこれらを無効化しないこと。サードパーティの `.d.ts` に対するビルドが壊れるだけである。
