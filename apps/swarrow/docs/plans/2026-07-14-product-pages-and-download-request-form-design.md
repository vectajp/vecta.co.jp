# Swarrow Chat/Call 別ページ化と資料請求フォーム改修 設計

- 作成日: 2026-07-14
- ステータス: Draft（設計承認待ち）
- Issue: https://github.com/vectajp/swarrow.com/issues/9
- 選択アプローチ: 共有レイアウトコンポーネント方式（`/chat`・`/call` を新規ルート化）
- 対応範囲: `swarrow.com`（frontend）+ `swarrow.com-backend`（backend）
- 設計確度: 82%

## Context

ユーザーから2枚のスクリーンショット（トップページのヒーロー周辺、資料ダウンロード
モーダル）に赤字注釈を付けた画像が共有され、次の5点の改修要望が示された。

1. ヒーローの CTA ボタンを Swarrow Chat / Swarrow Call の2つに分け、それぞれ
   別ページへ遷移させる。
2. カスタマーサクセス（導入支援）の説明を、共通セクションから各製品ページへ
   移動する。
3. お問い合わせモーダルのタイトルを「資料ダウンロード」に変更する。
4. フォームに「部署」欄を追加する。
5. フォームから「ふりがな」欄を削除する。

現状の `swarrow.com` は次の構成になっている。

- `src/routes/+page.svelte` 一枚に全セクションを実装した単一ページ構成
  （`src/routes` 配下に他のルートは存在しない）。`src/routes/+layout.ts` は
  `prerender = true` を設定しており、adapter-static 上で新規ルートを
  追加すること自体は技術的に問題ない。
- Swarrow Chat / Swarrow Call は同一ページ内の `#chat` / `#call` アンカー
  セクション（`feature-band`）として実装されている。
- ヒーローの CTA は単一ボタン「導入相談・デモを依頼する」で、
  `src/lib/swarrow/ContactModal.svelte` を開く。
- `ContactModal.svelte` は UI 上「お問い合わせ」だが、実体は
  `swarrow.com-backend` の `POST /download-requests`（資料請求 API）へ
  送信しており、完了画面も「資料ダウンロードリンクを含むご案内をお送り
  します」という文言になっている（`docs/download-request-api.md` 参照）。
- フォーム項目は 自治体・団体名（必須）、氏名（必須）、ふりがな（必須）、
  メールアドレス（必須）、お問い合わせ内容（任意）の5項目。
- `swarrow.com-backend` の `DownloadRequestCreate` スキーマ（`src/types.ts`）は
  `nameKana` を `requiredString` として要求しており、D1 の
  `migrations/0001_create_download_requests_table.sql` でも
  `name_kana TEXT NOT NULL` になっている。
- `vecta-admin` リポジトリは本ワークスペース（`vectajp/`）に未 clone のため、
  admin lead 一覧・詳細 UI が `personNameKana` / 新設予定の
  `personDepartment` をどう扱うかは本設計では検証できていない。

`tests/seo/build-output.test.ts` と `tests/seo/content.test.ts` には、
現在の単一ページ構成（`#chat`・`#call`・`#support` の存在とページ内順序、
sitemap は root URL のみ、`products` の `href` が `#` 始まり、モーダルの
フィールド数・必須マーク数・`nameKana` フィールドの存在）を前提にした
アサーションが多数あり、実装時に明示的な書き換えが必要である。

## Boundaries（Never / Always / Ask First）

- **Never**: production の D1 に対する破壊的マイグレーション
  （`name_kana` 列の削除）を、ユーザーへの確認なしに実行しない。
- **Never**: `swarrow.com-backend` の deploy を `swarrow.com`（frontend）より
  後に回さない。スキーマ不整合の期間を作らないため、deploy 順序は
  「D1 マイグレーション → backend Worker deploy → frontend build/deploy」を
  厳守する。
- **Always**: request/response フィールドを変更する場合、frontend・backend
  双方の実装・テスト・docs を同時に更新する（ワークスペース
  `vectajp/CLAUDE.md` の横断確認ルールに従う）。
