![logo](public/assets/logo.svg)

# vecta.co.jp

[![CI](https://github.com/vectajp/vecta.co.jp/actions/workflows/ci.yml/badge.svg)](https://github.com/vectajp/vecta.co.jp/actions/workflows/ci.yml)

Vecta のコーポレートサイト。

ロゴアイコンは、「書類」などのアナログ情報を、ベクトルデータの「ブロック」へ構造化することで、世の中の知識を使いやすく整理し、誰でもアクセスできる仕組みを組み立てるという Vecta のミッションを表現したものです。

## 技術スタック

- **フロントエンドフレームワーク**: [SvelteKit](https://svelte.dev/docs/kit)
- **静的出力**: `@sveltejs/adapter-static`
- **記事管理**: `.svelte` 記事 component + typed registry
- **スタイル**: Svelte component scoped CSS + `src/styles/global.css`
- **パッケージマネージャー**: [Bun](https://bun.sh/)
- **コード品質管理**: [Biome](https://biomejs.dev/) + `svelte-check` + Bun test
- **コミット規約**: Conventional Commits (Lefthook + commitlint)
- **フォント**: Noto Sans JP

## 開発方法

### 必要条件

- Bun 1.3.14
- [mise](https://mise.jdx.dev/) (オプション: ツールバージョン管理)

### セットアップ

```bash
# mise がインストールされている場合
mise run bootstrap  # または mise bs

# mise がない場合
bun install
```

### 環境変数の設定

```bash
# 環境変数ファイルを作成
cp .env.example .env.local

# .env.local を編集して必要な値を設定
# PUBLIC_API_BASE_URL=http://localhost:8787
PUBLIC_GA_MEASUREMENT_ID=
```

#### 本番環境の設定

本番環境では、Cloudflare Pages ダッシュボードで手動で環境変数を設定する必要があります。

1. Cloudflare Pages にログイン
2. 対象プロジェクトを選択
3. 「設定」→「環境変数」に移動
4. 以下の変数を追加
   - 変数名: `PUBLIC_API_BASE_URL`
   - 値: `https://api.vecta.co.jp`
5. 「保存してデプロイ」をクリック

この設定を行わないと、本番環境でお問い合わせフォームが動作しません。

### Google Analytics 4

Vecta のアクセス状況は Google Analytics 4 で計測する。`PUBLIC_GA_MEASUREMENT_ID` には、このサイト専用の GA4 プロパティの Measurement ID を設定する。

- `.env.example` と Git には実 ID を保存しない。
- Cloudflare Pages の Production と Preview に、それぞれ `PUBLIC_GA_MEASUREMENT_ID` を設定する。
- 値が未設定または不正な場合は、Google Analytics を読み込まない。
- デプロイ後は Tag Assistant と GA4 Realtime で、タグが1個だけ検出されることを確認する。
- プライバシー開示は `/privacy/` で公開する。開示文面は Production 反映前に事業・法務責任者が確認する。

### 開発コマンド

```bash
# 開発サーバーの起動 (http://localhost:4321)
bun run dev

# プロダクションビルド
bun run build

# ビルドのプレビュー
bun run preview
```

### コード品質管理

```bash
# コードフォーマット
bun run format

# lint + Svelte 型チェック + test
bun run check

# lint + 自動修正
bun run check:fix

# ツール情報の確認 (mise が必要)
mise run doctor  # または mise dr
```

## プロジェクト構成

```text
vecta.co.jp/
├── public/                  # 静的ファイル
│   ├── article/             # 記事用画像
│   ├── assets/              # ロゴ・アイコンなどのアセット
│   └── icons/               # ファビコン・アプリアイコン
├── src/
│   ├── app.html             # SvelteKit app shell
│   ├── lib/
│   │   ├── articles/        # 記事 registry と本文 component
│   │   └── vecta/           # Vecta 用 content / UI / SEO helper
│   ├── routes/              # SvelteKit routes
│   │   ├── +page.svelte     # トップページ
│   │   ├── article/         # 記事一覧・記事詳細
│   │   └── sitemap-index.xml/
│   └── styles/
│       └── global.css       # グローバル CSS 変数・共通スタイル
├── tools/                   # 開発ツール・スクリプト
├── dist/                    # ビルド出力 (gitignored)
└── ...
```

## コンテンツ管理

### サイト本文

トップページの会社情報、ナビゲーション、プロジェクト情報は `src/lib/vecta/content.ts` で型付きデータとして管理します。

### 記事

記事 metadata は `src/lib/articles/registry.ts` で管理し、本文は `src/lib/articles/posts/*.svelte` に Svelte component として作成します。

新しい記事を追加する場合は、以下を更新します。

1. `src/lib/articles/posts/NewArticle.svelte` を追加
2. `src/lib/articles/registry.ts` に `slug`、title、description、publishedAt、heroImage、component import を追加
3. 必要に応じて `public/article/` に画像を追加
4. `bun run check` と `bun run build` を実行

記事 URL は `/article/{slug}/` の trailing slash 形式で静的生成されます。

### ダイジェスト記事

デジタル庁の記者会見動画を要約したダイジェスト記事は、Markdown 本文 (`src/lib/articles/posts/*.md`) を固定テンプレートの Svelte ラッパー経由で `MarkdownBody.svelte` が描画します。registry のエントリには重複生成防止の照合キーとして `videoId` を含めます。

記事の生成は `.claude/skills/digest/` スキル (Claude Code) と取得 CLI (`scripts/digest/`) が担当し、公開は必ず PR の人間レビューを経ます。

## デザインガイドライン

### カラーパレット

- ネイビー (#0A1E3C)
  - メインカラー、テキストやアクセント
- ゴールデンオレンジ (#E69500)
  - 強調要素、CTA ボタンなど
  - コントラスト（白背景）: 約 4.5:1（AA 基準クリア）
- 墨色 (#2F2F2F)
  - 見出し、ボディテキスト

### レスポンシブ

主要 breakpoints は component scoped CSS の media query として直接定義します。

- 480px: モバイル
- 600px: タブレット小
- 768px / 769px: タブレット境界
- 1024px: デスクトップ
- 1280px: ワイドスクリーン

### フォント

- 見出し: Noto Sans JP (Bold)
- 本文: Noto Sans JP (Regular)

## お問い合わせ機能

### 概要

サイト内のお問い合わせフォームは、外部 API と連携して動作します。

### 必要な設定

1. `PUBLIC_API_BASE_URL` の設定
2. API サーバー側の CORS 設定
   - 許可する Origin: `https://vecta.co.jp`, `https://www.vecta.co.jp`
   - 開発環境: `http://localhost:4321`

### フォーム仕様

- **必須項目**: お名前、メールアドレス、件名、メッセージ
- **任意項目**: 会社名、電話番号
- **バリデーション**: Svelte state で touched field ごとに表示
- **文字数制限**
  - お名前: 100文字以内
  - 件名: 200文字以内
  - メッセージ: 1000文字以内
- **送信先**: `POST {PUBLIC_API_BASE_URL}/contacts`

## SEO / 静的出力

- `src/lib/vecta/seo.ts` で title、canonical、OGP、JSON-LD、sitemap を生成します。
- `/sitemap-index.xml` は SvelteKit endpoint として prerender されます。
- `public/robots.txt` は `https://www.vecta.co.jp/sitemap-index.xml` を参照します。
- `vite.config.ts` の adapter-static 設定により、出力先は Cloudflare Pages 互換の `dist/` です。

## デプロイメント

### Cloudflare Pages

このサイトは Cloudflare Pages にデプロイされています。

- **自動デプロイ**: GitHub の main ブランチへの push で自動デプロイ
- **ビルドコマンド**: `bun run build`
- **出力ディレクトリ**: `dist`
- **環境変数**: Cloudflare Pages ダッシュボードで設定

### 自動チェック

GitHub Actions では以下を実行します。

- `bun install`
- `bun run check`
- `bun run build`

## トラブルシューティング

### お問い合わせフォームが動作しない

1. ブラウザの開発者ツールで console / network error を確認
2. CORS エラーの場合は API サーバー側で Origin の許可設定を確認
3. 405 エラーの場合は API endpoint の path と method (`POST`) を確認
4. `PUBLIC_API_BASE_URL` が設定されているか確認

### ビルドエラー

- `bun install` を実行して依存関係を更新
- `.svelte-kit` と `dist` を削除して再ビルド
- `bun run check` で Svelte 型エラーと test failure を確認

## ライセンス

All rights reserved © Vecta
