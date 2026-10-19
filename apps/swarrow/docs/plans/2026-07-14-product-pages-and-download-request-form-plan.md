# Swarrow Chat/Call 別ページ化と資料請求フォーム改修 実装計画

**Goal:** ヒーロー CTA を Swarrow Chat / Swarrow Call の2ボタンに分割して `/chat`・`/call` の専用ページへ遷移させ、資料請求モーダルのタイトルを「資料ダウンロード」に統一し、フォームから「ふりがな」を削除して「部署」を追加する。

**Architecture:** `swarrow.com` は共有レイアウトコンポーネント方式を採用する。まずヘッダー・フッター・資料ダウンロードモーダルを `src/routes/+layout.svelte` へ抽出し（構造のみのリファクタ）、次に機能紹介＋カスタマーサクセスのレイアウトを `src/lib/swarrow/ProductPage.svelte` に共通化する。`/chat`・`/call` はこのレイアウトへ製品別データを渡す薄いラッパーとし、トップページは hero・products・knowledge・operations・news・下部 CTA に絞る。`swarrow.com-backend` は `DownloadRequestCreate`・`DownloadRequest`・`AdminLead` の3つの zod スキーマから `nameKana`/`name_kana`/`personNameKana` を削除し `department`/`personDepartment`(任意) を追加する、D1 マイグレーションで列を移行する。

**Tech Stack:** SvelteKit 2 (Svelte 5 runes) + adapter-static + Bun (`swarrow.com`)、Cloudflare Workers + Hono + Chanfana + Zod + D1 (`swarrow.com-backend`)。

**Design Document:** `/Users/yuki.sakurai/code/github/vectajp/swarrow.com/docs/plans/2026-07-14-product-pages-and-download-request-form-design.md`

**Related Issue:** https://github.com/vectajp/swarrow.com/issues/9

**Recommended Execution:** Loop (HITL) — 13タスク、複数リポジトリ・構造リファクタを含むため、要所でユーザー確認を挟みながら進める。

## 設計書からの逸脱・補足（レビューで確定した事項）

1. **ヘッダー/フッター/資料ダウンロードモーダルの3ページ共通化**: 設計書は `ProductPage.svelte`（feature-band + customer-success）のみを共有コンポーネント化の対象としているが、ヘッダー（グローバルナビ・資料ダウンロード CTA）とフッターは `/chat`・`/call` を含む全ページで必要になる。これを `+page.svelte` に個別実装すると3ページで重複するため、Task 4 で `src/routes/+layout.svelte` に抽出する（設計書に対する追加タスク）。
2. **downloadRequestList.ts / downloadRequestFetch.ts の name_kana 参照**: 設計書のファイル変更リストに記載がなかったが、両ファイルとも `name_kana` を SELECT 文と zod レスポンススキーマで参照しているため Task 2 に含める。
3. **README.md / CLAUDE.md / docs/MAIL_SETUP.md の nameKana/name_kana 記述**: `swarrow.com-backend` 側のドキュメント3点に payload 例・フィールド説明が残っているため Task 2 に含める。
4. **vecta-admin 影響調査（Task 0）**: ユーザー合意により、コード変更を伴わない調査タスクとして計画に含める。`personNameKana`/`personDepartment` は `AdminLead` zod スキーマ上どちらも optional のため API 契約としては後方互換であり、Task 2（backend契約変更）と並行して独立に実施できる。
5. **CTA 文言**: ヘッダー・下部 CTA・モーダル送信ボタンはすべて「資料ダウンロードを依頼する」に統一する（ユーザー確認済み）。
6. **カスタマーサクセス製品別コピー**: 既存の共通コピーのトーン＆マナーを踏襲したドラフトを Task 3 で作成する（ユーザー確認済み、マーケティング最終承認は対象外）。
7. **UI 構築タスクの TDD 適用範囲**: Task 2・3（backend契約・content.ts）は失敗するテストを先に書く厳密な TDD で進める。Task 5・6・8（`ProductPage.svelte` 新規作成、`/chat`・`/call` ルート新規作成、`ContactModal.svelte` 改修）は Svelte コンポーネント単体テストの既存基盤がなく、対応する自動テストを Task 10 に集約する設計判断とする。回帰保護は Task 4・7 で明示している `bun --bun run build` + `bun test tests/seo/build-output.test.ts` の green/red 確認、および各タスク末尾の目視確認（`bun --bun run preview`）で代替する。Task 5・6・8 完了後、Task 10 で自動テストが揃うまでは regression 保護が手薄になる点を認識した上で進める。
8. **`.chat-feature-title-label` の非対称性統一**: 既存 CSS はモバイル幅で chat 側タイトルのみ縮小する `.chat-feature-title-label` ルールを持ち、call 側には対応するクラス・ルールがない（call のタイトル文字数が同程度のため縮小しないと窮屈になる可能性がある）。`ProductPage.svelte` では chat/call を区別せず統一レンダリングするため、Task 5 でこのモバイル縮小ルールを両製品共通の `.product-feature-title-label` として適用する（call 側にも新たに縮小が効くようになる意図的な視覚差分。既存 CSS 値自体は変更しない）。

---

### Task 0: vecta-admin 影響調査（調査のみ、コード変更なし）

**対象リポジトリ:** `vecta-admin`（`vectajp/` ワークスペース直下に未 clone）

**Files:**

- 新規: `/Users/yuki.sakurai/code/github/vectajp/swarrow.com-backend/docs/vecta-admin-lead-department-investigation.md`

**Step 1: vecta-admin を clone**

```bash
gh repo clone vectajp/vecta-admin /Users/yuki.sakurai/code/github/vectajp/vecta-admin
```

**Step 2: personNameKana / personDepartment の参照箇所を調査**

```bash
cd /Users/yuki.sakurai/code/github/vectajp/vecta-admin
grep -rn "personNameKana\|personDepartment\|NameKana" src workers 2>/dev/null
```

- lead 一覧・詳細 UI で `personNameKana` を表示しているコンポーネントを特定する。
- `personDepartment` を表示する UI 変更が必要かどうかを判定する（UI 変更自体は Non-Goal、判定結果を記録するのみ）。

**Step 3: 調査結果をドキュメント化**

`/Users/yuki.sakurai/code/github/vectajp/swarrow.com-backend/docs/vecta-admin-lead-department-investigation.md` に以下を記録する。

```markdown
# vecta-admin への影響調査（personNameKana 削除 / personDepartment 追加）

- 調査日: {実施日}
- 対象: `AdminLead` zod スキーマの `personNameKana` 削除、`personDepartment`（任意）追加

## 結論

API 契約としては両フィールドとも optional のため後方互換。vecta-admin 側の zod パース・型は壊れない。

## personNameKana を表示している箇所

{grep 結果から列挙}

## personDepartment 表示要否

Non-Goal（今回は対象外）。営業運用上必要になった場合は別 Issue で `vecta-admin` に着手する。
```

**Step 4: コミット（swarrow.com-backend リポジトリ側）**

```bash
cd /Users/yuki.sakurai/code/github/vectajp/swarrow.com-backend
git add docs/vecta-admin-lead-department-investigation.md
git commit -m "docs(admin): vecta-admin への部署フィールド影響調査を記録"
```

---

### Task 1: D1 マイグレーション追加（swarrow.com-backend）

**Files:**

- 新規: `migrations/0003_remove_name_kana_add_department.sql`
- 編集: `package.json`

**Step 1: マイグレーション SQL を作成**

```sql
-- migrations/0003_remove_name_kana_add_department.sql
-- Remove name_kana column and add department column for the document request form redesign
ALTER TABLE download_requests DROP COLUMN name_kana;
ALTER TABLE download_requests ADD COLUMN department TEXT;
```

**Step 2: package.json のマイグレーションスクリプトを更新**

```json
"db:migrate:local": "wrangler d1 execute DB --local --file=./migrations/0001_create_download_requests_table.sql && wrangler d1 execute DB --local --file=./migrations/0002_add_abuse_protection_columns.sql && wrangler d1 execute DB --local --file=./migrations/0003_remove_name_kana_add_department.sql",
"db:migrate:remote": "wrangler d1 execute DB --remote --file=./migrations/0003_remove_name_kana_add_department.sql",
```

**Step 3: ローカル D1 で動作確認**

```bash
cd /Users/yuki.sakurai/code/github/vectajp/swarrow.com-backend
bun run db:reset:local
bun run db:migrate:local
wrangler d1 execute DB --local --command "PRAGMA table_info(download_requests)"
```

Expected: 出力に `name_kana` 列が存在せず、`department` 列（type `TEXT`, nullable）が存在する。

**Step 4: Commit**

```bash
git add migrations/0003_remove_name_kana_add_department.sql package.json
git commit -m "feat(db): download_requests に department 列を追加し name_kana を削除"
```

[Ask First] `bun run db:migrate:remote` は本番 D1 への破壊的マイグレーションであり、既存の `name_kana` データが失われる。このタスクではローカル確認のみに留め、リモート実行はユーザーへの別途確認後に行う（Boundaries の Never / Ask First 参照）。

---

### Task 2: フォーム契約変更 — 型・エンドポイント・メール・テスト（swarrow.com-backend）

密結合な契約変更のため1コミットにまとめる（型定義を変更した瞬間、依存する全エンドポイントがコンパイルエラーになるため分割不可）。

**Files:**

- 編集: `src/types.ts`
- 編集: `src/endpoints/downloadRequestCreate.ts`
- 編集: `src/endpoints/downloadRequestList.ts`
- 編集: `src/endpoints/downloadRequestFetch.ts`
- 編集: `src/endpoints/adminLead.ts`
- 編集: `src/services/email.ts`
- 編集: `src/index.test.ts`
- 編集: `README.md`
- 編集: `CLAUDE.md`
- 編集: `docs/MAIL_SETUP.md`

**Step 1: `src/index.test.ts` を新契約に合わせて書き換え、失敗させる**

全テストの送信 payload から `nameKana: 'やまだたろう'` を削除し、`department: '総務課'` を追加する（該当箇所は `createDownloadRequest` ヘルパーと個別の `JSON.stringify` 呼び出し全て）。期待値の `name_kana` チェックを `department` チェックへ置き換える。

`createDownloadRequest` ヘルパーを変更:

```ts
function createDownloadRequest(email = 'user@example.com') {
  return new Request('http://localhost/download-requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      companyName: 'テスト株式会社',
      name: '山田太郎',
      department: '総務課',
      email,
      inquiry: '資料を確認したいです。',
      turnstileToken: 'valid-turnstile-token',
    }),
  })
}
```

`downloadRequest` 固定オブジェクト（ファイル冒頭）を変更:

