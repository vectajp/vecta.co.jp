# Vecta と Swarrow の GA4 計測・プライバシー開示 Implementation Plan

**Goal:** Vecta と Swarrow を別 GA4 プロパティで標準計測し、閲覧を妨げずに Analytics 利用を開示する。

**Architecture:** 両サイトの prerendered HTML を共有する `src/app.html` に、`PUBLIC_GA_MEASUREMENT_ID` が有効な場合だけ動く Google tag bootstrap を置く。各サイトのフッターから `noindex` の `/privacy/` へリンクし、GA4 利用・Cookie 等の収集・オプトアウトを開示する。Measurement ID は Cloudflare Pages の Production / Preview 環境変数にのみ設定する。

**Tech Stack:** SvelteKit 2.69, Svelte 5, adapter-static, Bun test, Biome, Cloudflare Pages.

**Design Document:** `docs/plans/2026-07-17-vecta-swarrow-google-analytics-design.md`

**Related Issue:** https://github.com/vectajp/vecta.co.jp/issues/51

**Recommended Execution:** Batch (HITL) — 2つの独立リポジトリにまたがる6つの小さい変更であり、Vecta 完了後と Swarrow 完了後に確認点を置く。

```text
Vecta:   Task 1 ──> Task 2 ──> Task 3
Swarrow: Task 4 ──> Task 5 ──> Task 6
```

---

### Task 1: Vecta の環境設定付き GA4 bootstrap を追加する

**Files:**

- Create: `vecta.co.jp/src/app.test.ts`
- Modify: `vecta.co.jp/src/app.html`
- Modify: `vecta.co.jp/.env.example`

**Step 1: Write the failing test**

Create `vecta.co.jp/src/app.test.ts`:

```ts
import { describe, expect, test } from 'bun:test'

const APP_HTML_PATH = 'src/app.html'
const MEASUREMENT_ID_PLACEHOLDER =
  '%sveltekit.env.PUBLIC_GA_MEASUREMENT_ID%'

describe('Google Analytics app shell', () => {
  test('initializes one tag only for a valid public Measurement ID', async () => {
    const appHtml = await Bun.file(APP_HTML_PATH).text()

    expect(appHtml).toContain(
      `data-ga-measurement-id="${MEASUREMENT_ID_PLACEHOLDER}"`,
    )
    expect(appHtml).toContain(
      "const measurementId = document.currentScript?.getAttribute('data-ga-measurement-id') ?? ''",
    )
    expect(appHtml).toContain('/^G-[A-Z0-9]+$/.test(measurementId)')
    expect(appHtml).toContain("gtag('config', measurementId)")
    expect(
      appHtml.match(/googletagmanager\.com\/gtag\/js\?id=/g) ?? [],
    ).toHaveLength(1)
  })
})
```

**Step 2: Run test to verify it fails**

Run:

```bash
bun test src/app.test.ts
```

Expected: FAIL because `src/app.html` does not yet contain `data-ga-measurement-id`.

**Step 3: Write minimal implementation**

Insert this complete block immediately after the opening `<head>` in `vecta.co.jp/src/app.html`:

```html
    <script data-ga-measurement-id="%sveltekit.env.PUBLIC_GA_MEASUREMENT_ID%">
      const measurementId = document.currentScript?.getAttribute('data-ga-measurement-id') ?? ''
      if (/^G-[A-Z0-9]+$/.test(measurementId)) {
        window.dataLayer = window.dataLayer || []
        function gtag() {
          window.dataLayer.push(arguments)
        }
        gtag('js', new Date())
        gtag('config', measurementId)

        const googleTag = document.createElement('script')
        googleTag.async = true
        googleTag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
        document.head.append(googleTag)
      }
    </script>
```

Append the following commented placeholder to `vecta.co.jp/.env.example`:

```dotenv

# Google Analytics 4 Measurement ID for this site. Leave empty to disable local tracking.
PUBLIC_GA_MEASUREMENT_ID=
```

Do not place a production ID in this file.