- **Always**: `swarrow.com` で `bun --bun run test:seo` /
  `bun --bun run check` / `bun --bun run build` を、`swarrow.com-backend` で
  `bun run test` / `bun run check` を実装完了前に通す。
- **Ask First**: production D1 への destructive マイグレーション実行前に、
  必ずユーザーへ確認する（本設計フェーズでは実行しない）。
- **Ask First**: `vecta-admin` 側の lead 表示への影響（後述の Open
  Questions）を、実装着手前に可能であれば確認する。

## Architecture

### 採用アプローチ: 共有レイアウトコンポーネント方式

`src/lib/swarrow/ProductPage.svelte`（仮称）を新設し、現在
`+page.svelte` にある `feature-band`（機能紹介）とカスタマーサクセスの
レイアウトを1箇所に共通化する。`src/routes/chat/+page.svelte` /
`src/routes/call/+page.svelte` はこのレイアウトに製品別データ（コピー、
動画、カスタマーサクセスの3ステップ、CTA 文言など）を渡すだけの薄い
ラッパーとする。既存コードは `products` / `callCapabilities` /
`customerSuccessSteps` など既にデータ駆動でセクションを描画しており、
この方式が既存パターンと一貫する。

対案（ページごとに独立実装してマークアップ・CSS をコピーする方式）は
初期実装は速いが、共通デザイン変更のたびに2箇所を同期する必要があり
既存のデータ駆動パターンからも外れるため不採用とした。

### CTA / ナビゲーション設計

- ヒーロー: 単一ボタン「導入相談・デモを依頼する」を廃止し、
  「Swarrow Chat」「Swarrow Call」の2ボタンにする。それぞれ `/chat`・
  `/call` へ遷移する通常リンク（モーダルは開かない）。
- グローバルナビ: 「Swarrow Chat」「Swarrow Call」は `#chat`・`#call` への
  アンカーではなく `/chat`・`/call` への直接リンクに変更する。
  「導入支援」項目（`#support`）はカスタマーサクセス説明が各製品ページに
  分散するため削除する。
- ヘッダー右上 CTA・ページ下部 CTA ボタンの文言は、モーダルの目的変更に
  合わせて「資料ダウンロード」系の文言へ統一する（正確な文言は Open
  Questions を参照）。
- `ContactModal.svelte` のタイトルを「資料ダウンロード」に、リード文も
  資料ダウンロードの文脈に合わせて調整する。

### トップページの再構成

- `#chat`・`#call` の `feature-band` セクションと `#support`
  （カスタマーサクセス）セクションはトップページから削除し、内容を
  `/chat`・`/call` の該当ページへ移設する（トップページとの二重管理は
  行わない）。
- トップページは hero + `#products`（既存の製品ティーザーグリッド。
  リンク先を `#chat`/`#call` から `/chat`/`/call` へ変更） + `#knowledge`
  （共有知識基盤） + `#operations`（共通運用） + `#news` + 下部 CTA に
  絞る。

### フォーム変更

- 削除: ふりがな（`nameKana`）欄。
- 追加: 部署欄（任意）。配置は「自治体・団体名」の直後、「氏名」の
  前（ユーザー提供画像の注釈位置に合わせる）。
- 必須マークは「自治体・団体名」「氏名」「メールアドレス」の3つになる
  （部署・お問い合わせ内容は任意）。

### ファイル変更リスト

**swarrow.com（frontend）**

| 種別 | パス | 内容 |
| --- | --- | --- |
| 新規 | `src/routes/chat/+page.svelte` | Swarrow Chat 専用ページ |
| 新規 | `src/routes/call/+page.svelte` | Swarrow Call 専用ページ |
| 新規 | `src/lib/swarrow/ProductPage.svelte` | 機能紹介＋カスタマーサクセスの共有レイアウト |
| 編集 | `src/routes/+page.svelte` | hero CTA を2ボタン化、`#chat`/`#call`/`#support` 削除、products href 更新、ナビ更新 |
| 編集 | `src/lib/swarrow/content.ts` | `Product.href` 型を実URLへ変更、製品別 feature/customer-success データを追加、`jsonLd` の `url` を実URLへ |
| 編集 | `src/lib/swarrow/ContactModal.svelte` | タイトル変更、ふりがな欄削除、部署欄追加、送信 payload 調整 |
| 編集 | `static/sitemap.xml` | `/chat`・`/call` の URL を追加 |
| 編集 | `tests/seo/content.test.ts` | `products.href` アサーション更新 |
| 編集 | `tests/seo/build-output.test.ts` | セクション順序・sitemap URL数・modal フィールド数/必須数・`nameKana` 関連アサーション更新、新規ページ向けアサーション追加 |
| 編集 | `docs/download-request-api.md` | payload 例から `nameKana` 削除、`department` 追加 |
| 編集 | `AGENTS.md`（`CLAUDE.md` の実体） | 「単一ページ構成を維持する」旨の記述を、`/chat`・`/call` を含む構成に更新 |