```ts
const downloadRequest = {
  id: 'download-request-id',
  company_name: 'テスト株式会社',
  name: '山田太郎',
  department: '総務課',
  email: 'taro@example.com',
  inquiry: '資料を確認したいです。',
  status: 'new',
  admin_email_sent_at: '2026-07-08 10:00:01',
  download_email_sent_at: '2026-07-08 10:00:02',
  turnstile_verified_at: '2026-07-08 10:00:00',
  client_ip_hash: 'client-ip-hash',
  user_agent: 'test-user-agent',
  mail_suppressed_reason: null,
  created_at: '2026-07-08 10:00:00',
  updated_at: '2026-07-08 10:00:02',
}
```

`'creates a new download request...'` テストの型定義とアサーションを変更:

```ts
const json = (await res.json()) as {
  success: boolean
  data: {
    id: string
    company_name: string
    name: string
    department: string | null
    email: string
    inquiry: string | null
    status: string
    admin_email_sent_at: string | null
    download_email_sent_at: string | null
    created_at: string
    updated_at: string
    turnstile_verified_at: string | null
    client_ip_hash: string | null
    user_agent: string | null
    mail_suppressed_reason: string | null
  }
}

expect(json.success).toBe(true)
expect(json.data.company_name).toBe('テスト株式会社')
expect(json.data.name).toBe('山田太郎')
expect(json.data.department).toBe('総務課')
expect(json.data.email).toBe('taro@example.com')
```

同ファイル内の他の `nameKana`/`name_kana` を含む全ての `JSON.stringify({...})` 送信 payload（`'returns validation errors...'`、`'rejects requests without Turnstile token'`、`'rejects requests when Turnstile validation fails'`、`'suppresses email delivery for duplicate email requests'`、`'suppresses email delivery when IP rate limit is exceeded'`、`'keeps request creation successful when download mail config is missing'` の各テスト）についても同様に `nameKana` 行を `department: '総務課'` へ置き換える。

`'returns normalized download request leads with valid Access JWT'` テストの期待値を変更:

```ts
expect(json.data[0]).toEqual({
  id: 'download-request-id',
  sourceSite: 'swarrow.com',
  leadType: 'document_request',
  companyName: 'テスト株式会社',
  personName: '山田太郎',
  personDepartment: '総務課',
  email: 'taro@example.com',
  subject: 'SwarrowCall 資料請求',
  message: '資料を確認したいです。',
  status: 'new',
  receivedAt: '2026-07-08T10:00:00+09:00',
  updatedAt: '2026-07-08T10:00:02+09:00',
})
```

さらに department が未入力の場合に `null` として保存されることを検証する新規テストを `describe('Download Requests API', ...)` 内に追加する:

```ts
test('stores a null department when the optional field is omitted', async () => {
  const { db, statements } = createMockDB()
  globalThis.fetch = createMockFetch(async (input) => {
    if (String(input).includes('turnstile')) {
      return Response.json({ success: true, hostname: 'swarrow.com' })
    }
    return new Response(null, { status: 202 })
  })

  const req = new Request('http://localhost/download-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      companyName: 'テスト株式会社',
      name: '山田太郎',
      email: 'taro@example.com',
      turnstileToken: 'valid-turnstile-token',
    }),
  })

  const res = await app.fetch(req, createBindings(db))

  expect(res.status).toBe(201)
  const json = (await res.json()) as { data: { department: string | null } }
  expect(json.data.department).toBeNull()
  expect(
    statements.some((statement) =>
      statement.query.includes('INSERT INTO download_requests'),
    ),
  ).toBe(true)
})
```

**Step 2: `bun run test` を実行し失敗を確認**

```bash
cd /Users/yuki.sakurai/code/github/vectajp/swarrow.com-backend
bun run test
```

Expected: FAIL（`nameKana`/`name_kana`/`personNameKana` 関連の型不一致・アサーション失敗）

**Step 3: `src/types.ts` を実装**

```ts
export const DownloadRequest = z.object({
  id: Str(),
  company_name: Str({
    example: 'テスト株式会社',
    description: '会社名',
  }),
  name: Str({ example: '山田太郎', description: 'お名前' }),
  department: Str({
    required: false,
    example: '総務課',
    description: '部署',
  }).nullable(),
  email: Email({ example: 'taro@example.com', description: 'メールアドレス' }),
  inquiry: Str({
    required: false,
    example: '資料を確認したいです。',
    description: 'お問い合わせ内容',
  }).nullable(),
  status: DownloadRequestStatus.default('new'),
  admin_email_sent_at: DateTime().nullable(),
  download_email_sent_at: DateTime().nullable(),
  turnstile_verified_at: DateTime().nullable(),
  client_ip_hash: Str().nullable(),
  user_agent: Str().nullable(),
  mail_suppressed_reason: Str().nullable(),
  created_at: DateTime(),
  updated_at: DateTime(),
})

export const DownloadRequestCreate = z.object({
  companyName: requiredString('会社名は必須です', 200),
  department: z
    .string({ invalid_type_error: '部署の形式が不正です' })
    .trim()
    .max(200, '部署は200文字以内で入力してください')
    .optional(),
  name: requiredString('氏名は必須です', 100),
  email: z
    .string({
      required_error: 'メールアドレスは必須です',
      invalid_type_error: 'メールアドレスは必須です',
    })
    .trim()
    .min(1, 'メールアドレスは必須です')
    .max(254, 'メールアドレスは254文字以内で入力してください')
    .email('メールアドレスの形式が正しくありません'),
  inquiry: z
    .string({ invalid_type_error: 'お問い合わせ内容が不正です' })
    .trim()
    .max(5000, 'お問い合わせ内容は5000文字以内で入力してください')
    .optional(),
  turnstileToken: z
    .string({
      required_error: '認証確認に失敗しました',
      invalid_type_error: '認証確認に失敗しました',
    })
    .trim()
    .min(1, '認証確認に失敗しました')
    .max(2048, '認証確認に失敗しました'),
})
```

`AdminLead` の `personNameKana` を削除し `personDepartment` を追加:

```ts
export const AdminLead = z.object({
  id: z.string(),
  sourceSite: z.enum(['vecta.co.jp', 'swarrow.com']),
  leadType: z.enum(['contact', 'document_request']),
  companyName: z.string().optional(),
  personName: z.string(),
  personDepartment: z.string().optional(),
  email: z.string(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().optional(),
  status: AdminLeadStatus,
  receivedAt: z.string(),
  updatedAt: z.string(),
  assignedTo: z.string().optional(),
  notes: z
    .array(
      z.object({
        author: z.string(),
        body: z.string(),
        createdAt: z.string(),
      }),
    )
    .optional(),
})
```

**Step 4: `src/endpoints/downloadRequestCreate.ts` を実装**

`responseSchema` の `data` オブジェクト内で `name_kana: z.string()` を `department: z.string().nullable()` に変更。

`handle()` 内の `downloadRequest` オブジェクト構築部を変更:

```ts
const downloadRequest = {
  id: nanoid(),
  company_name: parsed.data.companyName,
  name: parsed.data.name,
  department: parsed.data.department || null,
  email: parsed.data.email,
  inquiry: parsed.data.inquiry || null,
  status: ignored ? 'ignored' : 'new',
  admin_email_sent_at: null as string | null,
  download_email_sent_at: null as string | null,
  turnstile_verified_at: turnstileVerifiedAt,
  client_ip_hash: abuseProtection.clientIpHash,
  user_agent: abuseProtection.userAgent,
  mail_suppressed_reason:
    abuseProtection.mailSuppressedReason ??
    (ignored ? 'ignored_company_domain' : null),
  created_at: currentTime,
  updated_at: currentTime,
}
```

INSERT 文を変更:

```ts
const result = await c.env.DB.prepare(
  `INSERT INTO download_requests (
    id,
    company_name,
    name,
    department,
    email,
    inquiry,
    status,
    admin_email_sent_at,
    download_email_sent_at,
    turnstile_verified_at,
    client_ip_hash,
    user_agent,
    mail_suppressed_reason,
    created_at,
    updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
)
  .bind(
    downloadRequest.id,
    downloadRequest.company_name,
    downloadRequest.name,
    downloadRequest.department,
    downloadRequest.email,
    downloadRequest.inquiry,
    downloadRequest.status,
    downloadRequest.admin_email_sent_at,
    downloadRequest.download_email_sent_at,
    downloadRequest.turnstile_verified_at,
    downloadRequest.client_ip_hash,
    downloadRequest.user_agent,
    downloadRequest.mail_suppressed_reason,
    downloadRequest.created_at,
    downloadRequest.updated_at,
  )
  .run()
```

`emailData` 構築部を変更:

```ts
const emailData = {
  companyName: downloadRequest.company_name,
  name: downloadRequest.name,
  department: downloadRequest.department,
  email: downloadRequest.email,
  inquiry: downloadRequest.inquiry,
  submittedAt: formatDateJapanese(downloadRequest.created_at),
}
```

**Step 5: `src/endpoints/downloadRequestList.ts` を実装**

`downloadRequestSchema` の `name_kana: z.string()` を `department: z.string().nullable()` に変更。SELECT 文の `name_kana` を `department` に変更:

```ts
let query =
  'SELECT id, company_name, name, department, email, inquiry, status, admin_email_sent_at, download_email_sent_at, turnstile_verified_at, client_ip_hash, user_agent, mail_suppressed_reason, created_at, updated_at FROM download_requests'
```

**Step 6: `src/endpoints/downloadRequestFetch.ts` を実装**

レスポンススキーマの `name_kana: z.string()` を `department: z.string().nullable()` に変更。SELECT 文を変更:

```ts
const downloadRequest = await c.env.DB.prepare(
  'SELECT id, company_name, name, department, email, inquiry, status, admin_email_sent_at, download_email_sent_at, turnstile_verified_at, client_ip_hash, user_agent, mail_suppressed_reason, created_at, updated_at FROM download_requests WHERE id = ?',
)
  .bind(downloadRequestId)
  .first()
```

**Step 7: `src/endpoints/adminLead.ts` を実装**

```ts
export const DOWNLOAD_REQUEST_ADMIN_SELECT_COLUMNS =
  'id, company_name, name, department, email, inquiry, status, admin_email_sent_at, download_email_sent_at, turnstile_verified_at, client_ip_hash, user_agent, mail_suppressed_reason, created_at, updated_at'

