# 資料請求 API 連携

資料請求フォームは `swarrow.com-backend` の API に直接送信する。

```text
https://api.swarrow.com/download-requests
```

frontend 側はフォーム入力値と Cloudflare Turnstile token を送信し、資料請求
データの保存、社内通知メール、申込者向け資料ダウンロードリンクメールは
backend 側で処理する。

## 公開環境変数

build 時に以下の公開環境変数を設定する。SvelteKit では
`$env/dynamic/public` 経由で `PUBLIC_` プレフィックスの変数を参照する。

| 変数名 | 説明 |
| --- | --- |
| `PUBLIC_DOWNLOAD_REQUEST_API_URL` | 資料請求 API URL。未設定時は `https://api.swarrow.com/download-requests` を使用 |
| `PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key。未設定時はフォーム上に設定エラーを表示 |

ローカルでは `.env` に設定する。

```sh
PUBLIC_DOWNLOAD_REQUEST_API_URL=https://api.swarrow.com/download-requests
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

本番環境では Cloudflare Pages の build environment variables に同じ値を設定する。

## backend 側の前提

`swarrow.com-backend` は Cloudflare Workers として `api.swarrow.com` に
deploy され、`POST /download-requests` を公開する。

送信 payload は backend の `DownloadRequestCreate` schema と合わせる。

```json
{
  "companyName": "テスト株式会社",
  "department": "総務課",
  "name": "山田太郎",
  "email": "taro@example.com",
  "inquiry": "資料を確認したいです。",
  "turnstileToken": "turnstile-response-token"
}
```

## ローカル確認

```sh
bun run build
bun run preview
```

フォーム送信を実際に確認する場合は、`swarrow.com-backend` のローカル Worker
を起動し、`.env` の `PUBLIC_DOWNLOAD_REQUEST_API_URL` をローカル API に向ける。