**swarrow.com-backend**

| 種別 | パス | 内容 |
| --- | --- | --- |
| 編集 | `src/types.ts` | `DownloadRequestCreate` から `nameKana` 削除、`department`（optional）追加、`AdminLead` に `personDepartment`（optional）追加 |
| 編集 | `src/endpoints/downloadRequestCreate.ts` | insert / response から `name_kana` 除去、`department` 追加 |
| 編集 | `src/endpoints/adminLead.ts` | `DOWNLOAD_REQUEST_ADMIN_SELECT_COLUMNS`、`DownloadRequestRow` 型、`toAdminLead()` マッピングから `name_kana` 除去、`department` 追加 |
| 編集 | `src/services/email.ts` | 通知メールテンプレートから ふりがな行を削除、部署行を追加 |
| 新規 | `migrations/0003_remove_name_kana_add_department.sql` | `name_kana` 列削除 + `department` 列追加（nullable） |
| 編集 | `src/index.test.ts` | 全テストペイロードから `nameKana` を除去、`department` を含むテストケースを追加 |

## Acceptance Criteria（Given-When-Then）

1. Given トップページを表示したとき、When ヒーローセクションを見ると、
   Then 「Swarrow Chat」「Swarrow Call」の2つのボタンが表示され、
   それぞれクリックすると `/chat`・`/call` に遷移する。
2. Given `/chat` ページを表示したとき、Then 旧トップページの `#chat`
   feature-band 相当のコンテンツと、Swarrow Chat 向けにカスタマイズ
   された カスタマーサクセス説明が表示される。
3. Given `/call` ページを表示したとき、Then 旧トップページの `#call`
   feature-band 相当のコンテンツと、Swarrow Call 向けにカスタマイズ
   された カスタマーサクセス説明が表示される。
4. Given トップページを表示したとき、Then `#chat`・`#call`・`#support`
   のセクションは存在しない。
5. Given 資料ダウンロードモーダルを開いたとき、Then タイトルは
   「資料ダウンロード」であり、フィールドは 自治体・団体名（必須）・
   部署（任意）・氏名（必須）・メールアドレス（必須）・
   お問い合わせ内容（任意）の5項目で、ふりがな欄は存在しない。
6. Given フォームへ入力し送信したとき、Then `POST /download-requests`
   へ `companyName`・`department`・`name`・`email`・`inquiry`・
   `turnstileToken` が送信され、`nameKana` は送信されない。
7. Given `swarrow.com-backend` が新スキーマでリクエストを受信したとき、
   Then D1 の `download_requests` テーブルに `department` が保存され、
   `name_kana` 列は存在しない。
8. Given 資料請求を受けて管理者向け通知メールが送信されたとき、Then
   メール本文に部署が含まれ、ふりがなは含まれない。
9. Given `swarrow.com` で `bun --bun run test:seo` を実行したとき、Then
   新しいページ構成・フォーム項目に基づき全テストが成功する。
10. Given `swarrow.com-backend` で `bun run test` を実行したとき、Then
    新スキーマに基づき全テストが成功する。

## Decisions Made

1. **ページ構成**: 単一ページ規約を転換し、`/chat`・`/call` を新規
   SvelteKit ルートとして追加する（確信度 85%）。根拠: ユーザー提供
   画像の注釈「別ページに遷移する」という明示的要求。adapter-static +
   `prerender = true` により追加ルートは技術的に問題なく実現可能
   （Phase 1 で `src/routes/+layout.ts` を確認済み）。ユーザーが
   Phase 3 で明示的に選択。