**Step 4: Run test to verify it passes**

Run:

```bash
bun test src/app.test.ts
PUBLIC_GA_MEASUREMENT_ID=G-TEST0000000 bun run build
rg -n "G-TEST0000000|googletagmanager\.com/gtag/js" dist/index.html
```

Expected: test PASS; the generated `dist/index.html` contains the test ID and one Google tag URL.

**Step 5: Commit**

```bash
git -C "/Users/sakurai.yuki/code/github/vectajp/vecta.co.jp" add src/app.test.ts src/app.html .env.example
git -C "/Users/sakurai.yuki/code/github/vectajp/vecta.co.jp" commit -m "feat: Vecta サイトに GA4 の初期化を追加"
```

---

### Task 2: Vecta のプライバシー開示とフッター導線を追加する

**Files:**

- Create: `vecta.co.jp/src/routes/privacy/privacy.test.ts`
- Create: `vecta.co.jp/src/routes/privacy/+page.svelte`
- Modify: `vecta.co.jp/src/lib/vecta/Footer.svelte`

**Step 1: Write the failing test**

Create `vecta.co.jp/src/routes/privacy/privacy.test.ts`:

```ts
import { describe, expect, test } from 'bun:test'

describe('privacy disclosure', () => {
  test('links the shared footer to a noindex GA4 disclosure page', async () => {
    const [page, footer] = await Promise.all([
      Bun.file('src/routes/privacy/+page.svelte').text(),
      Bun.file('src/lib/vecta/Footer.svelte').text(),
    ])

    expect(footer).toContain('href="/privacy/"')
    expect(footer).toContain('プライバシーについて')
    expect(page).toContain('<meta name="robots" content="noindex">')
    expect(page).toContain('Google Analytics 4')
    expect(page).toContain('Google Analytics Opt-out Browser Add-on')
    expect(page).toContain('Google Ads')
  })
})
```

**Step 2: Run test to verify it fails**

Run:

```bash
bun test src/routes/privacy/privacy.test.ts
```

Expected: FAIL with an `ENOENT` error because the privacy route does not yet exist.

**Step 3: Write minimal implementation**

Create `vecta.co.jp/src/routes/privacy/+page.svelte`:

```svelte
<script lang="ts">
  import { site } from '$lib/vecta/content'
  import Footer from '$lib/vecta/Footer.svelte'
  import Header from '$lib/vecta/Header.svelte'
  import { buildPageSeo } from '$lib/vecta/seo'

  const seo = buildPageSeo({
    title: 'プライバシーについて',
    description: '株式会社Vectaの Google Analytics 利用に関するご案内です。',
    path: '/privacy/',
  })
</script>

<svelte:head>
  <title>{seo.title}</title>
  <meta name="description" content={seo.description}>
  <meta name="keywords" content={site.keywords}>
  <link rel="canonical" href={seo.canonical}>
  <meta name="robots" content="noindex">
</svelte:head>

<Header />

<main>
  <section class="privacy">
    <div class="container privacy-content">
      <p class="eyebrow">Privacy</p>
      <h1>プライバシーについて</h1>
      <p>
        株式会社Vectaは、当サイトの利用状況を把握し、内容や導線を改善するために Google Analytics 4 を利用しています。
      </p>

      <h2>収集される情報</h2>
      <p>
        Google Analytics 4 は Cookie 等を利用して、閲覧したページ、利用した端末・ブラウザ、アクセス元などの利用状況を収集・処理します。当サイトでは、問い合わせフォームの入力内容、User ID、Google Ads 連携、リマーケティング、独自イベント計測は Google Analytics に送信しません。
      </p>

      <h2>Google による情報の利用</h2>
      <p>
        Google による情報の収集・利用については、以下をご確認ください。
      </p>
      <ul>
        <li>
          <a href="https://policies.google.com/technologies/partner-sites?hl=ja">Google のサービスを使用するサイトやアプリから収集した情報の Google による使用</a>
        </li>
        <li>
          <a href="https://tools.google.com/dlpage/gaoptout?hl=ja">Google Analytics Opt-out Browser Add-on</a>
        </li>
      </ul>
    </div>
  </section>
</main>

<Footer />

<style>
  .privacy {
    background: var(--color-paper);
    padding: 4rem 0 5rem;
  }

  .privacy-content {
    max-width: 760px;
  }

  .eyebrow {
    color: var(--color-vector-blue);
    font-family: var(--font-monospace);
    font-size: 0.82rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    text-transform: uppercase;
  }

  h1,
  h2 {
    color: var(--color-indigo);
  }

  h1 {
    font-size: 2.35rem;
    line-height: 1.2;
    margin: 0 0 2rem;
  }

  h2 {
    font-size: 1.35rem;
    margin: 2.5rem 0 0.75rem;
  }

  p,
  li {
    color: var(--color-sumi);
    line-height: 1.9;
  }

  ul {
    padding-left: 1.4rem;
  }

  a {
    color: var(--color-vector-blue);
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 0.18em;
  }

  @media (min-width: 769px) {
    .privacy {
      padding: 5rem 0 6rem;
    }

    h1 {
      font-size: 3rem;
    }
  }
</style>
```

