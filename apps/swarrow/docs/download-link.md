# 資料ダウンロードリンク

## 概要

資料ダウンロードフォーム送信時に、問い合わせ者のメールアドレス宛に
ダウンロードリンク付きメールを自動送信する。

PDF は Cloudflare Pages には配置しない。Pages は単一ファイル 25 MiB 超の
asset を配信できないため、資料 PDF は Google Drive など外部ストレージの
共有 URL で管理する。

ダウンロードリンクの生成とメール送信は `swarrow.com-backend` が担当する。
frontend 側は資料 PDF を保持しない。資料請求 API 連携の設定は
[資料請求 API 連携](download-request-api.md) を参照する。

## PDF の差し替え手順

1. 新しい PDF ファイルを Google Drive などの共有先に配置する
2. PDF ファイル単体の共有 URL を取得する
3. `swarrow.com-backend` の `DOWNLOAD_URL` を新しい URL に更新する
4. 既存メール向けの互換 URL を維持するため、`static/_redirects` の
   `/downloads/swarrow_call.pdf` 転送先も同じ URL に更新する
5. `swarrow.com-backend` と `swarrow.com` を deploy する

```sh
bun x wrangler deploy --minify
```

申込者向けメールには、`DOWNLOAD_URL` の値がそのまま記載される。
過去に送信済みの `https://swarrow.com/downloads/swarrow_call.pdf` は
`static/_redirects` により同じ資料 URL へ転送する。

## Google Drive URL の注意

共有フォルダ URL ではなく、PDF ファイル単体の共有 URL を使用する。共有先の
権限は、申込者がログインや追加承認なしで閲覧できる設定にする。