2. **対応範囲**: `swarrow.com`（frontend）と `swarrow.com-backend` を
   1つの設計でカバーする（確信度 90%、ユーザー選択）。根拠:
   ふりがな削除・部署追加はリクエストフィールド契約の変更であり、
   `vectajp/CLAUDE.md` が両リポジトリ横断の追跡を要求している。
3. **`name_kana` 列の扱い**: 列・スキーマ・メールテンプレートから
   完全削除する（確信度 70%、ユーザー選択）。根拠: 過去に収集された
   ふりがなデータは失われるが、ユーザーが nullable 化案ではなく
   完全削除を明示的に選択した。実行時は破壊的マイグレーションとして
   別途ユーザー確認を要する（Boundaries の Ask First 参照）。
4. **`department` フィールド**: 任意入力とする（確信度 80%、
   ユーザー選択）。根拠: フォームの入力ハードルを上げないため。
5. **CTA ボタン文言**: ヘッダーナビ・下部 CTA・モーダルすべてを
   「資料ダウンロード」系の文言に統一する（確信度 80%、ユーザー
   選択）。根拠: モーダルの目的が変わる以上、呼び出し元ボタンの
   文言も揃えないとユーザーが混乱する。
6. **実装方式**: 共有レイアウトコンポーネント（`ProductPage.svelte`）
   + 製品別データによる DRY 実装を採用する（確信度 75%、ユーザー
   選択）。根拠: 既存コードが `products` / `callCapabilities` /
   `customerSuccessSteps` など既にデータ駆動パターンを採用しており、
   この方式が最も一貫する。
7. **トップページの再構成**: `#chat`・`#call`・`#support` セクションは
   新ページへ完全移設し、トップページには残さない（確信度 80%、
   ユーザー選択）。根拠: コンテンツの二重管理を避け、各ページの
   役割を明確化する。
8. **グローバルナビ**: Chat/Call リンクは新ページ URL へ、
   「導入支援」項目は削除する（確信度 80%、ユーザー選択）。根拠:
   カスタマーサクセス説明が各製品ページに分散するため、トップ
   レベルの単一アンカーとして成立しなくなる。

## Open Questions（ユーザーには未確認）

- `/chat`・`/call` 向けカスタマーサクセス説明の具体的なコピー内容
  （現状の共通コピーをどう製品別に書き分けるか）は、実装時に既存の
  トーン＆マナーを踏襲して作成する前提とし、事前にユーザーへ確認して
  いない。
- ヘッダーナビ・下部 CTA・モーダルの「資料ダウンロード」系ボタンの
  正確な文言（例:「資料ダウンロードを依頼する」等）は未確定であり、
  実装時に決定する前提とし、事前にユーザーへ確認していない。
- `vecta-admin` リポジトリ（本ワークスペース未 clone）側で、削除される
  `personNameKana` と新設する `personDepartment` が lead 一覧・詳細 UI に
  どう影響するかは未検証。`swarrow.com-backend` の `AdminLead` zod
  スキーマ上は両フィールドとも optional のため API 契約としては
  後方互換だが、UI 表示の要否・表示是非は事前にユーザーへ確認して
  いない。
- 部署フィールドを `vecta-admin` の管理画面リード詳細に表示するかどうか
  は、今回のユーザー要望（公開 LP フォームの変更）には含まれておらず
  Non-Goal として扱う前提だが、実際の営業運用で必要になる可能性がある
  ため、事前にユーザーへ確認していない。

## Non-Goals

- `vecta-admin` の管理 UI 自体の変更（lead 一覧・詳細画面のフィールド
  表示追加）は本設計のスコープ外。
- 導入事例（`showCaseStudies`）の有効化は対象外。
- Swarrow Chat / Swarrow Call 以外の新規ページ追加（料金ページ等）は
  対象外。
- カスタマーサクセスの新規コピー文言そのもののマーケティング承認・
  最終確定は対象外とし、実装時のドラフトを前提とする。