export interface DownloadRequestRow {
  id: string
  company_name: string
  name: string
  department: string | null
  email: string
  inquiry: string | null
  status: string
  admin_email_sent_at: string | null
  download_email_sent_at: string | null
  turnstile_verified_at: string | null
  client_ip_hash: string | null
  user_agent: string | null
  mail_suppressed_reason: string | null
  created_at: string
  updated_at: string
}
```

`toAdminLead()` を変更:

```ts
export function toAdminLead(row: DownloadRequestRow): AdminLead {
  return {
    id: row.id,
    sourceSite: 'swarrow.com',
    leadType: 'document_request',
    companyName: row.company_name,
    personName: row.name,
    personDepartment: row.department ?? undefined,
    email: row.email,
    subject: 'SwarrowCall 資料請求',
    message: row.inquiry ?? undefined,
    status: toAdminLeadStatus(row.status),
    receivedAt: toAdminTimestamp(row.created_at),
    updatedAt: toAdminTimestamp(row.updated_at),
  }
}
```

**Step 8: `src/services/email.ts` を実装**

`DownloadRequestEmailData` インターフェースを変更:

```ts
export interface DownloadRequestEmailData {
  companyName: string
  name: string
  department: string | null
  email: string
  inquiry: string | null
  submittedAt: string
}
```

`sendAdminDownloadRequestEmail` のテキストテンプレートを変更（「■ふりがな」行を「■部署」行に置き換え）:

```ts
const textContent = `
資料ダウンロードリクエストがありました。

■会社名
${data.companyName}

■氏名
${data.name}

■部署
${data.department || '未入力'}

■メールアドレス
${data.email}

■お問い合わせ内容
${data.inquiry || '未入力'}

■受信日時
${data.submittedAt}
  `.trim()
```

HTML テンプレートの該当行も置き換え:

```html
<tr>
  <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">部署</td>
  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${escapeHtml(data.department || '未入力')}</td>
</tr>
```

**Step 9: ドキュメントを更新**

`README.md:79` の payload 例から `"nameKana": "やまだたろう",` を削除し `"department": "総務課",` を追加。

`CLAUDE.md:104` の記述を変更:

```markdown
- User-submitted fields: `company_name`, `name`, `department`, `email`,
  `inquiry`
```

`docs/MAIL_SETUP.md:81` の payload 例から `"nameKana": "やまだたろう",` を削除し `"department": "総務課",` を追加。

**Step 10: テスト実行して成功確認**

```bash
cd /Users/yuki.sakurai/code/github/vectajp/swarrow.com-backend
bun run test
bun run check
```

Expected: PASS（全テスト成功、Biome エラーなし）

**Step 11: Commit**

```bash
git add src/types.ts src/endpoints/downloadRequestCreate.ts src/endpoints/downloadRequestList.ts src/endpoints/downloadRequestFetch.ts src/endpoints/adminLead.ts src/services/email.ts src/index.test.ts README.md CLAUDE.md docs/MAIL_SETUP.md
git commit -m "feat(api): 資料請求フォームからふりがなを削除し部署を追加"
```

---

### Task 3: 製品別コンテンツデータ拡張（swarrow.com）

**Files:**

- 編集: `src/lib/swarrow/content.ts`
- 編集: `tests/seo/content.test.ts`

**Step 1: `tests/seo/content.test.ts` を新データ構造に合わせて書き換え**

`href` が `#` で始まることを検証している既存アサーションを実 URL 検証へ変更:

```ts
test("defines two equally addressable products", () => {
  expect(site).toBe("https://swarrow.com");
  expect(siteName).toBe("Swarrow");
  expect(products.map(({ id }) => id)).toEqual(["chat", "call"]);
  expect(products.map(({ name }) => name)).toEqual([
    "Swarrow Chat",
    "Swarrow Call",
  ]);
  expect(products.map(({ href }) => href)).toEqual(["/chat", "/call"]);
  expect(products.every(({ benefit }) => benefit.length > 0)).toBe(true);
  expect(products.map(({ backgroundIcon }) => backgroundIcon)).toEqual([
    "/swarrow-call/swarrow-chat-icon-flat.png",
    "/swarrow-call/swarrow-call-icon-flat.png",
  ]);
  expect(products.map(({ icon }) => icon)).toEqual([
    "/swarrow-call/swarrow-chat-icon-flat.png",
    "/swarrow-call/swarrow-call-icon-flat.png",
  ]);
});
```

`jsonLd` の `url` 検証を変更:

```ts
test("describes the site and two visible services in one graph", () => {
  const graph = jsonLd["@graph"] as readonly Record<string, unknown>[];
  const services = graph.filter((item) => item["@type"] === "Service");
  expect(services.map((item) => item.url)).toEqual([
    "https://swarrow.com/chat",
    "https://swarrow.com/call",
  ]);
});
```

`navItems` の新構成を検証する新規テストを追加:

```ts
test("links global nav directly to product pages without a support anchor", () => {
  expect(navItems.map(({ href }) => href)).toEqual([
    "/#products",
    "/chat",
    "/call",
  ]);
  expect(navItems.some(({ label }) => label === "導入支援")).toBe(false);
});
```

製品別 feature・カスタマーサクセスデータの存在を検証する新規テストを追加:

```ts
test("provides per-product feature copy and customer success steps", () => {
  expect(chatFeatureCopy.titleLabel).toBe("自治体ホームページAI窓口");
  expect(callFeatureCopy.titleLabel).toBe("自治体AIコールセンター");
  expect(chatCustomerSuccessSteps).toHaveLength(3);
  expect(callCustomerSuccessSteps).toHaveLength(3);
  expect(chatCustomerSuccessSteps[0]?.body).toContain("Swarrow Chat");
  expect(callCustomerSuccessSteps[0]?.body).toContain("Swarrow Call");
});
```

対応する import 文に `chatFeatureCopy`、`callFeatureCopy`、`chatCustomerSuccessSteps`、`callCustomerSuccessSteps`、`navItems` を追加する。

**Step 2: `bun test tests/seo/content.test.ts` を実行し失敗を確認**

```bash
cd /Users/yuki.sakurai/code/github/vectajp/swarrow.com
bun test tests/seo/content.test.ts
```

Expected: FAIL（未定義エクスポート、`href` 不一致）

**Step 3: `src/lib/swarrow/content.ts` を実装**

`Product` 型の `href` を実 URL に変更:

```ts
export type ProductId = "chat" | "call";

export type Product = {
  id: ProductId;
  name: string;
  category: string;
  benefit: string;
  useCases: readonly string[];
  href: `/${ProductId}`;
  backgroundIcon: `/swarrow-call/${string}.png`;
  icon: `/swarrow-call/${string}.png`;
};

export const products: readonly Product[] = [
  {
    id: "chat",
    name: "Swarrow Chat",
    category: "自治体ホームページAI窓口",
    benefit:
      "ホームページやLINEで住民の自己解決を促し、電話へ集中する前に定型的な質問へ回答します。",
    useCases: ["手続き案内", "必要書類", "施設案内", "予約・申請への誘導"],
    href: "/chat",
    backgroundIcon: "/swarrow-call/swarrow-chat-icon-flat.png",
    icon: "/swarrow-call/swarrow-chat-icon-flat.png",
  },
  {
    id: "call",
    name: "Swarrow Call",
    category: "自治体AIコールセンター",
    benefit:
      "AIが電話の一次受付、案内、取次、発信を担い、職員の電話対応を必要な案件へ絞ります。",
    useCases: ["代表電話", "時間外受付", "担当課取次", "リマインド・一括周知"],
    href: "/call",
    backgroundIcon: "/swarrow-call/swarrow-call-icon-flat.png",
    icon: "/swarrow-call/swarrow-call-icon-flat.png",
  },
];
```

`jsonLd` 内の `url: \`${site}/${product.href}\`` は `href` が既に `/chat` 形式になったため `url: \`${site}${product.href}\`` に変更する（重複スラッシュを防ぐ）。

製品別 feature コピー型・データを追加（既存の `+page.svelte` `#chat`/`#call` セクションの文言をそのまま移設）:

```ts
export type ProductFeatureCopy = {
  en: string;
  titleLabel: string;
  lead: string;
  list: { title: string; body: string }[];
};

export const chatFeatureCopy: ProductFeatureCopy = {
  en: "Municipal Web AI Desk",
  titleLabel: "自治体ホームページAI窓口",
  lead: "ホームページやLINEなど、住民が使い慣れた場所で定型的な質問へ回答します。必要な情報へ迷わずたどり着ける入口をつくり、電話をかける前の自己解決を支えます。",
  list: [
    {
      title: "ホームページやLINEに設置",
      body: "住民が普段利用するデジタル窓口から質問できます。",
    },
    {
      title: "自治体の資料をもとに回答",
      body: "FAQ、制度資料、手順書、業務データを案内に活かします。",
    },
    {
      title: "回答から次の手続きへつなぐ",
      body: "申請案内、予約、職員への連携など次の行動へ誘導します。",
    },
  ],
} as const;

export const callFeatureCopy: ProductFeatureCopy = {
  en: "Municipal AI Call Center",
  titleLabel: "自治体AIコールセンター",
  lead: "AI受電で定型的な質問へ案内し、必要な案件だけを職員へ取り次ぎます。受ける電話だけでなく、リマインドや一括周知など自治体からの発信も支援します。",
  list: [
    {
      title: "AI受電で一次対応",
      body: "FAQや手順書をもとに、住民からの電話へ案内します。",
    },
    {
      title: "用件を整理して職員へ取次",
      body: "内容や担当部署に応じ、必要な電話を職員へつなぎます。",
    },
    {
      title: "架電業務も自動化",
      body: "予約確認、督促、案内、周知などの発信を支援します。",
    },
  ],
} as const;
```

製品別カスタマーサクセスステップを追加（既存 `customerSuccessSteps` を chat/call 別に書き分け、動画・poster 素材は既存流用）:

