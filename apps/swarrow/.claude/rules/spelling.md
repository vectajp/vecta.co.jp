---
paths:
  - "cspell.json"
  - "app-words.txt"
  - "**/*.md"
  - "**/*.ts"
  - "**/*.svelte"
---

# cspell の規約

cspell はすべての `**/*.{ts,md,svelte}` ファイル(英語辞書)をチェックし、lefthook の `pre-commit` フックでステージ済みファイルに対して実行される(`git-hooks.md` 参照)。`.svelte` はテンプレート内の LP コピーも含めてチェック対象になる。

- **`app-words.txt` はワークスペース辞書。** 実在の英単語ではないが正当な語(ブランド名・モデル名・ツール名・ドメイン用語)を1行1語、大文字小文字を区別して登録する。
- **cspell が正当だが未知の単語を検出した場合、インラインの `// cspell:ignore` コメントやルール無効化ではなく `app-words.txt` に追加する。** これにより例外が各所に散らばらず、1箇所でレビュー可能な状態を保てる。
- **`ignorePaths` は既に `node_modules` / `dist` / `build` / `.svelte-kit` / `tmp` / `.claude` を除外している。** 生成物やベンダーコードを個別のファイルで無視コメントを使って回避するのではなく、`cspell.json` の `ignorePaths` を拡張すること。
