# サイト更新方針

- 文章・見た目を扱う作業（資料も含む）は必ず [DESIGN.md](DESIGN.md) を読み、共通ルールを適用する。
- リポジトリの構成とコマンドは CLAUDE.md を参照する。
- ユーザーが指定していない説明文、キャッチコピー、CTAを追加しない。特にトップは指定されたメッセージと画像を中心にし、導入相談・資料請求などのボタンを自動で足さない。
- サービス名は SwarrowChat / SwarrowCall と表記し、分割しない。アイコンは当面共通にする。
- SwarrowChatの見出しは「自治体ホームページ」「AIチャットボット」の2行。本文中では自然な文として表記する。
- 短い見出しに装飾目的の句読点や改行を加えない。ユーザーが明示した改行は保持する。
- サイトの実装・プレビューと、本番公開は区別する。

## 統合サイト

- ルートの `src/` はVecta、`apps/swarrow/` はSwarrowChat/SwarrowCall。両者は同じGitリポジトリの別ビルド。
- 共通ニュースは `packages/site-content/news.ts`。新しい記事には本文ローダーも追加する。
- `bun run check` と `bun run test:seo` と `bun run build:all` で両サイトを確認する。
- 開発・公開元切替は `docs/site-workspace.md`。旧Swarrowリポジトリは公開元切替まで保持する。
