---
paths:
  - "biome.json"
  - "**/biome.json"
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.json"
  - "**/*.jsonc"
  - "**/*.svelte"
---

# biome.json の規約

Biome がこのリポジトリの唯一のフォーマッタ兼リンターである。ESLint や Prettier を併用して追加しないこと。重複するフォーマッタ同士が同じファイルを取り合うことになる。

- **スタイルは個人の好みではなく設定で固定されている**: ダブルクォート、セミコロン常に有り、インデント2スペース、行幅80カラム。異なるスタイルに手動整形するのではなく、保存時 / pre-commit で Biome にフォーマットさせる。
- **`assist.actions.source.organizeImports` は `"on"`。** import 順序は自動管理されるため、「整理」のために手動で並べ替えないこと。Biome が再ソートするだけである。
- **`vcs.useIgnoreFile: true` により Biome は `.gitignore` を自動的に尊重する。** 無視パターンを Biome 専用の別リストに重複させないこと。
- **`files.ignoreUnknown: false` で `includes: ["**"]`。** Biome はすべてをチェックする。ベンダー/生成ディレクトリを追加する場合は `includes` に除外パターン(例: `"!path/to/vendor"`)を追加し、フォーマット未適用のまま警告が出続ける状態を放置しないこと。
- **`bun run check` / `bun run check:fix` で実行する**(`bun.md` 参照)。lefthook の pre-commit フックがステージ済みの `.ts` / `.json` / `.svelte` に対して既に `biome check --write` を実行し再ステージするため(`git-hooks.md` 参照)、コミット前の手動実行は必須ではなく親切程度の位置づけ。
- **エディタ側は自動的に追従する。** `.vscode/settings.json` が `.ts` / `.js` / `.json` / `.jsonc` に対して `biomejs.biome` をデフォルトフォーマッタとして保存時整形を設定済み。Biome が扱う言語を増やした場合は、そのファイルの言語別セクションも揃えること。
- **`.svelte` 対応は `html.experimentalFullSupportEnabled: true` により有効化しているが、2026年現在も実験的機能。** `<script>` / `<style>` ブロックと HTML 風のテンプレート構造を整形・リントするが、`{#if}` / `{#each}` などの Svelte 固有制御構文の整形保証は公式にも明記されていない。Prettier / eslint-plugin-svelte の追加は禁止(唯一のフォーマッタ/リンターの原則に反する)なので、Biome の出力をそのまま正として受け入れる運用とする。不安定さが問題になった場合は `overrides` で `.svelte` を formatter 対象から外し、リンティングのみ有効にする方向で縮退させる(Prettier 系ツールの追加ではなく)。
