# Vecta と Swarrow の GA4 計測・プライバシー開示設計

- Date: 2026-07-17
- Issue: https://github.com/vectajp/vecta.co.jp/issues/51
- Status: Approved design pending implementation

## Context

`vecta.co.jp` と `swarrow.com` は、ともに `@sveltejs/adapter-static` を使う静的 SvelteKit サイトである。両サイトの `src/app.html` は全公開ページの HTML head を共有するが、Google Analytics / Google Tag Manager は未導入である。

両サイトの利用状況を独立して分析するため、GA4 プロパティと Measurement ID はサイトごとに分ける。初回導入ではページビューと GA4 の拡張計測だけを対象とする。Google Ads、リマーケティング、User ID、独自イベントは導入しない。

Google Analytics の Privacy Disclosures Policy は、Analytics 利用時に利用とデータ収集・処理を開示することを求めている。利用者の閲覧を妨げない方針として、同意バナーは導入せず、フッターから到達できるプライバシー開示ページを両サイトに追加する。

References:

- https://support.google.com/analytics/answer/15756615
- https://support.google.com/analytics/answer/7318509
- https://support.google.com/analytics/answer/11994839

## Boundaries

### Never

- 実 Measurement ID、token、credential を Git に保存しない。
- 1ページに複数の Google tag を初期化しない。
- Google Ads 連携、リマーケティング、User ID、GTM、カスタムイベント、Consent Mode、地域判定を追加しない。
- 問い合わせフォームの入力値、URL parameter、その他の個人識別情報を Analytics event として送らない。
- 閲覧を妨げる同意モーダル・Cookie バナーを追加しない。

### Always

- `vecta.co.jp` と `swarrow.com` に別々の `PUBLIC_GA_MEASUREMENT_ID` を設定する。
- Measurement ID が未設定または `G-` 形式として不正な場合、Google tag を読み込まず、サイトの通常機能を維持する。
- 各サイトのフッターに `/privacy/` へのリンクを置き、GA4 の目的、Cookie 等による収集、Google の説明とオプトアウト導線を開示する。
- プライバシー開示ページには `noindex` を設定し、既存 sitemap には追加しない。
- Cloudflare Pages の Production と Preview に、サイトごとの Measurement ID を設定してからデプロイする。

### Ask First

- 公開するプライバシー開示の最終文面は、公開前に事業・法務責任者が確認する。
- Google Ads 連携、広告機能、リマーケティング、User ID、カスタムイベント、または対象地域の同意要件を追加する場合は、GA4 設定とサイト実装を再設計する。
- Analytics 利用を利用者識別可能なデータと突合する場合は、法務・プライバシー要件を確認してから進める。

## Architecture

### Google tag 初期化

両リポジトリの `src/app.html` の opening `<head>` 直後に、SvelteKit の `%sveltekit.env.PUBLIC_GA_MEASUREMENT_ID%` を読む最小の bootstrap script を置く。

bootstrap script は Measurement ID を `G-` で始まる英数字形式として検証する。有効な ID の場合だけ `dataLayer` と `gtag` queue を初期化し、`https://www.googletagmanager.com/gtag/js?id=...` を非同期で読み込んで `config` を1回だけ送る。未設定または不正な ID の場合は何も送信しない。

この配置により、SvelteKit のすべての prerendered route で同じ初期化を使い、ルート component ごとの重複を防ぐ。将来のイベント API を先回りして追加しない。

### 環境設定

Measurement ID は public configuration であり、secret ではない。ただし環境ごとの差し替えと誤配信を防ぐため、ソースには placeholder のみを保存する。

| Site | Repository variable template | Cloudflare Pages variables |
| --- | --- | --- |
| Vecta | `.env.example` | `PUBLIC_GA_MEASUREMENT_ID` for Production and Preview |
| Swarrow | `.env.template` | `PUBLIC_GA_MEASUREMENT_ID` for Production and Preview |

`vecta.co.jp` の ID と `swarrow.com` の ID は必ず異なる GA4 プロパティのものを使用する。ローカル／CI の出力確認には実運用ではない `G-TEST...` 形式の ID を一時的に与える。

### プライバシー開示

各サイトに `/privacy/` route を追加する。ページには少なくとも次を平易な日本語で示す。

1. GA4 をアクセス状況の把握とサイト改善に使うこと。
2. Cookie 等を通じて利用状況を収集・処理すること。
3. Google による情報利用の説明と、Google Analytics Opt-out Browser Add-on へのリンク。
4. 本設計では広告連携・リマーケティング・User ID・カスタムイベントを使わないこと。

ページは `noindex` とし、既存の sitemap source は変更しない。Vecta は既存の共有 `Footer.svelte` に、Swarrow は単一 LP のフッターにリンクを追加する。

### File-change list