```ts
export const chatCustomerSuccessSteps: CustomerSuccessStep[] = [
  {
    phase: "1",
    title: "導入準備",
    body: "対象部署とホームページ・LINEでの問い合わせ状況を整理し、Swarrow Chatの導入範囲を専任チームが一緒に設計します。",
    video: "/swarrow-call/customer-success-step-1.webm",
    poster: "/swarrow-call/customer-success-step-1-poster.webp",
    alt: "カスタマーサクセスチームが導入準備の説明会と進行を支援するイメージ",
  },
  {
    phase: "2",
    title: "初期構築",
    body: "自治体の要件をヒアリングし、FAQ、手順書、会話フローなどSwarrow Chatが利用する知識基盤を整えます。",
    video: "/swarrow-call/customer-success-step-2.webm",
    poster: "/swarrow-call/customer-success-step-2-poster.webp",
    alt: "カスタマーサクセスチームが初期構築の計画を整理するイメージ",
  },
  {
    phase: "3",
    title: "運用改善",
    body: "稼働して終わりではありません。定期的な利用率モニタリング、回答分析、改善提案まで継続します。",
    video: "/swarrow-call/customer-success-step-3.webm",
    poster: "/swarrow-call/customer-success-step-3-poster.webp",
    alt: "カスタマーサクセスチームが運用データを分析して改善するイメージ",
  },
];

export const callCustomerSuccessSteps: CustomerSuccessStep[] = [
  {
    phase: "1",
    title: "導入準備",
    body: "対象部署と電話問い合わせ業務を整理し、Swarrow Callの導入範囲を専任チームが一緒に設計します。",
    video: "/swarrow-call/customer-success-step-1.webm",
    poster: "/swarrow-call/customer-success-step-1-poster.webp",
    alt: "カスタマーサクセスチームが導入準備の説明会と進行を支援するイメージ",
  },
  {
    phase: "2",
    title: "初期構築",
    body: "自治体の要件をヒアリングし、FAQ、手順書、会話フローなどSwarrow Callが利用する知識基盤を整えます。",
    video: "/swarrow-call/customer-success-step-2.webm",
    poster: "/swarrow-call/customer-success-step-2-poster.webp",
    alt: "カスタマーサクセスチームが初期構築の計画を整理するイメージ",
  },
  {
    phase: "3",
    title: "運用改善",
    body: "稼働して終わりではありません。定期的な利用率モニタリング、回答分析、改善提案まで継続します。",
    video: "/swarrow-call/customer-success-step-3.webm",
    poster: "/swarrow-call/customer-success-step-3-poster.webp",
    alt: "カスタマーサクセスチームが運用データを分析して改善するイメージ",
  },
];

export const chatCustomerSuccessIntro = {
  lead: "成果を出すことにコミットする、専門チームの徹底した伴走サポート。",
  body: "Swarrow Chatは、導入して終わりのサービスではありません。専任チームが知識基盤の初期構築から利用状況の確認、継続的な改善まで伴走します。",
} as const;

export const callCustomerSuccessIntro = {
  lead: "成果を出すことにコミットする、専門チームの徹底した伴走サポート。",
  body: "Swarrow Callは、導入して終わりのサービスではありません。専任チームが知識基盤の初期構築から利用状況の確認、継続的な改善まで伴走します。",
} as const;
```

既存の共通 `customerSuccessSteps` エクスポートは `/chat`・`/call` へ完全移設されトップページで使われなくなるため削除する（設計書「トップページとの二重管理は行わない」に従う）。

`navItems` を実 URL 直接リンクへ変更し「導入支援」を削除:

```ts
export const navItems: NavItem[] = [
  { label: "製品", href: "/#products" },
  { label: "Swarrow Chat", href: "/chat" },
  { label: "Swarrow Call", href: "/call" },
];
```

hero の2ボタン CTA 用データを追加（既存の単一ボタン `heroCopy` からボタン文言を削除し、別エクスポートに分離）:

```ts
export const heroProductCtas: { productId: ProductId; label: string }[] = [
  { productId: "chat", label: "Swarrow Chat" },
  { productId: "call", label: "Swarrow Call" },
];
```

資料ダウンロード CTA の共通文言（ヘッダー・下部 CTA・モーダル送信ボタンで使い回す）を追加:

```ts
export const downloadCtaLabel = "資料ダウンロードを依頼する";
```

下部 CTA のページ別コピーを追加:

```ts
export type DownloadCtaCopy = {
  heading: string[];
  sub: string;
};

export const topDownloadCta: DownloadCtaCopy = {
  heading: [
    "Swarrow Chat・Swarrow Callの資料ダウンロード",
    "単独導入から併用まで、まずは資料でご確認ください。",
  ],
  sub: "現在の問い合わせ件数、対象部署、ホームページと電話の運用状況に合わせた資料をご案内します。",
};

export const chatDownloadCta: DownloadCtaCopy = {
  heading: ["Swarrow Chatの資料ダウンロード"],
  sub: "自治体ホームページAI窓口の詳細資料をお送りします。",
};

export const callDownloadCta: DownloadCtaCopy = {
  heading: ["Swarrow Callの資料ダウンロード"],
  sub: "自治体AIコールセンターの詳細資料をお送りします。",
};
```

**Step 4: `bun test tests/seo/content.test.ts` を実行し成功確認**

```bash
bun test tests/seo/content.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/swarrow/content.ts tests/seo/content.test.ts
git commit -m "feat(lp): 製品別ページ向けコンテンツデータを追加"
```

---

### Task 4: 共有ヘッダー/フッター/資料ダウンロードモーダルを +layout.svelte へ抽出（構造リファクタ）

Tidy First: 振る舞いは変更しない（見た目・DOM 構造は現状維持）。`/chat`・`/call` を追加する前に、3ページで重複させないための土台を作る。

**Files:**

- 編集: `src/routes/+layout.svelte`
- 編集: `src/routes/+page.svelte`

**Step 1: 現状の `build-output.test.ts` を実行しベースラインを記録**

```bash
cd /Users/yuki.sakurai/code/github/vectajp/swarrow.com
bun --bun run build
bun test tests/seo/build-output.test.ts
```

Expected: PASS（構造変更前の現状確認。このタスクは振る舞いを変えないため、ヘッダー/フッター関連アサーションは変更後も PASS するはずで、Tidy First の検証として使う）

**Step 2: `+layout.svelte` にヘッダー・フッター・ContactModal を実装**

`contactModalOpen` の状態と `openContactModal`/`closeContactModal` を Svelte のコンテキスト API で子ページへ公開する。

`[data-reveal]`/動画のフェードイン演出を制御する `.motion` クラスは、現状 `+page.svelte` の `.lp` div に付与されていた。`.lp` を `+layout.svelte` へ移動すると、`prefers-reduced-motion` の判定（`motion` state）は `.lp` を持つ `+layout.svelte` 側に一本化する一方、`[data-reveal]` 要素と動画要素は各ページ（`+page.svelte`・`/chat`・`/call`）のテンプレート内にしか存在しない。そのため `reducedMotion` を判定する真偽値だけをコンテキストで子ページへ公開し、各ページの `onMount` は自分のテンプレート内の `[data-reveal]`／動画要素に対して IntersectionObserver を設定する（Step 3 で反映、Task 6 の `/chat`・`/call` にも同様のロジックを追加する）。

```svelte
<script lang="ts">
  import { setContext } from "svelte";
  import ContactModal from "$lib/swarrow/ContactModal.svelte";
  import { downloadCtaLabel, navItems } from "$lib/swarrow/content";

  const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

  let { children } = $props();

  const isExternalHref = (href: string) => /^https?:\/\//.test(href);

  let scrolled = $state(false);
  let motion = $state(false);
  let reducedMotion = $state(false);
  let contactModalOpen = $state(false);
  const openContactModal = () => {
    contactModalOpen = true;
  };
  const closeContactModal = () => {
    contactModalOpen = false;
  };

  setContext("swarrow-download-modal", { openContactModal });
  setContext("swarrow-motion", { isReducedMotion: () => reducedMotion });

  $effect(() => {
    const onScroll = () => {
      scrolled = window.scrollY > 40;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });

  $effect(() => {
    reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    motion = !reducedMotion;
  });

  const currentYear = new Date().getFullYear();
</script>

<svelte:head>
  <link rel="icon" type="image/png" sizes="120x120" href="/swarrow/icon.png">
</svelte:head>

<div class="lp" class:motion={motion}>
  <header class="sc-header" class:scrolled={scrolled}>
    <a class="brand" href="/#top" aria-label="Swarrow トップへ">
      <img
        class="brand-mark"
        src="/swarrow/icon.png"
        alt=""
        width="120"
        height="120"
        decoding="async"
      >
      <span class="brand-name">Swarrow</span>
    </a>

    <nav class="sc-nav" aria-label="グローバルナビゲーション">
      {#each navItems as item (item.label)}
        <a
          class="sc-nav-link"
          href={item.href}
          target={isExternalHref(item.href) ? "_blank" : undefined}
          rel={isExternalHref(item.href) ? "noopener noreferrer" : undefined}
        >
          {item.label}
          {#if isExternalHref(item.href)}
            <span class="ext" aria-hidden="true">↗</span>
          {/if}
        </a>
      {/each}
      <button type="button" class="sc-cta" onclick={openContactModal}>
        {downloadCtaLabel}
      </button>
    </nav>
  </header>

  {@render children()}

  <footer id="footer" class="vecta-footer">
    <div class="vecta-footer-inner">
      <div class="vecta-footer-content">
        <div class="vecta-footer-brand">
          <a
            class="vecta-footer-logo-link"
            href="https://www.vecta.co.jp"
            aria-label="Vectaのウェブサイトへ"
          >
            <img
              src="/vecta/logo_horizontal.svg"
              alt="Vecta"
              width="300"
              height="100"
              decoding="async"
            >
          </a>
          <p>まちの知識を、未来へつなぐ。</p>
        </div>
        <address class="vecta-footer-address">
          〒150-0002<br>
          東京都渋谷区渋谷2-19-15<br>
          宮益坂ビルディング609
        </address>
      </div>
      <p class="vecta-footer-copy">
        © {currentYear} Vecta. All rights reserved.
      </p>
    </div>
  </footer>

  <ContactModal open={contactModalOpen} onClose={closeContactModal} />
</div>

<style>
  /* .sc-header, .brand*, .sc-nav*, .sc-cta, .ext, .vecta-footer* を
     src/routes/+page.svelte から移動する（既存 CSS をそのまま貼り付け、
     内容の変更はしない）。加えて #top, #footer の scroll-margin-top を
     含む共通セレクタ、a のリセット、focus-visible スタイルもここに移動する。

     [data-reveal] のフェードイン演出も移動するが、[data-reveal] 要素自体は
     このコンポーネントのテンプレートに存在しないため、:global() で
     セレクタ全体を囲みグローバル化する（Svelte のスタイルスコープは自分の
     テンプレートに実在する要素にしかスコープクラスを適用できないため、
     .lp だけこのコンポーネント内にあっても [data-reveal] 部分をローカル
     スコープのままにすると子ページ側の要素に一切効かない）。

     :global(.motion [data-reveal]) {
       opacity: 0;
       transform: translateY(20px);
       transition: opacity 0.7s ease, transform 0.7s ease;
     }
     :global(.motion [data-reveal].is-in) {
       opacity: 1;
       transform: none;
     }

     @media (prefers-reduced-motion: reduce) の .lp * 一括無効化ルールは
     .lp がこのコンポーネントに実在するためローカルスコープのままで良いが、
     対象が :global 要素を含むため同様に :global() 化する。
  */
</style>
```