In `vecta.co.jp/src/lib/vecta/Footer.svelte`, append this list item inside the existing `.footer-nav ul`, after the `{#each}` block:

```svelte
          <li>
            <a href="/privacy/">プライバシーについて</a>
          </li>
```

**Step 4: Run test to verify it passes**

Run:

```bash
bun test src/routes/privacy/privacy.test.ts
bun run check
```

Expected: PASS; the shared footer source and privacy route contain every required disclosure marker.

**Step 5: Commit**

```bash
git -C "/Users/sakurai.yuki/code/github/vectajp/vecta.co.jp" add src/routes/privacy/privacy.test.ts src/routes/privacy/+page.svelte src/lib/vecta/Footer.svelte
git -C "/Users/sakurai.yuki/code/github/vectajp/vecta.co.jp" commit -m "feat: Vecta にプライバシー開示を追加"
```

---

### Task 3: Vecta の GA4 設定・運用手順を文書化する

**Files:**

- Modify: `vecta.co.jp/README.md`

**Step 1: Update the setup documentation**

In the existing `環境変数の設定` code block, add this line after `PUBLIC_API_BASE_URL`:

```dotenv
PUBLIC_GA_MEASUREMENT_ID=
```

Add this complete section after `本番環境の設定`:

```md
### Google Analytics 4

Vecta のアクセス状況は Google Analytics 4 で計測する。`PUBLIC_GA_MEASUREMENT_ID` には、このサイト専用の GA4 プロパティの Measurement ID を設定する。

- `.env.example` と Git には実 ID を保存しない。
- Cloudflare Pages の Production と Preview に、それぞれ `PUBLIC_GA_MEASUREMENT_ID` を設定する。
- 値が未設定または不正な場合は、Google Analytics を読み込まない。
- デプロイ後は Tag Assistant と GA4 Realtime で、タグが1個だけ検出されることを確認する。
- プライバシー開示は `/privacy/` で公開する。開示文面は Production 反映前に事業・法務責任者が確認する。
```

**Step 2: Verify documentation scope**

Run:

```bash
git diff --check -- README.md
rg -n "PUBLIC_GA_MEASUREMENT_ID|Tag Assistant|/privacy/" README.md
```

Expected: PASS; documentation contains configuration, verification, and approval prerequisites without a real Measurement ID.

**Step 3: Commit**

```bash
git -C "/Users/sakurai.yuki/code/github/vectajp/vecta.co.jp" add README.md
git -C "/Users/sakurai.yuki/code/github/vectajp/vecta.co.jp" commit -m "docs: Vecta の GA4 設定手順を追加"
```

---

### Task 4: Swarrow の環境設定付き GA4 bootstrap を追加する

**Files:**

- Modify: `swarrow.com/tests/seo/content.test.ts`
- Modify: `swarrow.com/src/app.html`
- Modify: `swarrow.com/package.json`