| Repository | File | Change |
| --- | --- | --- |
| `vecta.co.jp` | `src/app.html` | 有効な public Measurement ID だけで Google tag を初期化する bootstrap を追加する。 |
| `vecta.co.jp` | `.env.example` | `PUBLIC_GA_MEASUREMENT_ID` の placeholder を追加する。 |
| `vecta.co.jp` | `README.md` | ローカル設定、Cloudflare Pages の Production / Preview 設定、検証手順を追加する。 |
| `vecta.co.jp` | `src/routes/privacy/+page.svelte` | `noindex` のプライバシー開示ページを追加する。 |
| `vecta.co.jp` | `src/lib/vecta/Footer.svelte` | `/privacy/` へのリンクを追加する。 |
| `vecta.co.jp` | `src/app.test.ts` | app shell の public env placeholder、ID guard、単一初期化を検証する。 |
| `swarrow.com` | `src/app.html` | 有効な public Measurement ID だけで Google tag を初期化する bootstrap を追加する。 |
| `swarrow.com` | `.env.template` | `PUBLIC_GA_MEASUREMENT_ID` の placeholder を追加する。 |
| `swarrow.com` | `README.md` | ローカル設定、Cloudflare Pages の Production / Preview 設定、検証手順を追加する。 |
| `swarrow.com` | `src/routes/privacy/+page.svelte` | `noindex` のプライバシー開示ページを追加する。 |
| `swarrow.com` | `src/routes/+page.svelte` | LP のフッターに `/privacy/` へのリンクを追加する。 |
| `swarrow.com` | `tests/seo/content.test.ts` | app shell の public env placeholder と開示ページ source を検証する。 |
| `swarrow.com` | `tests/seo/build-output.test.ts` | `/privacy/` の生成、`noindex`、フッターリンク、タグの単一出力を検証する。 |

Swarrow の `test:seo` はすでに build output を読むため、既存のテスト入口を拡張する。Vecta は `bun run check` が Bun の test discovery を実行するため、app shell 専用の source test を追加する。

## Acceptance Criteria

1. Given 異なる有効な `PUBLIC_GA_MEASUREMENT_ID` を各サイトのビルドへ与えたとき、When 任意の生成ページを開くと、Then 対応する ID の Google tag が1回だけ初期化される。
2. Given ID が未設定または不正なとき、When build と通常閲覧を行うと、Then Google tag request は発生せず、ページとフォームは通常どおり動作する。
3. Given 各サイトのトップ・記事を含む公開ページを表示したとき、When フッターを確認すると、Then `/privacy/` のリンクが存在して開示ページを開ける。
4. Given `/privacy/` を生成したとき、When head と sitemap を確認すると、Then `noindex` があり、既存 sitemap には追加されない。
5. Given 初回訪問時、When 任意ページを閲覧すると、Then Cookie 同意バナー・モーダルは表示されず、閲覧と問い合わせを妨げない。
6. Given 変更後、When 各リポジトリの既存品質ゲートを実行すると、Then Vecta の `bun run check` / `bun run build` と Swarrow の `bun --bun run test:seo` / `bun --bun run check` / `bun --bun run build` が成功する。
7. Given Production と Preview に別 ID を設定してデプロイしたとき、When Tag Assistant と GA4 Realtime を確認すると、Then 対応するサイトのページビューだけが各プロパティに届く。

## Decisions Made

| Decision | Rationale | Confidence |
| --- | --- | ---: |
| サイト別に GA4 プロパティと Measurement ID を分ける | Vecta の企業サイトと Swarrow の製品 LP は別の論理的な利用者基盤であり、レポートとアクセス権を混在させない。 | 95% |
| `app.html` に直接 Google tag を置く | すべての静的 route に確実に適用でき、今回不要な component abstraction を増やさない。 | 90% |
| `PUBLIC_GA_MEASUREMENT_ID` で設定する | 現在の public env 運用と合い、環境別 ID をコード変更なしで差し替えられる。 | 95% |
| Measurement ID の形式を検証して未設定時に無効化する | ローカル・CI・Preview で空または誤った ID による無効な Google tag request を防ぐ。 | 85% |
| 同意バナーを追加しない | 閲覧 UX を維持するという明示的な要件に従い、標準 GA4 の最小計測に限定する。 | 90% |
| `/privacy/` を footer から公開し `noindex` にする | Google Analytics 利用の開示を満たしつつ、検索対象ページと sitemap の変更を増やさない。 | 85% |
| Google Ads 等の拡張機能を除外する | 広告・識別子・同意要件を今回の最小導入へ持ち込まない。 | 95% |

## Open Questions

- Not raised with the user: プライバシー開示の最終文面を承認する事業・法務責任者。実装後、Production 反映前に確認する。
- Not raised with the user: 各 GA4 プロパティの作成担当者と実際の Measurement ID。実装時に Cloudflare Pages の Production / Preview へ設定する。

## Non-Goals

- 行動を基にした広告配信、リマーケティング、Google Ads conversion tracking。
- 問い合わせ完了・CTA クリックなどの custom event 計測。
- Cookie 同意バナー、Consent Mode、CMP、地域別の同意制御。
- GA4 からのデータエクスポート、BI 連携、Search Console 連携。
- GA4 の利用が各地域の法令・契約に適合することの法的判断。

## Verification Plan

### Repository checks

- `vecta.co.jp`: `bun run check`、テスト用 ID を設定した `bun run build`、生成 `dist/` の tag と `/privacy/` を確認する。
- `swarrow.com`: テスト用 ID を設定した `bun --bun run test:seo`、`bun --bun run check`、`bun --bun run build`、生成 `build/` の tag と `/privacy/` を確認する。

### Browser and production checks

1. ローカルで ID あり／なしの2条件を確認し、ID なしでは `googletagmanager.com` への request が発生しないことを確認する。
2. Cloudflare Pages の Preview へ各サイト固有の ID を設定し、Tag Assistant でタグが1個だけ検出されることを確認する。
3. Production で GA4 Realtime を確認し、別プロパティへの混入がないことを確認する。
4. フッターから `/privacy/` を開き、内容と `noindex` meta を確認する。