**Step 3: `+page.svelte` からヘッダー・フッター・ContactModal を削除しコンテキストを使うよう変更**

- `<header class="sc-header">...</header>` ブロック全体を削除。
- `<footer id="footer" class="vecta-footer">...</footer>` ブロック全体を削除。
- `<ContactModal open={contactModalOpen} onClose={closeContactModal} />` と `import ContactModal from "$lib/swarrow/ContactModal.svelte";` を削除。
- `contactModalOpen`/`openContactModal`/`closeContactModal` のローカル状態定義を削除し、`getContext("swarrow-download-modal")` から取得する。
- `motion` state を削除し、`getContext("swarrow-motion")` から `isReducedMotion()` を取得する。`onMount` 内の reveal/video 用 `IntersectionObserver` セットアップは `isReducedMotion()` が `true` の場合は即座に `is-in` クラス・動画再生を適用する分岐に変更し、`false` の場合のみ既存の `IntersectionObserver` ロジックをそのまま使う（`window.matchMedia` による重複判定は削除する）。
- `.workflow-video:not(.ready)` のフェード制御ルールは `.workflow-video` がこのコンポーネント内に実在するためローカルスコープのままで良いが、祖先の `.motion` クラスは `+layout.svelte` 側にしか存在しないため `.motion` 部分だけ `:global()` 化する: `:global(.motion) .workflow-video:not(.ready) { opacity: 0; transition: none; }`

```svelte
<script lang="ts">
  import { getContext, onMount } from "svelte";
  // ...既存の import から ContactModal を除く

  const { openContactModal } = getContext<{ openContactModal: () => void }>(
    "swarrow-download-modal",
  );
  const { isReducedMotion } = getContext<{ isReducedMotion: () => boolean }>(
    "swarrow-motion",
  );

  onMount(() => {
    const cleanups: Array<() => void> = [];
    // ...workflowVideoReady 設定ロジックは既存のまま維持...

    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
    );
    const videos = Array.from(
      document.querySelectorAll<HTMLVideoElement>(AUTOPLAY_VIDEO_SELECTOR),
    );

    if (isReducedMotion()) {
      workflowVideoReady = true;
      for (const el of revealTargets) el.classList.add("is-in");
      return () => runCleanups(cleanups);
    }

    // ...既存の IntersectionObserver セットアップをそのまま維持...
    return () => runCleanups(cleanups);
  });
</script>
```

- 移動した `.sc-header`/`.brand*`/`.sc-nav*`/`.sc-cta`/`.vecta-footer*` の CSS ブロックを `<style>` から削除する。

**Step 4: ビルドとテストで振る舞いが変わっていないことを確認**

```bash
bun --bun run build
bun test tests/seo/build-output.test.ts
bun --bun run check
```

Expected: PASS（構造リファクタのみなので、HTML 出力・既存アサーションは変化しないはず。もし失敗する場合は `.lp` ラッパー div のネスト位置のずれが原因である可能性が高いので、`build/index.html` を確認して調整する）

**Step 5: Commit**

```bash
git add src/routes/+layout.svelte src/routes/+page.svelte
git commit -m "refactor(lp): ヘッダー・フッター・資料ダウンロードモーダルをレイアウトへ移動"
```

---

### Task 5: ProductPage.svelte 共有レイアウトコンポーネント新規作成（swarrow.com）

まだどこからも呼び出されない新規コンポーネントの作成のみ。次タスクで `/chat`・`/call` から使用する。

**Files:**

- 新規: `src/lib/swarrow/ProductPage.svelte`

**Step 1: Props インターフェースと構造を実装**

`+page.svelte` の `#chat`/`#call` セクション（`.chat-feature`/`.call-feature`）と `#support` セクション（`.customer-success-*`）、下部 CTA セクション（`.cta`）を移植し、製品別データを props で受け取る形に一般化する。

```svelte
<script lang="ts">
  import type {
    CallCapability,
    CustomerSuccessStep,
    DownloadCtaCopy,
    ProductFeatureCopy,
  } from "$lib/swarrow/content";
  import { downloadCtaLabel } from "$lib/swarrow/content";

  interface Props {
    productName: string;
    productIcon: string;
    bandVariant: "mist" | "paper";
    mediaPosition: "left" | "right";
    feature: ProductFeatureCopy;
    videoSources: { src: string; type: string }[];
    poster: string;
    fallbackAlt: string;
    extraCards?: readonly CallCapability[];
    customerSuccessIntro: { lead: string; body: string };
    customerSuccessSteps: readonly CustomerSuccessStep[];
    downloadCta: DownloadCtaCopy;
    onOpenDownloadModal: () => void;
  }

  let {
    productName,
    productIcon,
    bandVariant,
    mediaPosition,
    feature,
    videoSources,
    poster,
    fallbackAlt,
    extraCards,
    customerSuccessIntro,
    customerSuccessSteps,
    downloadCta,
    onOpenDownloadModal,
  }: Props = $props();
</script>

<section
  class="feature-band feature-band--{bandVariant}"
  aria-labelledby="product-feature-title"
>
  <div class="product-feature product-feature--{mediaPosition}" data-reveal>
    <figure class="product-feature-media">
      <video
        class="product-feature-video"
        {poster}
        muted
        loop
        playsinline
        preload="none"
        width="1280"
        height="720"
        aria-label={fallbackAlt}
      >
        {#each videoSources as source (source.src)}
          <source src={source.src} type={source.type}>
        {/each}
        <img
          class="product-feature-image"
          src={poster}
          alt={fallbackAlt}
          width="1672"
          height="941"
          loading="lazy"
          decoding="async"
        >
      </video>
    </figure>

    <div class="product-feature-copy">
      <p class="product-feature-en">{feature.en}</p>
      <h2 id="product-feature-title" class="product-feature-title">
        <span class="product-feature-title-label">{feature.titleLabel}</span>
        <span class="feature-product-name">
          <img
            class="feature-product-icon"
            src={productIcon}
            alt=""
            width="961"
            height="1006"
            decoding="async"
          >
          {productName}
        </span>
      </h2>
      <p class="product-feature-lead">{feature.lead}</p>
      <ul class="product-feature-list">
        {#each feature.list as item (item.title)}
          <li>
            <strong>{item.title}</strong>
            <small>{item.body}</small>
          </li>
        {/each}
      </ul>
    </div>

    {#if extraCards}
      <div class="call-feature-cards">
        {#each extraCards as capability (capability.title)}
          <article class="call-feature-card">
            <video
              class="call-feature-card-video"
              poster={capability.poster}
              muted
              loop
              playsinline
              preload="none"
              width="1536"
              height="1024"
              aria-label={capability.alt}
            >
              <source src={capability.video} type="video/webm">
              <img
                class="call-feature-card-image"
                src={capability.poster}
                alt={capability.alt}
                width="1536"
                height="1024"
                loading="lazy"
                decoding="async"
              >
            </video>
            <div class="call-feature-card-body">
              <h3 class="call-feature-card-title">{capability.title}</h3>
              <p class="call-feature-card-text">{capability.body}</p>
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </div>
</section>

<section id="support" class="function" aria-labelledby="support-title">
  <div class="customer-success-hero" data-reveal>
    <div class="function-head">
      <p class="function-en">Customer Success</p>
      <h2 id="support-title" class="function-ja">カスタマーサクセス</h2>
      <p class="customer-success-lead">{customerSuccessIntro.lead}</p>
      <p class="customer-success-body">{customerSuccessIntro.body}</p>
    </div>
  </div>

  <ol class="customer-success-steps">
    {#each customerSuccessSteps as step (step.phase)}
      <li class="customer-success-step" data-reveal>
        <figure class="customer-success-step-media">
          <video
            class="customer-success-step-video"
            poster={step.poster}
            muted
            loop
            playsinline
            preload="none"
            width="1280"
            height="720"
            aria-label={step.alt}
          >
            <source src={step.video} type="video/webm">
            <img
              class="customer-success-step-image"
              src={step.poster}
              alt={step.alt}
              width="1280"
              height="720"
              loading="lazy"
              decoding="async"
            >
          </video>
        </figure>
        <div class="customer-success-step-copy">
          <h3 class="customer-success-step-title">{step.title}</h3>
          <p class="customer-success-step-body">{step.body}</p>
        </div>
      </li>
    {/each}
  </ol>
</section>

<section id="contact" class="cta" aria-labelledby="contact-title">
  <div class="cta-inner" data-reveal>
    <h2 id="contact-title" class="cta-title">
      {#each downloadCta.heading as line (line)}
        <span>{line}</span>
      {/each}
    </h2>
    <p class="cta-sub">{downloadCta.sub}</p>
    <button type="button" class="cta-btn" onclick={onOpenDownloadModal}>
      {downloadCtaLabel}<span class="ext">↗</span>
    </button>
  </div>
</section>

<style>
  /* CSS 移植チェックリスト（src/routes/+page.svelte から移動、行番号は
     Task 着手前の既存ファイルを基準。移動後は元ファイルから必ず削除する）。

     ## A. そのまま移動するブロック
     - .feature-band, .feature-band--mist, .feature-band--paper,
       .feature-band--last, .feature-band + .feature-band
     - .section-curve-bg 一式（.section-curve-bg--flip/--mist/--paper 含む）
     - .call-feature-cards, .call-feature-card, .call-feature-card-video,
       .call-feature-card-image, .call-feature-card-body,
       .call-feature-card-title, .call-feature-card-text
     - .function, .function::before, .function-curve-bg,
       .function-en, .function-ja, .customer-success-hero,
       .customer-success-lead, .customer-success-body,
       .customer-success-media*, .customer-success-video*,
       .customer-success-steps, .customer-success-step*
     - .cta, .cta-inner, .cta-title, .cta-sub, .cta-btn

     ## B. リネームして移動するブロック（.chat-feature-*/.call-feature-* → .product-feature-*）
     - .chat-feature/.call-feature 本体の grid 定義（1630行目台/1724行目台）は
       統合し、共通プロパティを .product-feature に、mediaPosition による
       左右差分だけを以下の2バリアントに分離する:
         .product-feature--left  { grid-template-columns: minmax(0, 1.24fr) minmax(360px, 0.76fr); }
         .product-feature--right { grid-template-columns: minmax(360px, 0.76fr) minmax(0, 1.24fr); }
       （値は既存 .chat-feature/.call-feature のものをそのまま流用する）
     - .chat-feature-media/.call-feature-media, .chat-feature-video/
       .call-feature-video, .chat-feature-image/.call-feature-image は
       .product-feature-media/.product-feature-video/.product-feature-image
       に統合する。ただし call 側固有の .call-feature-window*（枠線・
       ブラウザバー風装飾）は product-feature-media--framed のような
       modifier クラスとして残し、mediaPosition="right" のときのみ
       ProductPage.svelte のテンプレートで付与を検討する（現状の計画では
       常時 window 枠を外している点に注意し、実装時に見た目を目視確認する）。
     - .chat-feature-copy/.call-feature-copy → .product-feature-copy
     - .chat-feature-en/.call-feature-en → .product-feature-en
     - .chat-feature-title/.call-feature-title → .product-feature-title
     - .chat-feature-title-label（call 側に対応クラスなし） →
       .product-feature-title-label として両製品共通化する
       （上記「設計書からの逸脱・補足」8番を参照。call タイトルにも
       このクラスを適用する）
     - .chat-feature-lead/.call-feature-lead → .product-feature-lead
     - .chat-feature-list*/.call-feature-list* → .product-feature-list*
     - :is(.chat-feature-title, .call-feature-title) .feature-product-name
       という複合セレクタは :global(.product-feature-title) .feature-product-name
       （またはこのコンポーネント内に実在するため通常のローカルセレクタ
       .product-feature-title .feature-product-name）に単純化する
     - .feature-product-icon はそのまま移動

     ## C. @media (max-width: 1240px) 内の個別上書き（見落としやすい）
     既存 CSS の .chat-feature/.call-feature はベースの grid-template-columns
     とは別に、この2番目のブレークポイントで異なる比率へ再上書きされている:
       .chat-feature { grid-template-columns: minmax(0, 1.16fr) minmax(340px, 0.84fr); }
       .call-feature { grid-template-columns: minmax(340px, 0.84fr) minmax(0, 1.16fr); }
     これも A/B と同様に .product-feature--left/--right の @media ブロック内
     上書きとして移植する。ベースの grid-template-columns だけをバリアント化し
     この上書きを忘れると、1240px 以下の幅で /chat・/call のレイアウト比率が
     壊れるので特に注意する。

     ## D. @media (max-width: 860px) 内の複数コンポーネント混在セレクタ（最重要）
     このブレークポイント内には、トップページに残る .knowledge-copy/
     .workflow-copy と、ProductPage.svelte へ移る .chat-feature-copy/
     .call-feature-copy/.function-head が同一のカンマ区切りセレクタに
     同居しているルールが複数ある。以下の手順で分割する:

     1. `.knowledge-copy, .workflow-copy, .chat-feature-copy, .call-feature-copy, .function-head { display: contents; }`
        → +page.svelte 側に `.knowledge-copy, .workflow-copy { display: contents; }` を残し、
          ProductPage.svelte 側に `.product-feature-copy, .function-head { display: contents; }` を追加する。
     2. `.knowledge-en, .workflow-en, .chat-feature-en, .call-feature-en, .function-en { order: 1; }`
        → 同様に +page.svelte に `.knowledge-en, .workflow-en { order: 1; }`、
          ProductPage.svelte に `.product-feature-en, .function-en { order: 1; }` を追加する。
     3. `.knowledge-title, .workflow-title, .chat-feature-title, .call-feature-title, .function-ja { order: 2; }`
        → 同様に分割する（.product-feature-title, .function-ja を ProductPage.svelte 側へ）。
     4. `.chat-feature-title-label { font-size: clamp(1.12rem, 6vw, 1em); letter-spacing: 0.02em; }`
        → `.product-feature-title-label { ... }` として ProductPage.svelte 側にそのまま移動する。
     5. `.knowledge-visual, .workflow-media, .chat-feature-media, .call-feature-media, .customer-success-media { order: 3; margin-top: ...; margin-bottom: ...; }`
        → +page.svelte に `.knowledge-visual, .workflow-media { order: 3; margin-top: ...; margin-bottom: ...; }`、
          ProductPage.svelte に `.product-feature-media, .customer-success-media { order: 3; margin-top: ...; margin-bottom: ...; }` を追加する（margin 値は既存のまま複製）。
     6. `.knowledge-lead, .workflow-lead, .chat-feature-lead, .call-feature-lead, .customer-success-lead { order: 4; margin-top: 0; }`
        → 同様に分割する。
     7. `.knowledge-flow, .workflow-list, .chat-feature-list, .call-feature-list, .customer-success-body { order: 5; }`
        → 同様に分割する。
     8. `.chat-feature { margin: 0 auto; } .chat-feature-copy { justify-self: stretch; max-width: none; } .call-feature { margin: 0 auto; } .call-feature-copy { max-width: none; } .call-feature-window { padding: ...; }`
        → `.product-feature { margin: 0 auto; } .product-feature-copy { justify-self: stretch; max-width: none; }` に統合して ProductPage.svelte へ移動する（.call-feature-window は B の modifier 方針に従う）。
     9. `.call-feature-cards { order: 6; grid-template-columns: 1fr; gap: 1.6rem; margin-top: ...; } .call-feature-card, .customer-success-step { display: flex; flex-direction: column; } .call-feature-card-body { order: 1; padding-top: 0; padding-bottom: 0.8rem; } .call-feature-card-video, .call-feature-card-image { order: 2; }`
        → そのまま ProductPage.svelte へ移動する（このセレクタ群は既に call/customer-success 専用でトップページと混在していないため A 相当）。
     10. `.customer-success-step-copy { order: 1; padding-top: 0; padding-bottom: 0.8rem; } .customer-success-step-media { order: 2; }`
         → そのまま ProductPage.svelte へ移動する。
     11. `.function-head { text-align: left; }` → そのまま ProductPage.svelte へ移動する。

     この D の分割作業を終えた後、+page.svelte 側の @media (max-width: 860px)
     ブロックに .chat-feature*/.call-feature*/.function* を参照する記述が
     一切残っていないことを grep で確認する:
       grep -n "chat-feature\|call-feature\|function-" src/routes/+page.svelte
     （#products 内で使う .products-head 等、無関係な部分一致は除外して判断する） */
</style>
```

