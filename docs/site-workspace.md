# サイトの統合と公開

## 構成

`vectajp/vecta.co.jp` に会社サイトと製品サイトをまとめる。公開ドメインとビルド出力は分ける。

|対象|ソース|ビルド（ルートから）|出力|
|---|---|---|---|
|www.vecta.co.jp|`src/`, `public/`|`bun --bun run build`|`dist/`|
|swarrow.com|`apps/swarrow/`|`bun --bun run build:swarrow`|`apps/swarrow/build/`|
|共通ニュース|`packages/site-content/news.ts`|両サイトで参照|各出力に含む|

インストールはルートで `bun install --frozen-lockfile`。ルートのロックファイルとmiseを使う。
`bun --bun run check` は両サイトのlint・型検査とVectaのテスト、`bun --bun run test:seo` はSwarrowのSEO検証、`bun --bun run build:all` は両サイトの静的ビルド。

通常の開発は `bun --bun run dev` と `bun --bun run dev:swarrow` を別ターミナルで起動する。
Vectaの開発中の製品リンクは、既定で `http://127.0.0.1:4326` のSwarrowを開く。別のポートを使う場合はVectaに `PUBLIC_SWARROW_SITE_BASE_URL` を設定する。本番ビルドではこの値を使わず、`https://swarrow.com` を参照する。
デザイン・資料・コピーの共通方針はルートの `DESIGN.md`。

## インポート元

- Swarrowの元リポジトリ: `vectajp/swarrow.com`、基準コミット `e6be984`。
- 本チャットで作成した `codex/swarrow-site-refresh` の未コミット改修を含めて取り込んだ。
- 旧リポジトリ・チェックアウトは保持。過去の履歴は旧リポジトリを参照する。統合後の改修は `apps/swarrow/` に行う。
- Axiswは製品本体の別リポジトリとして維持。機能の説明やニュースを作る際は同じチャットで参照する。

## Cloudflare Pagesの公開元切替

ローカルの統合実装だけでは本番の公開元は切り替わらない。この変更ではコミット・push・デプロイ・DNS変更は行っていない。

1. Vectaの既存Pagesは、リポジトリルート・`bun run build`・出力`dist`を維持できる。既存環境変数を維持し、先にVectaと `/contact/chat/` `/contact/call/` を公開する。
2. SwarrowのPagesは統合リポジトリのルートを対象とし、ビルド`bun run build:swarrow`・出力`apps/swarrow/build`にする。インストール時にルートのworkspaceを解決するため、ビルドルートを`apps/swarrow`に限定しない。
3. Git連携のリポジトリを既存Pagesプロジェクトで変更できない場合は、新しいPagesプロジェクトでプレビューを検証してから既存ドメインを移す。既存プロジェクトは新しい公開を確認するまで残す。
4. Swarrow専用のGA、既存ダウンロードAPI、Turnstileなどの公開設定を移す。実値はGitに置かない。`PUBLIC_CONTACT_FORM_BASE_URL` は通常未設定でよい（Vecta本番を使用）。
5. 両ドメインのトップ・Chat・Call・ニュース・問い合わせ・sitemapを確認し、実際の受付経路を確認してから切替完了とする。

## 問い合わせ

製品ページ末尾にはVectaのフォーム `/contact/chat/` または `/contact/call/` を埋め込む。
通常問い合わせを既存のVecta `/contacts` APIで受け付ける。資料送付用のSwarrow `/download-requests` とは用途を分ける。

- 件名: `[SwarrowChat] 入力された件名` または `[SwarrowCall] 入力された件名`
- 本文冒頭: `送信元ページ: https://swarrow.com/chat` または `/call`
- メタデータを追加した後も既存APIの文字数上限内であることを検証する。
- Vecta本体からの問い合わせは既存の件名・本文を維持する。
- iframe高さの通知では、親側で送信元origin・window・製品を照合する。
- ローカルでフォームを確認するときは、Swarrowに `PUBLIC_CONTACT_FORM_BASE_URL=http://127.0.0.1:4325`、Vectaにローカル仮受付の `PUBLIC_API_BASE_URL` を指定する。テスト入力を本番受付に送らない。
- 会社情報はVectaの `/company/`。Swarrowの開発サーバーでは、上記のローカルVecta URLを設定している場合に会社情報リンクも同じサーバーへ向ける。本番ビルドはVectaの正式URLを使う。
- ニュース本文へのリンクも、開発中は上記のローカルVecta URLを使う。本番ビルドのリンクはVectaの正式URLを維持する。

## ニュース

共通のタイトル・日付・説明・対象サービスは `packages/site-content/news.ts`。本文は `src/lib/articles/posts/`、対応するローダーは `src/lib/articles/registry.ts`。
採択は2026-08-03、運用開始は2026-10-01、デジタル行政掲載は2026-10-01、NHK掲載は2026-10-17として、4本の別記事にする。運用開始日は事業者本人の確認に基づく。ニュースの日付は各出来事に合わせ、今回の本文作成・修正日は2026-10-19として記録する。共通ニュースは日付の新しい順に表示する。
開発記事の日付も実装・検証記録に合わせる。掲載済み12本の日付とコミットの根拠は `docs/news-plan-202604-202610.md` に記載。開発・Stg段階は開発レポートとし、本番提供開始とは区別する。Swarrow共通ページとSwarrowChatページは最新3件だけを表示し、全件はVectaのニュース一覧へリンクする。ChatのニュースとFAQは独立したセクションにする。
当初の記事案は `docs/news-candidates-20261018.md` に保存する。
