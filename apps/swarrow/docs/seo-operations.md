# SEO 運用チェックリスト

Issue: https://github.com/vectajp/swarrow.com/issues/6

`swarrow.com` を検索エンジンからクロールできる状態にし、自治体向け
AI 窓口・電話対応の検索意図に合わせて運用するための確認手順。

## 事前条件

- Cloudflare Pages / DNS の設定を確認できる担当者がいる
- Google Search Console の所有権確認を行える担当者がいる
- 認証情報、token、DNS TXT 値、Search Console verification file は repo に保存しない

## deploy 前の repo 確認

```sh
bun --bun run test:seo
bun run check
bun run build
```

- `build/robots.txt` に `Sitemap: https://swarrow.com/sitemap.xml` が含まれる
- `build/sitemap.xml` に `https://swarrow.com/` が含まれる
- build 後の root HTML に `title` / `description` / canonical / JSON-LD が含まれる

## Cloudflare / DNS 確認

Cloudflare の `error code: 1016` は origin DNS error なので、SEO 施策より先に
公開到達性を復旧する。

- Cloudflare の custom domain が `swarrow.com` に紐付いている
- `swarrow.com` の DNS record が Cloudflare Pages の公開先に向いている
- `www.swarrow.com` を使う場合は、redirect 先と canonical 方針を別途確認する
- 復旧後、次のコマンドが 200 系を返す

```sh
curl -I -L https://swarrow.com/
curl -I -L https://swarrow.com/robots.txt
curl -I -L https://swarrow.com/sitemap.xml
```

`https://swarrow.com/` が `error code: 1016` または HTTP 530 を返す間は、
Googlebot がページを取得できない可能性が高い。

## Search Console 確認

1. Google Search Console で `swarrow.com` の property を確認する
2. 所有権確認は担当者が実施し、認証情報や token を repo に保存しない
3. `https://swarrow.com/sitemap.xml` を sitemap として送信する
4. URL 検査と検索パフォーマンスを確認できる権限があることを確認する

## Search Console 変更前ベースライン

公開前に root URL `https://swarrow.com/` へ絞り、直近28日と前28日の
`clicks`、`impressions`、`CTR`、`average position` を記録する。
平均掲載順位は補助指標とし、impressions と clicks の傾向を優先する。
回答品質メッセージの公開日と、変更前の title、description、H1 も同じ記録へ
残し、どのコピーに対する検索結果かを後から判別できるようにする。

対象クエリ群:

- Brand: `Swarrow`、`Swarrow Chat`、`Swarrow Call`
- Chat: `自治体 AI チャットボット`、`自治体 ホームページ AI`、
  `自治体 AI 窓口`
- Call: `自治体 AI コールセンター`、`自治体 AI 電話対応`、
  `AI 受電 自治体`
- Integrated: `自治体 問い合わせ 自動化`、`住民問い合わせ 自動化`、
  `電話 チャット 一元化`
- Answer Quality: `自治体 AI 回答精度`、`自治体 AI 参照元`、
  `自治体 AI 誤回答対策`

Performance report の Query filter と Page filter を使う。低頻度 query は
privacy 保護のため省略される場合があるので、0件を実装失敗とは扱わない。
Answer Quality 群は上記3語を起点とし、実際に impressions が発生した関連語を
記録して次回比較へ追加する。

## 公開直後

1. root、`robots.txt`、`sitemap.xml` が200系で取得できることを確認する。
2. URL Inspection の「公開 URL をテスト」を root、`/chat`、`/call` の3URLで
   実行し、それぞれ Page fetch、Crawl allowed、Indexing allowed を確認する。
3. user canonical が、root は `https://swarrow.com/`、`/chat` は
   `https://swarrow.com/chat`、`/call` は `https://swarrow.com/call` と、
   各 URL 自身になっていることを確認する。
4. Schema Markup Validator で構造化データを確認する。root は
   `Organization`、`WebSite`、2つの `Service` を含む1つのグラフ、`/chat` と
   `/call` はそれぞれ `Organization` と該当製品の `Service` のみを含む
   グラフになる。
5. Rich Results Test は Google 対応型だけを確認する。`Service` は rich result
   対応型ではないため、検出されないことを失敗にしない。
6. Facebook Sharing Debugger と Twitter Card Validator で root、`/chat`、
   `/call` の OGP カード表示を確認する。3ページとも個別の `og:image` を
   持つため、それぞれ意図した画像が表示されることを確認する。
7. root URL の index 登録を1回だけリクエストする。繰り返し要求しない。
8. sitemap がすでに Success なら、内容が変わらない今回の変更では再送信を
   必須にしない。

## 公開7日後

- indexed version の last crawl が公開後へ更新されたか確認する。
- Google canonical と user canonical が root URL で一致するか確認する。
- Google が取得した HTML に新しい title、2製品名、回答品質を示す H1 が
  反映されたか確認する。
- sitemap の Status が Success で、root URL が index 対象か確認する。

## 公開28日後

- 変更後28日と変更前28日を、同じ root URL・5つの query 群で比較する。
- `impressions`、`clicks`、`CTR` の変化を記録する。
- `average position` は検索意図や競合で変動するため補助指標として扱う。
- impressions が増え CTR が下がった場合は title、description、H1 と query の
  一致を見直す。
- Answer Quality 群が0件でも公開失敗とはしない。既存の Brand、Chat、Call、
  Integrated 群への流入を併記し、回答品質メッセージが全体の CTR に与えた
  変化を確認する。
- `site:swarrow.com` は補助確認に留め、Search Console を判断の正とする。

Search Console API は OAuth と外部状態を必要とし、URL Inspection API も
Google index 内の版だけを返すため、今回の CI には組み込まない。

## 成果確認

- `site:swarrow.com` で page が検出される
- Search Console に sitemap が検出される
- Search Console の URL 検査で root URL が取得可能になる
- 検索クエリは `自治体 AI 電話対応`、`AI 受電 自治体`、
  `住民問い合わせ 自動化` に加え、`自治体 AI 回答精度`、
  `自治体 AI 参照元`、`自治体 AI 誤回答対策` を確認する

検索順位や即時 index は保証しない。公開到達性、クロール可能性、metadata、
sitemap、Search Console の検出状況を継続的に確認する。

## 公式リファレンス

- [URL Inspection API](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect)
- [サイトマップの作成と送信](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [再クロールを Google にリクエストする](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
- [構造化データに関する一般的なガイドライン](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Search Console Insights の検索パフォーマンス](https://support.google.com/webmasters/answer/17010961?hl=ja)
- [Schema Markup Validator](https://validator.schema.org/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