**Step 2: `bun --bun run check` で型チェック**

```bash
cd /Users/yuki.sakurai/code/github/vectajp/swarrow.com
bun --bun run check
```

Expected: PASS（この時点では未使用コンポーネントとして警告が出ないことを確認する程度。呼び出し元は Task 6 で追加）

**Step 3: Commit**

```bash
git add src/lib/swarrow/ProductPage.svelte
git commit -m "feat(lp): 製品ページ共有レイアウト ProductPage.svelte を追加"
```

---

### Task 6: /chat・/call ルート新規作成（swarrow.com）

**Files:**

- 新規: `src/routes/chat/+page.svelte`
- 新規: `src/routes/call/+page.svelte`

**Step 1: `src/routes/chat/+page.svelte` を実装**

`onMount` は Task 4 で `+page.svelte` に実装した「`isReducedMotion()` を `getContext` で取得し、`true` なら即時 `is-in`、`false` なら `IntersectionObserver`」というロジックをそのまま移植する（対象セレクタは `[data-reveal]` と `.product-feature-video`/`.customer-success-step-video`）。

```svelte
<script lang="ts">
  import { getContext, onMount } from "svelte";
  import ProductPage from "$lib/swarrow/ProductPage.svelte";
  import {
    chatCustomerSuccessIntro,
    chatCustomerSuccessSteps,
    chatDownloadCta,
    chatFeatureCopy,
    pageDescription,
    products,
    site,
    siteName,
  } from "$lib/swarrow/content";

  const REVEAL_SELECTOR = "[data-reveal]";
  const AUTOPLAY_VIDEO_SELECTOR = ".product-feature-video, .customer-success-step-video";

  const { openContactModal } = getContext<{ openContactModal: () => void }>(
    "swarrow-download-modal",
  );
  const { isReducedMotion } = getContext<{ isReducedMotion: () => boolean }>(
    "swarrow-motion",
  );

  const product = products.find((item) => item.id === "chat");
  const pageTitle = `Swarrow Chat｜${product?.category ?? ""}`;
  const canonicalUrl = `${site}/chat`;

  onMount(() => {
    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
    );
    const videos = Array.from(
      document.querySelectorAll<HTMLVideoElement>(AUTOPLAY_VIDEO_SELECTOR),
    );

    if (isReducedMotion()) {
      for (const el of revealTargets) el.classList.add("is-in");
      return;
    }

    // +page.svelte（Task 4）と同じ IntersectionObserver セットアップ
    // （revealObserver・videoObserver）をここに移植する。
  });
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={product?.benefit ?? pageDescription}>
  <link rel="canonical" href={canonicalUrl}>
  <meta name="robots" content="index,follow">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content={siteName}>
  <meta property="og:title" content={pageTitle}>
  <meta property="og:url" content={canonicalUrl}>
</svelte:head>

<main id="top">
  <ProductPage
    productName="Swarrow Chat"
    productIcon="/swarrow-call/swarrow-chat-icon-flat.png"
    bandVariant="mist"
    mediaPosition="left"
    feature={chatFeatureCopy}
    videoSources={[{ src: "/swarrow-call/chat-ui.webm", type: "video/webm" }]}
    poster="/swarrow-call/chat-ui.webp"
    fallbackAlt="ホームページやLINEに設置できるSwarrow Chatの画面"
    customerSuccessIntro={chatCustomerSuccessIntro}
    customerSuccessSteps={chatCustomerSuccessSteps}
    downloadCta={chatDownloadCta}
    onOpenDownloadModal={openContactModal}
  />
</main>
```

**Step 2: `src/routes/call/+page.svelte` を実装**

`onMount` は Task 6 の `/chat` と同じ「`isReducedMotion()` 分岐 + `[data-reveal]`/`.product-feature-video`/`.customer-success-step-video`/`.call-feature-card-video` を対象にした `IntersectionObserver`」ロジックを移植する（`AUTOPLAY_VIDEO_SELECTOR` に `.call-feature-card-video` を追加する点が `/chat` との差分）。