**Step 1: Write the failing test**

Append this test to `swarrow.com/tests/seo/content.test.ts`:

```ts
describe("Google Analytics app shell", () => {
  test("initializes one tag only for a valid public Measurement ID", async () => {
    const appHtml = await Bun.file("src/app.html").text();

    expect(appHtml).toContain(
      'data-ga-measurement-id="%sveltekit.env.PUBLIC_GA_MEASUREMENT_ID%"',
    );
    expect(appHtml).toContain(
      "const measurementId = document.currentScript?.getAttribute('data-ga-measurement-id') ?? ''",
    );
    expect(appHtml).toContain("/^G-[A-Z0-9]+$/.test(measurementId)");
    expect(appHtml).toContain("gtag('config', measurementId)");
    expect(
      appHtml.match(/googletagmanager\.com\/gtag\/js\?id=/g) ?? [],
    ).toHaveLength(1);
  });
});
```

**Step 2: Run test to verify it fails**

Run:

```bash
bun test tests/seo/content.test.ts
```

Expected: FAIL because the app shell has no public Measurement ID placeholder.

**Step 3: Write minimal implementation**

Insert this complete block immediately after the opening `<head>` in `swarrow.com/src/app.html`:

```html
    <script data-ga-measurement-id="%sveltekit.env.PUBLIC_GA_MEASUREMENT_ID%">
      const measurementId = document.currentScript?.getAttribute('data-ga-measurement-id') ?? ''
      if (/^G-[A-Z0-9]+$/.test(measurementId)) {
        window.dataLayer = window.dataLayer || []
        function gtag() {
          window.dataLayer.push(arguments)
        }
        gtag('js', new Date())
        gtag('config', measurementId)

        const googleTag = document.createElement('script')
        googleTag.async = true
        googleTag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
        document.head.append(googleTag)
      }
    </script>
```

Replace the `test:seo` script in `swarrow.com/package.json` with this command so build-output tests always inspect a deterministic non-production ID:

```json
"test:seo": "PUBLIC_GA_MEASUREMENT_ID=G-TEST0000000 bun test tests/seo/content.test.ts && PUBLIC_GA_MEASUREMENT_ID=G-TEST0000000 bun --bun run build && bun test tests/seo/build-output.test.ts"
```

**Step 4: Run test to verify it passes**

Run:

```bash
bun test tests/seo/content.test.ts
```

Expected: PASS; source contains one environment-configured bootstrap and the valid-ID guard.

**Step 5: Commit**

```bash
git -C "/Users/sakurai.yuki/code/github/vectajp/swarrow.com" add tests/seo/content.test.ts src/app.html package.json
git -C "/Users/sakurai.yuki/code/github/vectajp/swarrow.com" commit -m "feat: Swarrow サイトに GA4 の初期化を追加"
```

---

### Task 5: Swarrow の GA4 設定・運用手順を文書化する

**Files:**

- Modify: `swarrow.com/.env.template`
- Modify: `swarrow.com/README.md`

**Step 1: Add the environment placeholder**

Append this block to `swarrow.com/.env.template`:

```dotenv

# Google Analytics 4 Measurement ID for this site. Leave empty to disable local tracking.
PUBLIC_GA_MEASUREMENT_ID=
```

**Step 2: Document the deployment configuration**

Add this complete section to `swarrow.com/README.md`, after `セットアップ`:

```md
## Google Analytics 4

Swarrow のアクセス状況は Google Analytics 4 で計測する。`PUBLIC_GA_MEASUREMENT_ID` には、Swarrow 専用の GA4 プロパティの Measurement ID を設定する。

- `.env.template` と Git には実 ID を保存しない。
- Cloudflare Pages の Production と Preview に、それぞれ `PUBLIC_GA_MEASUREMENT_ID` を設定する。
- 値が未設定または不正な場合は、Google Analytics を読み込まない。
- デプロイ後は Tag Assistant と GA4 Realtime で、タグが1個だけ検出されることを確認する。
- プライバシー開示は `/privacy/` で公開する。開示文面は Production 反映前に事業・法務責任者が確認する。
```

