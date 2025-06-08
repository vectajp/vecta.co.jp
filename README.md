![hero.svg](public/assets/logo.svg)

# vecta.co.jp

Vectaのコーポレートサイト。

ロゴアイコンは、「書類」などのアナログ情報を、ベクトルデータの「ブロック」へ構造化することで、世の中の知識を使いやすく整理し、誰でもアクセスできる仕組みを組み立てるというVectaのミッションを表現したものです。

## 技術スタック

- **フロントエンドフレームワーク**: [Astro.js](https://astro.build/) (静的サイトジェネレーター)
- **コンテンツ管理**: MDX / Markdown
- **スタイル**: SCSS / CSS Modules
- **パッケージマネージャー**: [Bun](https://bun.sh/)
- **コード品質管理**: [Biome](https://biomejs.dev/) (フォーマット・リント)
- **コミット規約**: Conventional Commits (Lefthook + commitlint)
- **フォント**: Noto Sans JP

## 開発方法

### 必要条件

- [Bun](https://bun.sh/) (推奨) または Node.js 18.x 以上
- [mise](https://mise.jdx.dev/) (オプション: ツールバージョン管理)

### セットアップ

```bash
# miseがインストールされている場合
mise run bootstrap  # または mise bs

# miseがない場合
bun install
```

### 環境変数の設定

#### 本番環境の設定（重要）

本番環境では、Cloudflare Pagesダッシュボードで手動で環境変数を設定する必要があります：

1. Cloudflare Pagesにログイン
2. 対象プロジェクトを選択
3. 「設定」→「環境変数」に移動
4. 以下の変数を追加：
   - 変数名: `PUBLIC_API_BASE_URL`
   - 値: `https://api.vecta.co.jp`
5. 「保存してデプロイ」をクリック

**注意**: この設定を行わないと、本番環境でお問い合わせフォームが動作しません。

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

# リント
bun run check

# リント + 自動修正
bun run check:fix

# ツール情報の確認 (miseが必要)
mise run doctor  # または mise dr
```

## プロジェクト構成

```
vecta.co.jp/
├── public/          # 静的ファイル
│   ├── article/     # 記事用画像
│   ├── assets/      # ロゴ・アイコンなどのアセット
│   └── icons/       # ファビコン・アプリアイコン
├── src/             # ソースコード
│   ├── assets/      # コンポーネントで使用するアセット
│   ├── components/  # Astroコンポーネント
│   ├── content/     # コンテンツ管理
│   │   └── article/ # MDX/Markdown記事
│   ├── data/        # ナビゲーションなどのデータ
│   ├── layouts/     # レイアウトコンポーネント
│   ├── pages/       # ページコンポーネント（ファイルベースルーティング）
│   │   └── article/ # 記事ページ
│   └── styles/      # グローバルスタイル・SCSS変数
│       └── scss/    # 共有SCSS（ブレイクポイントなど）
├── tools/           # 開発ツール・スクリプト
├── dist/            # ビルド出力（gitignored）
└── ...
```

## コンテンツ管理

### 記事（Article）

`src/content/article/` ディレクトリにMDXまたはMarkdownファイルを配置することで記事を追加できます。

記事のフロントマター：
```yaml
---
title: '記事タイトル'
description: '記事の説明'
pubDate: 'Jan 22 2025'
heroImage: '/article/hero-image.png' # オプション
---
```

- MDXファイルではAstroコンポーネントを使用可能
- Zodスキーマによる型安全な検証
- 自動的にRSSフィードに追加
- 動的ルーティング（`/article/[slug]`）

## デザインガイドライン

### カラーパレット

- ネイビー ( #0A1E3C )
  - メインカラー、テキストやアクセント
- ゴールデンオレンジ ( #E69500 )
  - 強調要素、CTAボタンなど
  - 視認性：◎（白背景：良好、黒背景：映える）
  - コントラスト（白背景）: 約 4.5:1（AA基準クリア）
- 墨色 (#2F2F2F) - 見出し、ボディテキスト

### レスポンシブブレイクポイント

- 480px: モバイル（小）
- 481px: モバイル（大）
- 600px: タブレット（小）  
- 768px: タブレット（中）
- 769px: タブレット（大）
- 1024px: デスクトップ
- 1280px: ワイドスクリーン

これらのブレイクポイントは `src/styles/scss/_breakpoints.scss` でSass変数として定義されており、各コンポーネントでインポートして使用します。

### フォント

- 見出し: Noto Sans JP (Bold)
- 本文: Noto Sans JP (Regular)

## 開発ツール

### コード品質

- **Biome**: 高速なフォーマッター・リンターツール
  - ESLint + Prettierの代替として使用
  - 設定は `biome.json` で管理

### Git Hooks

- **Lefthook**: 高速なGit hooks管理ツール
  - コミット前のフォーマット・リントを自動実行
  - Conventional Commitsの強制

### ツールバージョン管理

- **mise**: 開発環境のツールバージョンを統一
  - Node.js、Bunなどのバージョンを `mise.toml` で管理
  - カスタムタスクの定義

## ライセンス

All rights reserved © Vecta