```svelte
<script lang="ts">
  import { getContext, onMount } from "svelte";
  import ProductPage from "$lib/swarrow/ProductPage.svelte";
  import {
    callCapabilities,
    callCustomerSuccessIntro,
    callCustomerSuccessSteps,
    callDownloadCta,
    callFeatureCopy,
    products,
    pageDescription,
    site,
    siteName,
  } from "$lib/swarrow/content";

  const REVEAL_SELECTOR = "[data-reveal]";
  const AUTOPLAY_VIDEO_SELECTOR =
    ".product-feature-video, .customer-success-step-video, .call-feature-card-video";

  const { openContactModal } = getContext<{ openContactModal: () => void }>(
    "swarrow-download-modal",
  );
  const { isReducedMotion } = getContext<{ isReducedMotion: () => boolean }>(
    "swarrow-motion",
  );

  const product = products.find((item) => item.id === "call");
  const pageTitle = `Swarrow Call｜${product?.category ?? ""}`;
  const canonicalUrl = `${site}/call`;

  onMount(() => {
    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
    );
    const videos = Array.from(
      document.querySelectorAll<HTMLVideoElement>(AUTOPLAY_VIDEO_SELECTOR),
    );

    if (isReducedMotion()) {
      for (const el of revealTargets) el.classList.add("is-in");
      return;
    }

    // +page.svelte（Task 4）と同じ IntersectionObserver セットアップを
    // ここに移植する。
  });
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={product?.benefit ?? pageDescription}>
  <link rel="canonical" href={canonicalUrl}>
  <meta name="robots" content="index,follow">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content={siteName}>
  <meta property="og:title" content={pageTitle}>
  <meta property="og:url" content={canonicalUrl}>
</svelte:head>

<main id="top">
  <ProductPage
    productName="Swarrow Call"
    productIcon="/swarrow-call/swarrow-call-icon-flat.png"
    bandVariant="paper"
    mediaPosition="right"
    feature={callFeatureCopy}
    videoSources={[
      { src: "/swarrow-call/operator-call.webm", type: "video/webm" },
      { src: "/swarrow-call/operator-call.mp4", type: "video/mp4" },
    ]}
    poster="/swarrow-call/operator-call-poster.webp"
    fallbackAlt="電話問い合わせを受けるオペレーターのイメージ"
    extraCards={callCapabilities}
    customerSuccessIntro={callCustomerSuccessIntro}
    customerSuccessSteps={callCustomerSuccessSteps}
    downloadCta={callDownloadCta}
    onOpenDownloadModal={openContactModal}
  />
</main>
```

**Step 3: ビルドして手動確認**

```bash
cd /Users/yuki.sakurai/code/github/vectajp/swarrow.com
bun --bun run build
bun --bun run preview
```

ブラウザで `http://localhost:4173/chat` と `http://localhost:4173/call` を開き、ヘッダー・機能紹介・カスタマーサクセス・下部 CTA・フッターが表示され、ヘッダー/下部 CTA から資料ダウンロードモーダルが開くことを目視確認する。

**Step 4: Commit**

```bash
git add src/routes/chat/+page.svelte src/routes/call/+page.svelte
git commit -m "feat(lp): Swarrow Chat/Call の製品別ページを追加"
```

---

### Task 7: トップページ再構成（swarrow.com）

**Files:**

- 編集: `src/routes/+page.svelte`

**Step 1: hero を2ボタン CTA に変更**

`<nav class="hero-actions">` 内の単一ボタンを2ボタンへ変更:

```svelte
<nav class="hero-actions" aria-label="主要な導線">
  {#each heroProductCtas as cta (cta.productId)}
    <a class="hero-primary" href="/{cta.productId}">
      {cta.label}
    </a>
  {/each}
</nav>
```

`heroProductCtas` を import に追加する。`.hero-primary` は既存では `<button>` 用スタイルのため、`<a>` タグでも同じ見た目になるよう `<style>` 内の `.hero-primary` セレクタに `text-decoration: none;` があることを確認し、なければ追加する（既存 `a { text-decoration: none; }` のグローバルリセットが `.lp` 配下に効いているため通常は不要）。

**Step 2: `#chat`・`#call`・`#support` セクションを削除**

`<section id="chat" class="feature-band feature-band--mist">...</section>` ブロック全体を削除。
`<section id="call" class="feature-band feature-band--paper">...</section>` ブロック全体を削除。
`<section id="support" class="function">...</section>` ブロック全体を削除。

`#operations` セクションの `feature-band--last` クラス構成は維持する（`#call` 削除後も `#knowledge` の直後に来るため、既存の `feature-band--last` 波形調整をそのまま使う）。

**Step 3: products の href 遷移先を確認**

`products` の `href` は Task 3 で既に `/chat`・`/call` に変わっているため、`<a href={product.href}>{product.name}を見る</a>` は変更不要（データ経由で自動的に新 URL になる）。

**Step 4: 下部 CTA セクションをトップ用データに差し替え**

```svelte
<section id="contact" class="cta" aria-labelledby="contact-title">
  <div class="cta-inner" data-reveal>
    <h2 id="contact-title" class="cta-title">
      {#each topDownloadCta.heading as line (line)}
        <span>{line}</span>
      {/each}
    </h2>
    <p class="cta-sub">{topDownloadCta.sub}</p>
    <button type="button" class="cta-btn" onclick={openContactModal}>
      {downloadCtaLabel}<span class="ext">↗</span>
    </button>
  </div>
</section>
```

`topDownloadCta`・`downloadCtaLabel` を import に追加する。

**Step 5: 使われなくなった CSS を削除**

`.chat-feature*`、`.call-feature*`（`.call-feature-cards*` を含む）、`.function*`、`.customer-success-*` は `ProductPage.svelte` へ移設済みのため `+page.svelte` の `<style>` から削除する。Task 5 の CSS 移植チェックリスト（D）に従って `@media (max-width: 1240px)`・`@media (max-width: 860px)` 内の混在セレクタから該当クラスを抜き出した後であることを前提とする。`.feature-band`、`.section-curve-bg*` のうち `#products` セクションで引き続き使われているクラス（`hero-products-curve` 等）は残す。削除後、以下のコマンドで残存参照がないことを確認する:

```bash
grep -n "chat-feature\|call-feature\|customer-success\|\.function[^-]" src/routes/+page.svelte
```

Expected: マッチなし（`#products` 関連の無関係な部分一致がある場合は目視で判別する）。

`AUTOPLAY_VIDEO_SELECTOR` 配列（script 冒頭）から `.chat-feature-video`・`.call-feature-video`・`.call-feature-card-video`・`.customer-success-video`・`.customer-success-step-video` を削除する（該当セクションが `ProductPage.svelte` へ移設され `+page.svelte` には存在しなくなるため）。トップページに残る `.hero-video`・`.knowledge-video`・`.workflow-video` のみを残す。

**Step 6: `bun --bun run build` と `bun test tests/seo/build-output.test.ts` を実行**

```bash
cd /Users/yuki.sakurai/code/github/vectajp/swarrow.com
bun --bun run build
bun test tests/seo/build-output.test.ts
```

Expected: FAIL（Task 10 で `build-output.test.ts` を新構成に合わせて書き換えるまでは、削除したセクションを前提にした既存アサーションが失敗し続ける。このタスク単体では red のままで問題ない）

**Step 7: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat(lp): トップページの hero と製品セクションを再構成"
```

---

### Task 8: ContactModal.svelte 改修 — タイトル・フィールド・payload（swarrow.com）

**Files:**

- 編集: `src/lib/swarrow/ContactModal.svelte`

**Step 1: フォーム状態から `nameKana` を削除し `department` を追加**

```ts
let companyName = $state("");
let department = $state("");
let name = $state("");
let email = $state("");
let inquiry = $state("");
```

`resetForm` から `nameKana = "";` を削除し `department = "";` を追加。

**Step 2: 送信 payload を変更**

```ts
body: JSON.stringify({
  companyName,
  department: department || undefined,
  name,
  email,
  inquiry,
  turnstileToken,
}),
```

**Step 3: タイトル・フィールドを変更**

`<h3 id="contact-modal-title">お問い合わせ</h3>` を `<h3 id="contact-modal-title">資料ダウンロード</h3>` に変更。

`<p class="modal-lead">` の文言を資料ダウンロード文脈に変更:

```svelte
<p class="modal-lead">
  Swarrow Chat・Swarrow Callの資料をダウンロードいただけます。以下のフォームからお申し込みください。
</p>
```

「自治体・団体名」の直後・「氏名」の直前に部署欄を追加し、「ふりがな」欄を削除:

```svelte
<label>
  <span class="field-label">
    自治体・団体名<span class="required" aria-hidden="true">*</span>
    <span class="visually-hidden">必須</span>
  </span>
  <input
    type="text"
    bind:value={companyName}
    placeholder="〇〇市役所"
    required
  >
</label>
<label>
  <span class="field-label">
    部署<span class="optional">任意</span>
  </span>
  <input
    type="text"
    bind:value={department}
    placeholder="総務課"
  >
</label>
<label>
  <span class="field-label">
    氏名<span class="required" aria-hidden="true">*</span>
    <span class="visually-hidden">必須</span>
  </span>
  <input
    type="text"
    bind:value={name}
    placeholder="山田 太郎"
    required
  >
</label>
<label>
  <span class="field-label">
    メールアドレス<span class="required" aria-hidden="true">*</span>
    <span class="visually-hidden">必須</span>
  </span>
  <input
    type="email"
    bind:value={email}
    placeholder="example@company.co.jp"
    required
  >
</label>
```

「ふりがな」の `<label>` ブロック全体を削除する。

**Step 4: 完了画面の文言を確認**

完了画面（`formState === "done"`）の文言「ご入力いただいたメールアドレス宛に、資料ダウンロードリンクを含むご案内をお送りします。」は既に資料ダウンロード文脈のため変更不要。

**Step 5: ビルドして目視確認**

```bash
cd /Users/yuki.sakurai/code/github/vectajp/swarrow.com
bun --bun run build
bun --bun run preview
```

ブラウザでモーダルを開き、タイトルが「資料ダウンロード」、フィールドが自治体・団体名(必須)→部署(任意)→氏名(必須)→メールアドレス(必須)→お問い合わせ内容(任意)の順であること、「ふりがな」欄が存在しないことを確認する。

**Step 6: Commit**

```bash
git add src/lib/swarrow/ContactModal.svelte
git commit -m "feat(lp): 資料ダウンロードモーダルのふりがな欄を部署欄に置き換え"
```

---

### Task 9: sitemap.xml 更新（swarrow.com）

**Files:**

- 編集: `static/sitemap.xml`

**Step 1: `/chat`・`/call` の URL を追加**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://swarrow.com/</loc>
  </url>
  <url>
    <loc>https://swarrow.com/chat</loc>
  </url>
  <url>
    <loc>https://swarrow.com/call</loc>
  </url>
</urlset>
```

**Step 2: Commit**

```bash
git add static/sitemap.xml
git commit -m "feat(seo): sitemap に /chat・/call を追加"
```

---

### Task 10: SEO テスト全面更新・最終検証（swarrow.com）

Task 4〜9 の変更を反映し、`tests/seo/build-output.test.ts` を新構成に合わせて書き換える。

**Files:**

- 編集: `tests/seo/build-output.test.ts`

**Step 1: `beforeAll` に `/chat`・`/call` のビルド出力を追加**