**Step 3: Verify documentation scope**

Run:

```bash
git diff --check -- .env.template README.md
rg -n "PUBLIC_GA_MEASUREMENT_ID|Tag Assistant|/privacy/" .env.template README.md
```

Expected: PASS; template and README document the site-specific configuration without a real ID.

**Step 4: Commit**

```bash
git -C "/Users/sakurai.yuki/code/github/vectajp/swarrow.com" add .env.template README.md
git -C "/Users/sakurai.yuki/code/github/vectajp/swarrow.com" commit -m "docs: Swarrow の GA4 設定手順を追加"
```

---

### Task 6: Swarrow のプライバシー開示・生成 HTML 検証を追加する

**Files:**

- Create: `swarrow.com/src/routes/privacy/+page.svelte`
- Modify: `swarrow.com/src/routes/+page.svelte`
- Modify: `swarrow.com/tests/seo/build-output.test.ts`

**Step 1: Write the failing build-output tests**

In `swarrow.com/tests/seo/build-output.test.ts`, add `let privacyHtml = "";` beside the existing HTML variables. In `beforeAll`, replace the `Promise.all` assignment with this complete list:

```ts
  [html, privacyHtml, robots, sitemap, modalSource, pageSource] = await Promise.all([
    Bun.file("build/index.html").text(),
    Bun.file("build/privacy/index.html").text(),
    Bun.file("build/robots.txt").text(),
    Bun.file("build/sitemap.xml").text(),
    Bun.file("src/lib/swarrow/ContactModal.svelte").text(),
    Bun.file("src/routes/+page.svelte").text(),
  ]);
```

Append this test suite:

```ts
describe("Google Analytics and privacy disclosure", () => {
  test("renders exactly one environment-configured Google tag", () => {
    expect(
      countMatches(html, /googletagmanager\.com\/gtag\/js\?id=/g),
    ).toBe(1);
    expect(countMatches(html, /G-TEST0000000/g)).toBe(1);
  });

  test("links a noindex privacy disclosure without expanding the sitemap", () => {
    const footer = html.match(/<footer[^>]*>[\s\S]*?<\/footer>/)?.[0] ?? "";

    expect(footer).toContain('href="/privacy/"');
    expect(footer).toContain("プライバシーについて");
    expect(privacyHtml).toContain('<meta name="robots" content="noindex"');
    expect(privacyHtml).toContain("Google Analytics 4");
    expect(privacyHtml).toContain("Google Analytics Opt-out Browser Add-on");
    expect(sitemap).not.toContain("https://swarrow.com/privacy/");
  });
});
```

**Step 2: Run test to verify it fails**

Run:

```bash
bun --bun run test:seo
```

Expected: FAIL with `ENOENT` because `build/privacy/index.html` does not yet exist.

**Step 3: Write minimal implementation**

Create `swarrow.com/src/routes/privacy/+page.svelte`:

