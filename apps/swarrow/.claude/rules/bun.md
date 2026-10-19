---
paths:
  - "package.json"
  - "**/package.json"
  - "bunfig.toml"
  - "**/bunfig.toml"
  - "bun.lock"
---

# Bun の規約

Bun がこのリポジトリの唯一のランタイム・パッケージマネージャー・スクリプトランナーである。`dev` / `build` / `preview` は SvelteKit の Vite プラグイン経由で実行され(`vite dev` / `vite build` / `vite preview`)、`build` は adapter-static により `build/` へ静的プリレンダリングする(型チェックはどちらとも別、`typescript.md` 参照)。

- **バージョンは完全固定のみ。** `bunfig.toml` の `install.exact = true` により、`bun add` / `bun install` は `package.json` に `^` を付けない完全固定バージョンを書き込む。手動で caret 範囲に戻さないこと。
- **`bun.lock` はコミット対象であり、`package.json` と常に同期させる。** 依存関係を変更したら `bun install` を実行し、同じ変更の中で更新されたロックファイルもコミットする。
- **スクリプトがエントリーポイント。** `dev`(Vite dev server)、`build`(adapter-static によるプリレンダリング、出力先 `build/` は gitignore 対象でコミットしない)、`preview`(`build/` のローカルプレビュー)、`prepare`(`svelte-kit sync` — `$app`/`$lib` の型生成を install 後に自動実行)、`check` / `check:fix`(Biome + svelte-check、`biome.md` / `typescript.md` 参照)、`clean`(`git clean -xdf node_modules build .svelte-kit`、`tools/clean.sh` から `mise run clean` 経由でも呼ばれる)。繰り返し使うコマンドは、別の場所にアドホックなシェルワンライナーとして書くのではなく、ここにスクリプトとして追加する。
- **`clean` が消せるのは未追跡 / gitignore 対象のパス(`node_modules`、`build`、`.svelte-kit`)だけ。** `git clean` は追跡済み(コミット済み)ファイルを絶対に削除しないため、`bun.lock` をここに含めてはいけない。`bun.lock` は意図的にコミットする対象であり(上記 `bun.lock` の項目を参照)、含めても最初にコミットされた瞬間から git clean に黙って無視されるだけである。
- **ターミナルから直接コマンドを叩く場合は `bun --bun run dev` のように `--bun` を付ける。** `--bun` を省略すると、`bun run` 経由でも Vite (`node_modules/.bin/vite` の shebang 経由)が Node.js で実行されうる(Bun 公式ガイド参照)。`package.json` の `scripts` 定義自体は素の `vite dev` 等のままでよい。
- **Bun のバージョン自体は `mise.toml` で固定する(ここでは固定しない、`mise.md` 参照)。** `package.json` に `engines` フィールドを追加しないこと。第二の正になり、乖離し得る。
- **VectaリポジトリのBun workspace。** ロックファイルとツールチェーンはリポジトリルートに統一する。