```ts
let html = "";
let chatHtml = "";
let callHtml = "";
let robots = "";
let sitemap = "";
let modalSource = "";
let pageSource = "";
let layoutSource = "";

beforeAll(async () => {
  [html, chatHtml, callHtml, robots, sitemap, modalSource, pageSource, layoutSource] =
    await Promise.all([
      Bun.file("build/index.html").text(),
      Bun.file("build/chat/index.html").text(),
      Bun.file("build/call/index.html").text(),
      Bun.file("build/robots.txt").text(),
      Bun.file("build/sitemap.xml").text(),
      Bun.file("src/lib/swarrow/ContactModal.svelte").text(),
      Bun.file("src/routes/+page.svelte").text(),
      Bun.file("src/routes/+layout.svelte").text(),
    ]);
});
```

**Step 2: ヘッダー/フッターアサーションを `layoutSource`/`html` 併用に更新**

`"keeps the Swarrow header..."` テストはヘッダー/フッターが `+layout.svelte` 由来になった点を除き HTML 出力自体は変わらないため、`html` に対するアサーションはそのまま維持できる。

**Step 3: モーダルのフィールド数・必須数アサーションを更新**

```ts
test("uses a municipal organization label without changing request fields", () => {
  expect(modalSource).toContain("自治体・団体名");
  expect(modalSource).toContain("資料ダウンロード");
  for (const field of [
    "companyName",
    "department",
    "name",
    "email",
    "inquiry",
    "turnstileToken",
  ]) {
    expect(modalSource).toContain(field);
  }
  expect(modalSource).not.toContain("nameKana");
  expect(modalSource).not.toContain("ふりがな");
  expect(modalSource).toContain("FALLBACK_DOWNLOAD_REQUEST_API_URL");
});

test("keeps required marks beside their field labels", () => {
  expect(countMatches(modalSource, /class="field-label"/g)).toBe(5);
  expect(
    countMatches(
      modalSource,
      /class="field-label">[\s\S]*?class="required"/g,
    ),
  ).toBe(3);
  expect(modalSource).toContain("white-space: nowrap");
});
```

**Step 4: 削除済みセクション・トップページ構成のアサーションを更新**

```ts
describe("top page no longer embeds product feature sections", () => {
  test("omits the chat, call, and support sections from the top page", () => {
    expect(html).not.toContain('id="chat"');
    expect(html).not.toContain('id="call"');
    expect(html).not.toContain('id="support"');
  });

  test("links product cards to the dedicated pages", () => {
    expect(html).toContain('href="/chat"');
    expect(html).toContain('href="/call"');
  });

  test("offers two hero CTAs routing to the product pages", () => {
    const hero = html.match(/<section class="hero[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? "";
    expect(hero).toContain('href="/chat"');
    expect(hero).toContain('href="/call"');
    expect(countMatches(hero, /class="hero-primary"/g)).toBe(2);
  });
});
```

**Step 5: `/chat`・`/call` 専用のセクション検証を追加**

```ts
describe("Swarrow Chat page", () => {
  test("renders the chat feature band and chat-specific customer success copy", () => {
    expect(chatHtml).toContain("Swarrow Chat");
    expect(chatHtml).toContain("自治体ホームページAI窓口");
    expect(chatHtml).toContain("/swarrow-call/chat-ui.webm");
    expect(chatHtml).toContain('id="support"');
    expect(chatHtml).not.toContain('id="chat"');
    expect(chatHtml).not.toContain('id="call"');
  });
});

describe("Swarrow Call page", () => {
  test("renders the call feature band, capability cards, and call-specific customer success copy", () => {
    expect(callHtml).toContain("Swarrow Call");
    expect(callHtml).toContain("自治体AIコールセンター");
    expect(callHtml).toContain("/swarrow-call/operator-call.webm");
    for (const capability of ["タイマー架電", "自動取次", "一括発信"]) {
      expect(callHtml).toContain(capability);
    }
    expect(callHtml).toContain('id="support"');
  });
});
```

**Step 6: sitemap アサーションを更新**

`describe("crawlability baseline")` 内の既存テスト `"lists only the root canonical URL in the sitemap"`（`expect(locations).toEqual(["https://swarrow.com/"]);` で sitemap が1件のみであることを検証している）を**削除**し、以下の新テストに置き換える。削除を忘れると新旧2つのテストが sitemap の件数について矛盾する期待値（1件 vs 3件）を持つことになり、旧テストが必ず失敗する。

```ts
test("lists the root, chat, and call canonical URLs in the sitemap", () => {
  const locations = Array.from(
    sitemap.matchAll(/<loc>([^<]+)<\/loc>/g),
    (match) => match[1],
  );
  expect(locations).toEqual([
    "https://swarrow.com/",
    "https://swarrow.com/chat",
    "https://swarrow.com/call",
  ]);
});
```

**Step 7: 削除済みセクション・変更後の URL 構成と矛盾する既存テストを更新・削除**

以下の既存テストは新構成と直接矛盾するため、削除または書き換えが必須（Task 10 完了条件の Step 9 で全成功させるために欠かせない）。

1. `describe("product overview")` 内 `"places comparison after Hero and product details before Shared Knowledge"` テストは `#chat`/`#call` の存在を前提にしているため、`#chat`/`#call` を参照する箇所を削除し、hero → products → knowledge → operations の順序検証のみ残す。
2. `describe("product overview")` 内 `"shows two equally structured product choices"` テストは `expect(html).toContain('href="#chat"'); expect(html).toContain('href="#call"');` を検証しているため、これを `expect(html).toContain('href="/chat"'); expect(html).toContain('href="/call"');` に書き換える（Task 3 で `products.href` がアンカーから実 URL に変わるため、`href="#chat"` は HTML 上に一切出現しなくなり書き換えないと必ず失敗する）。
3. `describe("answer-quality Hero")` 内 `"renders one answer-quality H1 and product-neutral supporting copy"` テストは `expect(hero).not.toContain("Swarrow Chat"); expect(hero).not.toContain("Swarrow Call");` を検証しているが、Task 7 で hero に `heroProductCtas`（ラベル `"Swarrow Chat"`/`"Swarrow Call"`）による2ボタンを追加するため、hero セクションの HTML に必ずこれらの文字列が出現するようになる。この2行を削除し、代わりに `expect(hero).toContain("Swarrow Chat"); expect(hero).toContain("Swarrow Call");` へ書き換える（テスト名・意図も「アンサー品質訴求のコピーは製品名に依存しない」から「hero は共通のアンサー品質コピーと2つの製品 CTA を両立する」に更新する）。
4. `describe("section order")`、`describe("Swarrow Chat section")`、`describe("Swarrow Call section")`、`describe("shared customer success")` はトップページの `html` を対象にしていた旧テストのため削除し、Step 5 の `/chat`・`/call` 専用テストに置き換える。

Step 9 の `bun --bun run test:seo` 実行前に、以下のコマンドで置換漏れがないことを確認する:

```bash
grep -n 'href="#chat"\|href="#call"\|not.toContain("Swarrow Chat")\|not.toContain("Swarrow Call")\|toEqual(\["https://swarrow.com/"\])' tests/seo/build-output.test.ts
```

Expected: マッチなし。

**Step 8: `"keeps the final page sequence..."` の対象 id リストを更新**

```ts
test("keeps the final page sequence and a two-product CTA", () => {
  const ids = ["products", "knowledge", "operations", "news", "contact"];
  const positions = ids.map((id) => html.indexOf(`id="${id}"`));
  expect(positions.every((position) => position >= 0)).toBe(true);
  expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  expect(html).toContain(topDownloadCtaHeadingFirstLine); // 実装時に content.ts の値と一致させる
});
```

**Step 9: `content.test.ts` を含め全テスト・ビルド・型チェックを実行**

```bash
cd /Users/yuki.sakurai/code/github/vectajp/swarrow.com
bun --bun run test:seo
bun --bun run check
bun --bun run build
```

Expected: PASS（全 SEO テスト成功、Biome/svelte-check エラーなし、ビルド成功）

**Step 10: Commit**

```bash
git add tests/seo/build-output.test.ts
git commit -m "test(seo): 製品別ページ構成に合わせて SEO テストを更新"
```

---

### Task 11: download-request-api.md 更新（swarrow.com）

**Files:**

- 編集: `docs/download-request-api.md`

**Step 1: payload 例を更新**

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

`nameKana` の行を削除し `department` を追加する。

**Step 2: Commit**

```bash
git add docs/download-request-api.md
git commit -m "docs(api): 資料請求 payload 例からふりがなを削除し部署を追加"
```

---

### Task 12: AGENTS.md 更新（swarrow.com）

**Files:**

- 編集: `AGENTS.md`（`CLAUDE.md` はこのファイルへのシンボリックリンク）

**Step 1: 単一ページ規約の記述を更新**

```markdown
## Project conventions

- Keep the shared homepage sections in `src/routes/+page.svelte`, and the
  Swarrow Chat / Swarrow Call detail sections in `src/routes/chat/+page.svelte`
  and `src/routes/call/+page.svelte`. Keep the shared header, footer, and
  download-request modal in `src/routes/+layout.svelte`.
```

既存の `- Keep the integrated single-page site in \`src/routes/+page.svelte\`.` を上記に置き換える。

**Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "docs: AGENTS.md を製品別ページ構成に更新"
```

---

## 実行順序サマリ

```
Task 0 (vecta-admin調査, 独立) ─┐
Task 1 (D1 migration) → Task 2 (backend契約変更) ─┼→ Task 11 (API doc)
                                                    └→ Task 8 (ContactModal, F5相当)
Task 3 (content.ts) → Task 4 (layout抽出) → Task 5 (ProductPage.svelte) → Task 6 (chat/call routes)
Task 3, Task 4 → Task 7 (トップページ再構成)
Task 6, Task 7, Task 8, Task 9 → Task 10 (SEOテスト最終検証)
Task 12 (AGENTS.md) は独立、最後にまとめて実施可
```

## 最終確認（全リポジトリ）

```bash
cd /Users/yuki.sakurai/code/github/vectajp/swarrow.com-backend
bun run test
bun run check

cd /Users/yuki.sakurai/code/github/vectajp/swarrow.com
bun --bun run test:seo
bun --bun run check
bun --bun run build
```

[Ask First] 本番 D1 への `bun run db:migrate:remote` 実行と `swarrow.com-backend`/`swarrow.com` の deploy は、このプランの範囲外。deploy 順序は設計書の Boundaries に従い「D1 マイグレーション → backend Worker deploy → frontend build/deploy」を厳守し、実行前にユーザーへ確認する。