```svelte
<script lang="ts">
  import { site, siteName } from "$lib/swarrow/content";
</script>

<svelte:head>
  <title>プライバシーについて | {siteName}</title>
  <meta
    name="description"
    content="Swarrow の Google Analytics 利用に関するご案内です。"
  >
  <link rel="canonical" href={`${site}/privacy/`}>
  <meta name="robots" content="noindex">
</svelte:head>

<main class="privacy-page">
  <a class="brand" href="/" aria-label="Swarrow トップへ">Swarrow</a>
  <article>
    <p class="eyebrow">Privacy</p>
    <h1>プライバシーについて</h1>
    <p>
      株式会社Vectaは、Swarrow サイトの利用状況を把握し、内容や導線を改善するために Google Analytics 4 を利用しています。
    </p>

    <h2>収集される情報</h2>
    <p>
      Google Analytics 4 は Cookie 等を利用して、閲覧したページ、利用した端末・ブラウザ、アクセス元などの利用状況を収集・処理します。当サイトでは、資料請求フォームの入力内容、User ID、Google Ads 連携、リマーケティング、独自イベント計測は Google Analytics に送信しません。
    </p>

    <h2>Google による情報の利用</h2>
    <p>Google による情報の収集・利用については、以下をご確認ください。</p>
    <ul>
      <li>
        <a href="https://policies.google.com/technologies/partner-sites?hl=ja">Google のサービスを使用するサイトやアプリから収集した情報の Google による使用</a>
      </li>
      <li>
        <a href="https://tools.google.com/dlpage/gaoptout?hl=ja">Google Analytics Opt-out Browser Add-on</a>
      </li>
    </ul>
  </article>
</main>

<footer class="privacy-footer">
  <a href="/">Swarrow トップへ</a>
  <a href="https://www.vecta.co.jp">株式会社Vecta</a>
</footer>

<style>
  :global(body) {
    margin: 0;
    background: #f4f4f6;
    color: #333;
    font-family: "Noto Sans JP", sans-serif;
  }

  .privacy-page {
    box-sizing: border-box;
    max-width: 760px;
    min-height: calc(100vh - 5rem);
    margin: 0 auto;
    padding: 2rem 1.25rem 4rem;
  }

  .brand {
    color: #333;
    font-family: Montserrat, sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    text-decoration: none;
  }

  article {
    margin-top: 4rem;
  }

  .eyebrow {
    color: #5a5f63;
    font-family: Montserrat, sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1,
  h2 {
    color: #333;
  }

  h1 {
    font-size: clamp(2rem, 7vw, 3rem);
    line-height: 1.2;
    margin: 0.5rem 0 2rem;
  }

  h2 {
    font-size: 1.25rem;
    margin-top: 2.5rem;
  }

  p,
  li {
    line-height: 1.9;
  }

  ul {
    padding-left: 1.25rem;
  }

  a {
    color: inherit;
  }

  article a {
    color: #315f66;
    font-weight: 700;
  }

  .privacy-footer {
    box-sizing: border-box;
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    padding: 1.5rem;
    border-top: 1px solid #d9dcdf;
    font-size: 0.85rem;
  }
</style>
```

In `swarrow.com/src/routes/+page.svelte`, replace the existing footer copy paragraph with this complete block and add the listed CSS:

```svelte
      <p class="vecta-footer-privacy">
        <a href="/privacy/">プライバシーについて</a>
      </p>
      <p class="vecta-footer-copy">
        © {currentYear} Vecta. All rights reserved.
      </p>
```

```css
  .vecta-footer-privacy {
    margin: 0 0 0.75rem;
    text-align: center;
  }

  .vecta-footer-privacy a {
    color: inherit;
    font-size: 0.84rem;
  }
```

**Step 4: Run test to verify it passes**

Run:

```bash
bun --bun run test:seo
bun --bun run check
bun --bun run build
```

Expected: PASS; build output contains one deterministic test tag, a footer privacy link, a generated `/privacy/` page with `noindex`, and the original root-only sitemap.

**Step 5: Commit**

```bash
git -C "/Users/sakurai.yuki/code/github/vectajp/swarrow.com" add src/routes/privacy/+page.svelte src/routes/+page.svelte tests/seo/build-output.test.ts
git -C "/Users/sakurai.yuki/code/github/vectajp/swarrow.com" commit -m "feat: Swarrow にプライバシー開示を追加"
```

---

## Post-merge deployment checklist

1. Vecta 用・Swarrow 用に別 GA4 プロパティと Web data stream を作成し、各 Measurement ID を取得する。
2. 各 Cloudflare Pages project の Production と Preview に、対応する `PUBLIC_GA_MEASUREMENT_ID` を設定する。
3. プライバシー開示の最終文面を事業・法務責任者が確認する。
4. Preview で Tag Assistant を使い、各サイトに対応するタグが1個だけあることを確認する。
5. Production で GA4 Realtime を確認し、別プロパティへの混入がないことを確認する。
