# Swarrow Two-Product Homepage Implementation Plan

**Goal:** Swarrow.com の単一ページを、自治体職員の便益と共通知識基盤を先に示し、`Swarrow Chat` と `Swarrow Call` を同格の独立製品として理解できる構成へ変更する。

**Architecture:** SvelteKit の root route と adapter-static の構成は維持し、既存の画像・WebM・poster fallback を再利用する。製品情報と SEO 情報は製品中立の `$lib/swarrow/content.ts` に集約し、`bun:test` で content と build 後 HTML の検索契約をテストする。実際の index・impressions・clicks・CTR は公開後に Google Search Console で観測し、CI の合否とは分離する。

**Tech Stack:** SvelteKit 2.69.1、Svelte 5.56.4、TypeScript 6.0.3、Bun 1.3.14、Vite 8.1.3、adapter-static 3.0.10、Biome 2.5.2、`bun:test`

**Design Document:** `docs/plans/2026-07-11-swarrow-two-product-homepage-design.md`

**Recommended Execution:** Batch (autonomous) — 16タスクを依存順に実行し、上段導線、製品詳細、SEO の3つの milestone で保存した browser evidence を最終レビューする。

**Working Tree Assumption:** `main` 上の未コミット変更は承認済み設計書だけであり、ユーザー承認によりそのまま計画・実行対象へ含める。

**SEO Validation Boundary:** ローカル／CI は crawlability、metadata、可視見出し、canonical、robots、sitemap、JSON-LD の整合性を検証する。検索順位や検索ヒットは保証せず、公開後に Search Console の root URL と対象クエリ群で測定する。OAuth credential や Search Console export はリポジトリへ保存しない。

---

## Dependency Order

```text
T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9
                                              ↓
T16 ← T15 ← T14 ← T13 ← T12 ← T11 ← T10 ←──┘
```

Milestone checkpoints:

- **M1 after Task 7:** Hero、Pain、Knowledge、Product Overview をブラウザ確認
- **M2 after Task 13:** Chat、Call、Operations、Support、CTA をブラウザ確認
- **M3 after Task 16:** SEO 契約と Search Console 運用手順を最終確認

---

### Task 1: 製品中立のライブラリ名前空間へ移動

**Purpose:** Call 単一製品を前提にした `$lib/swarrow-call` を、2製品共通の `$lib/swarrow` へ構造だけ変更する。表示・文言・API 挙動は変えない。

**Files:**

- Move: `src/lib/swarrow-call/content.ts` → `src/lib/swarrow/content.ts`
- Move: `src/lib/swarrow-call/ContactModal.svelte` → `src/lib/swarrow/ContactModal.svelte`
- Modify: `src/routes/+page.svelte`

**Step 1: Verify the baseline before the tidy-first refactor**

Run:

```bash
bun --bun run check
bun --bun run build
```

Expected: both commands PASS before any move.

**Step 2: Move the shared files**

Run:

```bash
git mv src/lib/swarrow-call src/lib/swarrow
```

**Step 3: Update the two imports in `src/routes/+page.svelte`**

```svelte
import ContactModal from "$lib/swarrow/ContactModal.svelte";
import {
  callCapabilities,
  cases,
  companyOverviewLink,
  customerSuccessSteps,
  jsonLd,
  navItems,
  news,
  pageDescription,
  pageTitle,
  showCaseStudies,
  site,
} from "$lib/swarrow/content";
```

**Step 4: Verify that no old module import remains**

Run:

```bash
rg -n '\$lib/swarrow-call' src
bun --bun run check
bun --bun run build
```

Expected: `rg` returns no matches; check and build PASS with unchanged rendered output.

**Step 5: Commit**

```bash
git add src/lib/swarrow src/lib/swarrow-call src/routes/+page.svelte
git commit -m "refactor(lp): 共通モジュールを製品中立の名前空間へ移す"
```

---

### Task 2: Bun SEO 契約テストの基盤を追加

**Purpose:** 新規依存を追加せず、content と adapter-static の build 出力を自動検証できる基盤を作る。最初は現行仕様でも成立する crawlability 契約だけを固定する。

**Files:**

- Modify: `package.json`
- Create: `tests/seo/content.test.ts`
- Create: `tests/seo/build-output.test.ts`

**Step 1: Create the baseline content test**

```ts
import { describe, expect, test } from "bun:test";
import {
  showCaseStudies,
  site,
} from "../../src/lib/swarrow/content";

describe("SEO content baseline", () => {
  test("keeps the root URL as the only canonical site URL", () => {
    expect(site).toBe("https://swarrow.com");
  });

  test("keeps fictional case studies unpublished", () => {
    expect(showCaseStudies).toBe(false);
  });
});
```

**Step 2: Create the baseline build-output test**

```ts
import { beforeAll, describe, expect, test } from "bun:test";

let html = "";
let robots = "";
let sitemap = "";

const countMatches = (value: string, pattern: RegExp) =>
  Array.from(value.matchAll(pattern)).length;

beforeAll(async () => {
  [html, robots, sitemap] = await Promise.all([
    Bun.file("build/index.html").text(),
    Bun.file("build/robots.txt").text(),
    Bun.file("build/sitemap.xml").text(),
  ]);
});

describe("crawlability baseline", () => {
  test("publishes Japanese HTML with one canonical URL", () => {
    expect(html).toContain('<html lang="ja">');
    expect(
      countMatches(
        html,
        /<link rel="canonical" href="https:\/\/swarrow\.com\/"\s*\/?>/g,
      ),
    ).toBe(1);
    expect(html).toContain('<meta name="robots" content="index,follow"');
    expect(html).not.toMatch(/noindex/i);
  });

  test("advertises the root sitemap without blocking crawlers", () => {
    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Disallow:\n");
    expect(robots).toContain("Sitemap: https://swarrow.com/sitemap.xml");
  });

  test("lists only the root canonical URL in the sitemap", () => {
    const locations = Array.from(
      sitemap.matchAll(/<loc>([^<]+)<\/loc>/g),
      (match) => match[1],
    );
    expect(locations).toEqual(["https://swarrow.com/"]);
  });
});
```

**Step 3: Add the scripts to `package.json`**

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "prepare": "svelte-kit sync || echo ''",
    "test": "bun test tests/seo/content.test.ts",
    "test:seo": "bun test tests/seo/content.test.ts && bun --bun run build && bun test tests/seo/build-output.test.ts",
    "check": "biome check && svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:fix": "biome check --write",
    "clean": "git clean -xdf node_modules build .svelte-kit",
    "update": "bun update --latest"
  }
}
```

Keep all existing `devDependencies` unchanged.

**Step 4: Run the new baseline**

Run:

```bash
bun --bun run test:seo
bun --bun run test
bun --bun run check
```

Expected: both PASS. No package or lockfile dependency changes occur.

**Step 5: Commit**

```bash
git add package.json tests/seo/content.test.ts tests/seo/build-output.test.ts
git commit -m "test(seo): 検索向け build 契約テストを追加"
```

---

### Task 3: 2製品共通のコンテンツモデルを追加

**Purpose:** Hero、Pain、共通知識基盤、Product Overview、JSON-LD が同じ製品定義を参照できる source of truth を作る。まだ画面や metadata は変更しない。

**Files:**

- Modify: `src/lib/swarrow/content.ts`
- Modify: `tests/seo/content.test.ts`

**Step 1: Replace `tests/seo/content.test.ts` with the failing product contract**

```ts
import { describe, expect, test } from "bun:test";
import {
  heroCopy,
  painPoints,
  products,
  sharedKnowledge,
  showCaseStudies,
  site,
  siteName,
} from "../../src/lib/swarrow/content";

describe("Swarrow product content", () => {
  test("defines two equally addressable products", () => {
    expect(site).toBe("https://swarrow.com");
    expect(siteName).toBe("Swarrow");
    expect(products.map(({ id }) => id)).toEqual(["chat", "call"]);
    expect(products.map(({ name }) => name)).toEqual([
      "Swarrow Chat",
      "Swarrow Call",
    ]);
    expect(products.every(({ href }) => href.startsWith("#"))).toBe(true);
    expect(products.every(({ benefit }) => benefit.length > 0)).toBe(true);
  });

  test("states independent adoption and the shared knowledge value", () => {
    expect(sharedKnowledge.adoption).toContain("単独");
    expect(sharedKnowledge.adoption).toContain("組み合わせ");
    expect(sharedKnowledge.description).toContain("1つの知識基盤");
    expect(sharedKnowledge.description).toContain("Swarrow Chat");
    expect(sharedKnowledge.description).toContain("Swarrow Call");
  });

  test("uses benefit-led copy without unsupported metrics", () => {
    const publicCopy = JSON.stringify({
      heroCopy,
      painPoints,
      products,
      sharedKnowledge,
    });
    expect(publicCopy).not.toMatch(/半減|70%削減|100%|どの自治体でも/);
  });

  test("keeps fictional case studies unpublished", () => {
    expect(showCaseStudies).toBe(false);
  });
});
```

**Step 2: Run the test to verify it fails**

Run:

```bash
bun test tests/seo/content.test.ts
```

Expected: FAIL because `siteName`, `heroCopy`, `painPoints`, `products`, and `sharedKnowledge` are not exported.

**Step 3: Add the following definitions after `site` in `src/lib/swarrow/content.ts`**

```ts
export const siteName = "Swarrow";

export type ProductId = "chat" | "call";

export type Product = {
  id: ProductId;
  name: string;
  category: string;
  benefit: string;
  useCases: readonly string[];
  href: `#${ProductId}`;
};

export const products: readonly Product[] = [
  {
    id: "chat",
    name: "Swarrow Chat",
    category: "自治体ホームページAI窓口",
    benefit:
      "ホームページやLINEで住民の自己解決を促し、電話へ集中する前に定型的な質問へ回答します。",
    useCases: ["手続き案内", "必要書類", "施設案内", "予約・申請への誘導"],
    href: "#chat",
  },
  {
    id: "call",
    name: "Swarrow Call",
    category: "自治体AIコールセンター",
    benefit:
      "AIが電話の一次受付、案内、取次、発信を担い、職員の電話対応を必要な案件へ絞ります。",
    useCases: ["代表電話", "時間外受付", "担当課取次", "リマインド・一括周知"],
    href: "#call",
  },
];

export const heroCopy = {
  eyebrow: "自治体の問い合わせ対応を、ひとつの知識で。",
  title: "電話とホームページの定型対応をAIに。",
  emphasis: "職員は、本来の仕事へ。",
  description:
    "自治体ホームページAI窓口「Swarrow Chat」と自治体AIコールセンター「Swarrow Call」。FAQ・手順書・業務データを1つの知識基盤で管理し、住民からの問い合わせにWebと電話で応えます。",
} as const;

export const painPoints = [
  {
    title: "同じ問い合わせが繰り返される",
    body: "手続き、必要書類、担当課などの定型質問が電話や窓口へ集中します。",
  },
  {
    title: "案内の知識が分散している",
    body: "ホームページと電話でFAQを別々に管理すると、更新と案内内容に差が生まれます。",
  },
  {
    title: "繁忙時や時間外に受けきれない",
    body: "問い合わせが重なると、職員の本来業務と住民への案内の両方が滞ります。",
  },
] as const;

export const sharedKnowledge = {
  title: "一度整えた知識を、ホームページにも電話にも。",
  description:
    "FAQ、手順書、業務データを1つの知識基盤で管理し、Swarrow ChatとSwarrow Callの両方から利用できます。",
  adoption: "単独でも、組み合わせても導入可能",
} as const;
```

Keep the existing `pageTitle`, `pageDescription`, customer success, Call capabilities, hidden cases, News, nav, and JSON-LD unchanged in this task.

**Step 4: Run tests and checks**

Run:

```bash
bun test tests/seo/content.test.ts
bun --bun run check
```

Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/swarrow/content.ts tests/seo/content.test.ts
git commit -m "feat(lp): Swarrow 2製品のコンテンツモデルを追加"
```

---

### Task 4: 製品中立のブランドとフォーム表記へ変更

**Purpose:** Header、Footer、OG site name、問い合わせフォームの組織名を `Swarrow Call`／企業向け表記から、2製品共通の `Swarrow`／自治体向け表記へ揃える。問い合わせ API payload は変えない。

**Files:**

- Modify: `src/routes/+page.svelte`
- Modify: `src/lib/swarrow/ContactModal.svelte`
- Modify: `tests/seo/build-output.test.ts`

**Step 1: Extend the test fixture and add failing brand contracts**

Add the modal fixture to the top of `tests/seo/build-output.test.ts`:

```ts
let html = "";
let robots = "";
let sitemap = "";
let modalSource = "";

beforeAll(async () => {
  [html, robots, sitemap, modalSource] = await Promise.all([
    Bun.file("build/index.html").text(),
    Bun.file("build/robots.txt").text(),
    Bun.file("build/sitemap.xml").text(),
    Bun.file("src/lib/swarrow/ContactModal.svelte").text(),
  ]);
});
```

Keep `countMatches`, then append:

```ts
describe("neutral Swarrow brand", () => {
  test("uses the existing mark with live Swarrow text", () => {
    expect(html).toContain('content="Swarrow"');
    expect(html).toContain('src="/swarrow/icon.png"');
    expect(html).toContain('class="brand-name');
    expect(html).toContain('class="foot-name');
    expect(html).not.toContain('src="/swarrow/logo.svg"');
    expect(html).not.toContain('src="/swarrow/footer-logo.svg"');
    expect(html).toContain("© Swarrow");
  });

  test("uses a municipal organization label without changing request fields", () => {
    expect(modalSource).toContain("自治体・団体名");
    for (const field of [
      "companyName",
      "name",
      "nameKana",
      "email",
      "inquiry",
      "turnstileToken",
    ]) {
      expect(modalSource).toContain(field);
    }
    expect(modalSource).toContain("FALLBACK_DOWNLOAD_REQUEST_API_URL");
  });
});
```

**Step 2: Run the test to verify it fails**

Run:

```bash
bun --bun run test:seo
```

Expected: FAIL because the current Header/Footer use Call-specific SVGs and the modal says `会社名`.

**Step 3: Import and use `siteName` in `src/routes/+page.svelte`**

Add `siteName` to the content import. Replace the OGP site name with:

```svelte
<meta property="og:site_name" content={siteName}>
```

Replace the Header brand with:

```svelte
<a class="brand" href="#top" aria-label="Swarrow トップへ">
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
```

Replace the Footer brand and copyright with:

```svelte
<div class="foot-brand" aria-label="Swarrow">
  <img
    class="foot-mark"
    src="/swarrow/icon.png"
    alt=""
    width="120"
    height="120"
    decoding="async"
  >
  <span class="foot-name">Swarrow</span>
</div>
```

```svelte
<p class="foot-copy">© Swarrow</p>
```

Add the company link to `.foot-links` so removing it from the Hero later does not create a dead end:

```svelte
<a
  href={companyOverviewLink.href}
  target="_blank"
  rel="noopener noreferrer"
>
  {companyOverviewLink.label}<span class="ext" aria-hidden="true">↗</span>
</a>
```

Replace `.brand-logo` and `.foot-logo` styles with:

```css
.brand-mark,
.foot-mark {
  display: block;
  width: 2.5rem;
  height: 2.5rem;
}
.brand-name,
.foot-name {
  color: var(--navy);
  font-size: clamp(1.25rem, 2vw, 1.7rem);
  font-weight: 800;
  letter-spacing: 0.02em;
  line-height: 1;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  flex: 0 0 auto;
}
.foot-brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.foot-name {
  color: #fff;
}
```

**Step 4: Change only the visible organization label in `ContactModal.svelte`**

```svelte
<label>
  自治体・団体名<span class="required">*</span>
  <input
    type="text"
    bind:value={companyName}
    placeholder="〇〇市役所"
    required
  >
</label>
```

Do not change `handleSubmit`, `DOWNLOAD_REQUEST_API_URL`, or the JSON payload.

**Step 5: Run tests and checks**

Run:

```bash
bun --bun run test:seo
bun --bun run check
```

Expected: PASS.

**Step 6: Commit**

```bash
git add src/routes/+page.svelte src/lib/swarrow/ContactModal.svelte tests/seo/build-output.test.ts
git commit -m "feat(lp): Swarrow 共通ブランド表記へ統一"
```

---

### Task 5: 便益中心の Hero と Pain strip を追加

**Purpose:** 技術説明より先に、自治体職員の問い合わせ対応負担と導入後の業務変化を伝える。既存 Hero 動画は維持し、Hero 内 News は News セクションへ一本化する。

**Files:**

- Modify: `src/routes/+page.svelte`
- Modify: `tests/seo/build-output.test.ts`

**Step 1: Append the failing Hero contract**

```ts
describe("benefit-led first view", () => {
  test("renders one benefit-led H1 and both product names", () => {
    expect(countMatches(html, /<h1\b/g)).toBe(1);
    expect(html).toContain("電話とホームページの定型対応をAIに。");
    expect(html).toContain("職員は、本来の仕事へ。");

    const hero = html.match(/<section class="hero[^>]*>([\s\S]*?)<\/section>/)?.[1];
    expect(hero).toContain("Swarrow Chat");
    expect(hero).toContain("Swarrow Call");
    expect(hero).not.toContain("hero-news");
  });

  test("places a three-item pain strip immediately after the Hero", () => {
    expect(html).toContain('id="problems"');
    expect(countMatches(html, /class="problem-card\b/g)).toBe(3);
    expect(html.indexOf('class="hero')).toBeLessThan(html.indexOf('id="problems"'));
    expect(html.indexOf('id="problems"')).toBeLessThan(
      html.indexOf('class="knowledge'),
    );
  });
});
```

**Step 2: Run the test to verify it fails**

Run:

```bash
bun --bun run test:seo
```

Expected: FAIL on the new H1, missing `#problems`, and Hero News.

**Step 3: Import `heroCopy` and `painPoints`, and remove `heroSupportLead`**

Add both exports to the content import and delete the local `heroSupportLead` constant.

**Step 4: Replace the Hero copy/actions and remove Hero News**

```svelte
<div class="hero-copy">
  <p class="hero-eyebrow">{heroCopy.eyebrow}</p>
  <h1 class="hero-title">
    <span>{heroCopy.title}</span>
    <span>{heroCopy.emphasis}</span>
  </h1>
  <p class="hero-sub">{heroCopy.description}</p>
  <div class="hero-actions" aria-label="主要な導線">
    <button type="button" class="hero-primary" onclick={openContactModal}>
      導入相談・デモを依頼する
    </button>
    <a class="hero-secondary" href="#products">2つの製品を見る</a>
  </div>
</div>
```

Keep `.hero-media` unchanged. Delete both `.hero-mobile-actions` and `.hero-news` markup.

Insert immediately after the Hero section:

```svelte
<section id="problems" class="problems" aria-labelledby="problems-title">
  <div class="problems-inner">
    <p class="problems-kicker">自治体窓口が抱える課題</p>
    <h2 id="problems-title" class="problems-title">
      問い合わせ対応が、職員の時間を奪っていませんか。
    </h2>
    <div class="problems-grid">
      {#each painPoints as point (point.title)}
        <article class="problem-card" data-reveal>
          <h3>{point.title}</h3>
          <p>{point.body}</p>
        </article>
      {/each}
    </div>
  </div>
</section>
```

**Step 5: Replace fixed-height/nowrap Hero rules and add the new styles**

```css
.hero-copy {
  position: relative;
  z-index: 2;
  align-self: center;
  min-width: 0;
  margin-top: clamp(3rem, 8vw, 8rem);
}
.hero-eyebrow,
.problems-kicker {
  margin: 0 0 0.8rem;
  color: var(--sage-deep);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}
.hero-title span {
  display: block;
}
.hero-sub {
  max-width: 36rem;
  margin: 1.35rem 0 0;
  color: var(--ink-soft);
  font-size: clamp(0.9rem, 1.2vw, 1rem);
  letter-spacing: 0.02em;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1.6rem;
}
.hero-primary,
.hero-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.9rem;
  padding: 0.7rem 1.4rem;
  border-radius: 999px;
  font: inherit;
  font-weight: 800;
}
.hero-primary {
  border: 0;
  background: var(--navy);
  color: #fff;
  cursor: pointer;
}
.hero-secondary {
  border: 1px solid var(--navy);
  color: var(--navy);
}
.problems {
  position: relative;
  z-index: 3;
  padding: clamp(2.75rem, 6vw, 4.5rem) clamp(1.2rem, 4vw, 3.5rem);
  background: var(--paper);
}
.problems-inner {
  max-width: 1180px;
  margin: 0 auto;
}
.problems-title {
  max-width: 48rem;
  margin: 0;
  color: var(--navy);
  font-size: clamp(1.5rem, 3vw, 2.35rem);
  line-height: 1.55;
}
.problems-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: clamp(1.8rem, 4vw, 3rem);
}
.problem-card {
  padding: 1.4rem;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--bg);
}
.problem-card h3,
.problem-card p {
  margin: 0;
}
.problem-card h3 {
  color: var(--navy);
  font-size: 1rem;
}
.problem-card p {
  margin-top: 0.5rem;
  color: var(--ink-soft);
  font-size: 0.9rem;
}
```

Delete all `.hero-news*`, `.hero-mobile-actions`, `.hero-mobile-contact`, and `.hero-mobile-company` style blocks. In the mobile media query add:

```css
.hero-actions {
  justify-content: center;
}
.hero-primary,
.hero-secondary {
  width: 100%;
  box-sizing: border-box;
}
.problems-grid {
  grid-template-columns: 1fr;
}
```

Set the existing mobile `.knowledge` margin to `0`; the old `-10.5rem` overlap is no longer valid after inserting the Pain strip.

**Step 6: Run tests and checks**

Run:

```bash
bun --bun run test:seo
bun --bun run check
```

Expected: PASS.

**Step 7: Commit**

```bash
git add src/routes/+page.svelte tests/seo/build-output.test.ts
git commit -m "feat(lp): 便益中心の Hero と課題提示を追加"
```

---

### Task 6: 共通知識基盤の統合価値を明確化

**Purpose:** ベクトル化の技術説明を主役にせず、「一度整えた FAQ 等を Chat と Call の双方で使える」という差別化価値を、製品詳細より前に伝える。

**Files:**

- Modify: `src/routes/+page.svelte`
- Modify: `tests/seo/build-output.test.ts`

**Step 1: Append the failing Shared Knowledge contract**

```ts
describe("shared knowledge", () => {
  test("presents one knowledge base before product details", () => {
    expect(html).toContain('id="knowledge"');
    expect(html).toContain("1つの知識で、ホームページも電話も。");
    expect(html).toContain("Swarrow Chat");
    expect(html).toContain("Swarrow Call");
    expect(html).toContain('/swarrow-call/knowledge-flow-alpha.webm');
    expect(html).not.toContain("Swarrow Call 基盤");
  });
});
```

**Step 2: Run the test to verify it fails**

Run:

```bash
bun --bun run test:seo
```

Expected: FAIL because `#knowledge` and the integrated heading do not exist.

**Step 3: Import `sharedKnowledge` and replace the Knowledge section opening/copy**

Keep the existing figure, WebM, PNG fallback, curve SVG, and dimensions. Change the section and all Swarrow Call-specific labels to:

```svelte
<section
  id="knowledge"
  class="knowledge"
  aria-labelledby="knowledge-title"
>
```

```svelte
<video
  class="knowledge-video"
  poster="/swarrow-call/knowledge-flow-alpha.png"
  muted
  loop
  playsinline
  preload="none"
  width="1280"
  height="720"
  aria-label="文書やFAQをSwarrow ChatとSwarrow Callで共有する知識基盤のイメージ"
>
  <source
    src="/swarrow-call/knowledge-flow-alpha.webm"
    type="video/webm"
  >
  <img
    class="knowledge-image"
    src="/swarrow-call/knowledge-flow-alpha.png"
    alt="文書やFAQをSwarrow ChatとSwarrow Callで共有する知識基盤のイメージ"
    width="1672"
    height="941"
    loading="lazy"
    decoding="async"
  >
</video>
```

```svelte
<div class="knowledge-copy" data-reveal>
  <p class="knowledge-en">Shared Knowledge</p>
  <h2 id="knowledge-title" class="knowledge-title">
    <span>1つの知識で、</span>
    <span>ホームページも電話も。</span>
  </h2>
  <p class="knowledge-lead">{sharedKnowledge.description}</p>
  <ul class="knowledge-flow">
    <li>
      <span class="knowledge-flow-kicker">Collect</span>
      <span>
        <strong>散らばる知識をまとめる</strong>
        <small>FAQ、手順書、業務データ、画像資料を1か所へ。</small>
      </span>
    </li>
    <li>
      <span class="knowledge-flow-kicker">Maintain</span>
      <span>
        <strong>一度の更新で案内をそろえる</strong>
        <small>制度変更や現場の気づきを共通知識へ反映。</small>
      </span>
    </li>
    <li>
      <span class="knowledge-flow-kicker">Serve</span>
      <span>
        <strong>ChatとCallの双方で使う</strong>
        <small>Webと電話で同じ根拠から住民へ案内。</small>
      </span>
    </li>
  </ul>
</div>
```

**Step 4: Remove the old Hero overlap from `.knowledge`**

In the desktop rule change:

```css
.knowledge {
  margin-top: 0;
  padding: clamp(4rem, 8vw, 7rem) clamp(1.2rem, 4vw, 3.5rem)
    clamp(3rem, 7vw, 6rem);
}
```

Keep the remaining background, positioning, curve, video, and responsive rules.

Add `#problems`, `#knowledge`, `#products`, `#chat`, `#call`, `#operations`, and `#support` to the existing `scroll-margin-top` selector. Missing IDs will become active in later tasks.

**Step 5: Run tests and checks**

```bash
bun --bun run test:seo
bun --bun run check
```

Expected: PASS.

**Step 6: Commit**

```bash
git add src/routes/+page.svelte tests/seo/build-output.test.ts
git commit -m "feat(lp): 共通知識基盤の統合価値を明確化"
```

---

### Task 7: 2製品の比較セクションを追加

**Purpose:** 詳細を縦に読む前に、Chat と Call の違い、個別導入、併用価値を同格のカードで比較できるようにする。

**Files:**

- Modify: `src/routes/+page.svelte`
- Modify: `tests/seo/build-output.test.ts`

**Step 1: Append the failing Product Overview contract**

```ts
describe("product overview", () => {
  test("shows two equally structured product choices", () => {
    expect(html).toContain('id="products"');
    expect(countMatches(html, /class="product-card\b/g)).toBe(2);
    expect(html).toContain("自治体ホームページAI窓口");
    expect(html).toContain("自治体AIコールセンター");
    expect(html).toContain('href="#chat"');
    expect(html).toContain('href="#call"');
    expect(html).toContain("単独でも、組み合わせても導入可能");
  });

  test("places comparison after knowledge and before details", () => {
    expect(html.indexOf('id="knowledge"')).toBeLessThan(
      html.indexOf('id="products"'),
    );
  });
});
```

**Step 2: Run the test to verify it fails**

```bash
bun --bun run test:seo
```

Expected: FAIL because `#products` and product cards are missing.

**Step 3: Import `products` and insert the section after Knowledge**

```svelte
<section id="products" class="products" aria-labelledby="products-title">
  <div class="products-inner">
    <div class="products-head" data-reveal>
      <p class="products-kicker">Products</p>
      <h2 id="products-title">問い合わせの入口に合わせて選べる2つの製品</h2>
      <p>
        ホームページから始めても、電話から始めても、両方を組み合わせても導入できます。
      </p>
    </div>

    <div class="products-grid">
      {#each products as product (product.id)}
        <article class="product-card product-card--{product.id}" data-reveal>
          <p class="product-category">{product.category}</p>
          <h3>{product.name}</h3>
          <p class="product-benefit">{product.benefit}</p>
          <ul>
            {#each product.useCases as useCase (useCase)}
              <li>{useCase}</li>
            {/each}
          </ul>
          <a href={product.href}>{product.name}を見る</a>
        </article>
      {/each}
    </div>

    <p class="products-integration" data-reveal>
      <strong>{sharedKnowledge.adoption}</strong>
      <span>併用時は、同じ知識基盤をホームページと電話で共有できます。</span>
    </p>
  </div>
</section>
```

**Step 4: Add Product Overview styles**

```css
.products {
  padding: clamp(4rem, 8vw, 7rem) clamp(1.2rem, 4vw, 3.5rem);
  background: var(--bg);
}
.products-inner {
  max-width: 1180px;
  margin: 0 auto;
}
.products-head {
  max-width: 760px;
}
.products-kicker,
.product-category {
  margin: 0;
  color: var(--sage-deep);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.1em;
}
.products-head h2 {
  margin: 0.5rem 0 0;
  color: var(--navy);
  font-size: clamp(1.6rem, 3.2vw, 2.5rem);
  line-height: 1.5;
}
.products-head > p:last-child {
  margin: 1rem 0 0;
  color: var(--ink-soft);
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1rem, 3vw, 2rem);
  margin-top: clamp(2rem, 5vw, 3.5rem);
}
.product-card {
  display: flex;
  flex-direction: column;
  min-height: 26rem;
  padding: clamp(1.5rem, 3vw, 2.2rem);
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--paper);
  box-shadow: 0 18px 44px rgba(9, 32, 69, 0.08);
}
.product-card h3 {
  margin: 0.55rem 0 0;
  color: var(--navy);
  font-size: clamp(1.5rem, 3vw, 2.2rem);
}
.product-benefit {
  margin: 1rem 0 0;
  color: var(--ink-soft);
}
.product-card ul {
  display: grid;
  gap: 0.5rem;
  margin: 1.2rem 0 1.5rem;
  padding-left: 1.2rem;
}
.product-card a {
  margin-top: auto;
  font-weight: 800;
  color: var(--navy);
}
.products-integration {
  display: grid;
  gap: 0.25rem;
  margin: 1.5rem 0 0;
  padding: 1.1rem 1.3rem;
  border-radius: 14px;
  background: var(--sage-light);
  color: var(--navy);
  text-align: center;
}
```

In the `max-width: 860px` media query:

```css
.products-grid {
  grid-template-columns: 1fr;
}
.product-card {
  min-height: 0;
}
```

**Step 5: Run tests and checks**

```bash
bun --bun run test:seo
bun --bun run check
```

Expected: PASS.

**Step 6: Browser checkpoint M1**

Run `bun --bun run dev` and inspect desktop plus a 390px mobile viewport. Confirm the two cards have equal heading hierarchy, CTA strength, and visual weight.

**Step 7: Commit**

```bash
git add src/routes/+page.svelte tests/seo/build-output.test.ts
git commit -m "feat(lp): Swarrow Chat と Call の比較導線を追加"
```

---

### Task 8: Swarrow Chat を独立製品として再構成

**Purpose:** 現在の `Swarrow Call のチャット UI` 表現を除去し、Web／LINE で自己解決を促す独立製品として説明する。

**Files:**

- Modify: `src/routes/+page.svelte`
- Modify: `tests/seo/build-output.test.ts`

**Step 1: Append the failing Chat contract**

```ts
describe("Swarrow Chat section", () => {
  test("describes Chat as an independent municipal product", () => {
    expect(html).toMatch(/id="chat"[\s\S]*?<h2[^>]*>[\s\S]*?Swarrow Chat/);
    expect(html).toContain("自治体ホームページAI窓口");
    expect(html).toContain("ホームページやLINE");
    expect(html).toContain("自己解決");
    expect(html).toContain('/swarrow-call/chat-ui.webm');
    expect(html).not.toContain("Swarrow Call のチャット UI");
  });
});
```

**Step 2: Run the test to verify it fails**

```bash
bun --bun run test:seo
```

Expected: FAIL on missing `#chat`, H2, and the old Call-specific copy.

**Step 3: Add the ID and replace the Chat copy**

Keep the current paper band, curve SVG, `chat-ui.webm`, WebP fallback, dimensions, and list layout. Change the band opening to:

```svelte
<div
  id="chat"
  class="feature-band feature-band--paper"
  aria-labelledby="chat-title"
>
```

Replace the video labels and copy with:

```svelte
<video
  class="chat-feature-video"
  poster="/swarrow-call/chat-ui.webp"
  muted
  loop
  playsinline
  preload="none"
  width="1280"
  height="720"
  aria-label="ホームページやLINEに設置できるSwarrow Chatの画面"
>
  <source src="/swarrow-call/chat-ui.webm" type="video/webm">
  <img
    class="chat-feature-image"
    src="/swarrow-call/chat-ui.webp"
    alt="ホームページやLINEに設置できるSwarrow Chatの画面"
    width="1672"
    height="941"
    loading="lazy"
    decoding="async"
  >
</video>
```

```svelte
<div class="chat-feature-copy">
  <p class="chat-feature-en">Municipal Web AI Desk</p>
  <h2 id="chat-title" class="chat-feature-title">
    <span>自治体ホームページAI窓口</span>
    <span>Swarrow Chat</span>
  </h2>
  <p class="chat-feature-lead">
    ホームページやLINEなど、住民が使い慣れた場所で定型的な質問へ回答します。必要な情報へ迷わずたどり着ける入口をつくり、電話をかける前の自己解決を支えます。
  </p>
  <ul class="chat-feature-list">
    <li>
      <strong>ホームページやLINEに設置</strong>
      <small>住民が普段利用するデジタル窓口から質問できます。</small>
    </li>
    <li>
      <strong>自治体の資料をもとに回答</strong>
      <small>FAQ、制度資料、手順書、業務データを案内に活かします。</small>
    </li>
    <li>
      <strong>回答から次の手続きへつなぐ</strong>
      <small>申請案内、予約、職員への連携など次の行動へ誘導します。</small>
    </li>
  </ul>
</div>
```

**Step 4: Run tests and checks**

```bash
bun --bun run test:seo
bun --bun run check
```

Expected: PASS.

**Step 5: Commit**

```bash
git add src/routes/+page.svelte tests/seo/build-output.test.ts
git commit -m "feat(lp): Swarrow Chat を独立製品として再構成"
```

---

### Task 9: Swarrow Call の電話業務価値を再構成

**Purpose:** 機能列挙ではなく、AI 受電、案内、取次、架電、一括発信によって職員が必要な電話へ集中できる変化を説明する。

**Files:**

- Modify: `src/routes/+page.svelte`
- Modify: `tests/seo/build-output.test.ts`

**Step 1: Append the failing Call contract**

```ts
describe("Swarrow Call section", () => {
  test("connects call capabilities to municipal work outcomes", () => {
    expect(html).toMatch(/id="call"[\s\S]*?<h2[^>]*>[\s\S]*?Swarrow Call/);
    expect(html).toContain("自治体AIコールセンター");
    for (const capability of [
      "AI受電",
      "案内",
      "取次",
      "タイマー架電",
      "一括発信",
    ]) {
      expect(html).toContain(capability);
    }
    expect(html).toContain('/swarrow-call/operator-call.webm');
  });
});
```

**Step 2: Run the test to verify it fails**

```bash
bun --bun run test:seo
```

Expected: FAIL on missing `#call`, H2, and `AI受電` wording.

**Step 3: Add the ID and replace the Call heading/copy**

Keep the existing mist band, curve, operator video, three capability videos, fallback images, and `{#each callCapabilities}`. Change the band opening to:

```svelte
<div
  id="call"
  class="feature-band feature-band--mist feature-band--last"
  aria-labelledby="call-title"
>
```

Replace `.call-feature-copy` with:

```svelte
<div class="call-feature-copy">
  <p class="call-feature-en">Municipal AI Call Center</p>
  <h2 id="call-title" class="call-feature-title">
    <span>自治体AIコールセンター</span>
    <span>Swarrow Call</span>
  </h2>
  <p class="call-feature-lead">
    AI受電で定型的な質問へ案内し、必要な案件だけを職員へ取り次ぎます。受ける電話だけでなく、リマインドや一括周知など自治体からの発信も支援します。
  </p>
  <ul class="call-feature-list">
    <li>
      <strong>AI受電で一次対応</strong>
      <small>FAQや手順書をもとに、住民からの電話へ案内します。</small>
    </li>
    <li>
      <strong>用件を整理して職員へ取次</strong>
      <small>内容や担当部署に応じ、必要な電話を職員へつなぎます。</small>
    </li>
    <li>
      <strong>架電業務も自動化</strong>
      <small>予約確認、督促、案内、周知などの発信を支援します。</small>
    </li>
  </ul>
</div>
```

Change each capability card heading from H4 to H3:

```svelte
<h3 class="call-feature-card-title">{capability.title}</h3>
```

Update `.call-feature-card-title` styling only if necessary; the class name remains unchanged.

**Step 4: Run tests and checks**

```bash
bun --bun run test:seo
bun --bun run check
```

Expected: PASS.

**Step 5: Commit**

```bash
git add src/routes/+page.svelte tests/seo/build-output.test.ts
git commit -m "feat(lp): Swarrow Call の電話業務価値を再構成"
```

---

### Task 10: Common Operations を製品詳細の後へ移動

**Purpose:** Tidy First として、No-Code Flow Editor の既存内容を変更せず、Chat と Call の詳細後へ移す。動画 binding、ready 制御、IntersectionObserver は保持する。

**Files:**

- Modify: `src/routes/+page.svelte`
- Modify: `tests/seo/build-output.test.ts`

**Step 1: Append the failing DOM-order contract**

```ts
describe("section order", () => {
  test("places common operations after both product details", () => {
    const chat = html.indexOf('id="chat"');
    const call = html.indexOf('id="call"');
    const operations = html.indexOf('id="operations"');

    expect(chat).toBeGreaterThan(-1);
    expect(call).toBeGreaterThan(chat);
    expect(operations).toBeGreaterThan(call);
    expect(pageSource).toContain('bind:this={workflowVideo}');
    expect(pageSource).toContain('/swarrow-call/workflow-editor-alpha.webm');
  });
});
```

The source assertions inspect Svelte source rather than build HTML. Extend the existing fixture with `pageSource`:

```ts
let pageSource = "";

beforeAll(async () => {
  [html, robots, sitemap, modalSource, pageSource] = await Promise.all([
    Bun.file("build/index.html").text(),
    Bun.file("build/robots.txt").text(),
    Bun.file("build/sitemap.xml").text(),
    Bun.file("src/lib/swarrow/ContactModal.svelte").text(),
    Bun.file("src/routes/+page.svelte").text(),
  ]);
});
```

**Step 2: Run the test to verify it fails**

```bash
bun --bun run test:seo
```

Expected: FAIL because Operations currently appears before Chat and has no ID.

**Step 3: Move the existing Workflow band after the Call band**

Move the complete existing `.workflow-inner` block without changing its copy, media, or binding. Remove `feature-band--last` from the Call band, then wrap the moved block as:

```svelte
<div
  id="operations"
  class="feature-band feature-band--paper feature-band--last"
  aria-labelledby="operations-title"
>
  <div class="section-curve-bg section-curve-bg--paper" aria-hidden="true">
    <svg
      viewBox="0 0 1440 1600"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M-80 330C80 128 266 88 498 136C726 184 812 188 1008 76C1214 -42 1378 24 1508 214V1600H-80Z"
      ></path>
    </svg>
  </div>
  <div class="workflow-inner">
    <div class="workflow-copy" data-reveal>
      <p class="workflow-en">No-Code Flow Editor</p>
      <h2 id="operations-title" class="workflow-title">
        <span>会話フローを、</span>
        <span>職員の手で更新。</span>
      </h2>
      <p class="workflow-lead">
        初期設定が済めば、職員自身で会話フローを更新し、対話シナリオを画面上で簡単に設計・編集できます。コードを書かずに分岐や案内文を見直せるため、住民からの問い合わせや制度変更に合わせて、窓口の運用をすばやく改善できます。
      </p>
      <ul class="workflow-list">
        <li>
          <strong>画面上で流れを組み替える</strong>
          <small>質問、回答、分岐、案内文を見ながら編集。</small>
        </li>
        <li>
          <strong>現場の気づきをすぐ反映</strong>
          <small>問い合わせの多い表現や案内不足を職員が更新。</small>
        </li>
        <li>
          <strong>小さな修正は職員が対応</strong>
          <small>日々の軽微な改善はノーコードで完結。</small>
        </li>
      </ul>
    </div>

    <figure class="workflow-media" data-reveal>
      <video
        class="workflow-video"
        poster="/swarrow-call/workflow-editor-alpha.png"
        muted
        loop
        playsinline
        preload="none"
        width="1280"
        height="720"
        bind:this={workflowVideo}
        class:ready={workflowVideoReady}
        aria-label="画面上で会話フローと対話シナリオを設計・編集するノーコード編集画面"
      >
        <source
          src="/swarrow-call/workflow-editor-alpha.webm"
          type="video/webm"
        >
        <img
          class="workflow-image"
          src="/swarrow-call/workflow-editor-alpha.png"
          alt="画面上で会話フローと対話シナリオを設計・編集するノーコード編集画面"
          width="1280"
          height="720"
          loading="lazy"
          decoding="async"
        >
      </video>
    </figure>
  </div>
</div>
```

Add `id="operations-title"` to the existing Workflow H2. Do not change its current words until Task 11.

**Step 4: Verify the source-level video contract and build order**

```bash
bun --bun run test:seo
bun --bun run check
```

Expected: PASS; `workflowVideo` binding and selectors remain present once each.

**Step 5: Commit**

```bash
git add src/routes/+page.svelte tests/seo/build-output.test.ts
git commit -m "refactor(lp): 共通運用セクションを製品詳細の後へ移す"
```

---

### Task 11: Common Operations の共通価値を明示

**Purpose:** 移動済みの No-Code Flow Editor を、Chat または Call 固有ではなく、両製品の知識と会話フローを継続改善する共通機能として説明する。

**Files:**

- Modify: `src/routes/+page.svelte`
- Modify: `tests/seo/build-output.test.ts`

**Step 1: Append the failing Common Operations contract**

```ts
describe("common operations", () => {
  test("describes one update workflow for both products", () => {
    expect(html).toMatch(/id="operations"[\s\S]*?両製品の案内を、職員の手で改善/);
    expect(html).toContain("Swarrow ChatとSwarrow Call");
    expect(html).toContain("一度の更新");
    expect(html).toContain('/swarrow-call/workflow-editor-alpha.webm');
  });
});
```

**Step 2: Run the test to verify it fails**

```bash
bun --bun run test:seo
```

Expected: FAIL because the moved block still has its old generic copy.

**Step 3: Replace only `.workflow-copy` and media labels**

```svelte
<div class="workflow-copy" data-reveal>
  <p class="workflow-en">Common Operations</p>
  <h2 id="operations-title" class="workflow-title">
    <span>両製品の案内を、</span>
    <span>職員の手で改善。</span>
  </h2>
  <p class="workflow-lead">
    Swarrow ChatとSwarrow Callは、共通の知識と会話フローを利用します。制度変更や現場の気づきを一度の更新で反映し、ホームページと電話の案内を継続的に整えられます。
  </p>
  <ul class="workflow-list">
    <li>
      <strong>画面上で流れを組み替える</strong>
      <small>質問、回答、分岐、案内文を見ながら編集。</small>
    </li>
    <li>
      <strong>一度の更新を両製品へ反映</strong>
      <small>Webと電話の案内内容を同じ根拠へそろえます。</small>
    </li>
    <li>
      <strong>現場の気づきをすぐ反映</strong>
      <small>問い合わせの多い表現や不足する案内を職員が改善。</small>
    </li>
  </ul>
</div>
```

Use the following labels on the existing workflow video and fallback image:

```svelte
aria-label="Swarrow ChatとSwarrow Callの会話フローを編集する画面"
```

```svelte
alt="Swarrow ChatとSwarrow Callの会話フローを編集する画面"
```

Do not change `bind:this={workflowVideo}`, `class:ready`, sources, poster, dimensions, or preload.

**Step 4: Run tests and checks**

```bash
bun --bun run test:seo
bun --bun run check
```

Expected: PASS.

**Step 5: Commit**

```bash
git add src/routes/+page.svelte tests/seo/build-output.test.ts
git commit -m "feat(lp): 両製品共通の運用改善として再構成"
```

---

### Task 12: Customer Success を2製品共通の導入支援へ変更

**Purpose:** `Swarrow Call` と企業向けの表現を除去し、Chat、Call、併用の導入準備から運用改善までを支援する共通サービスとして表示する。

**Files:**

- Modify: `src/lib/swarrow/content.ts`
- Modify: `src/routes/+page.svelte`
- Modify: `tests/seo/build-output.test.ts`

**Step 1: Append the failing Support contract**

```ts
describe("shared customer success", () => {
  test("supports Chat, Call, and combined adoption", () => {
    expect(html).toContain('id="support"');
    expect(html).toMatch(/id="support"[\s\S]*?Swarrow ChatとSwarrow Call/);
    expect(html).toMatch(/id="support"[\s\S]*?導入準備/);
    expect(html).toMatch(/id="support"[\s\S]*?初期構築/);
    expect(html).toMatch(/id="support"[\s\S]*?運用改善/);
    expect(html).not.toMatch(/id="support"[\s\S]*?貴社/);
  });
});
```

**Step 2: Run the test to verify it fails**

```bash
bun --bun run test:seo
```

Expected: FAIL because `#support` is missing and the body still says `Swarrow Call`／`貴社`／`チャットボット`.

**Step 3: Add the section ID and replace the common body**

```svelte
<section id="support" class="function" aria-labelledby="support-title">
```

```svelte
<h2 id="support-title" class="function-ja">カスタマーサクセス</h2>
```

```svelte
<p class="customer-success-body">
  Swarrow ChatとSwarrow Callは、導入して終わりのサービスではありません。単独導入でも併用でも、専任チームが知識基盤の初期構築から利用状況の確認、継続的な改善まで伴走します。
</p>
```

**Step 4: Replace only the first two `customerSuccessSteps` bodies in content**

```ts
{
  phase: "1",
  title: "導入準備",
  body: "対象部署と問い合わせ業務を整理し、Chat、Call、併用のどこから始めるかを専任チームが一緒に設計します。",
  video: "/swarrow-call/customer-success-step-1.webm",
  poster: "/swarrow-call/customer-success-step-1-poster.webp",
  alt: "カスタマーサクセスチームが導入準備の説明会と進行を支援するイメージ",
},
{
  phase: "2",
  title: "初期構築",
  body: "自治体の要件をヒアリングし、FAQ、手順書、会話フローなど両製品が利用する知識基盤を整えます。",
  video: "/swarrow-call/customer-success-step-2.webm",
  poster: "/swarrow-call/customer-success-step-2-poster.webp",
  alt: "カスタマーサクセスチームが初期構築の計画を整理するイメージ",
},
```

Keep phase 3 and all media paths unchanged.

**Step 5: Run tests and checks**

```bash
bun --bun run test:seo
bun --bun run check
```

Expected: PASS.

**Step 6: Commit**

```bash
git add src/lib/swarrow/content.ts src/routes/+page.svelte tests/seo/build-output.test.ts
git commit -m "feat(lp): 導入支援を2製品共通サービスへ統一"
```

---

### Task 13: ナビゲーション、News、問い合わせ CTA を再編

**Purpose:** 1ページの長さを補うアンカー導線を整え、News は製品理解後に置き、最終 CTA で Chat、Call、併用の相談を受け付ける。

**Files:**

- Modify: `src/lib/swarrow/content.ts`
- Modify: `src/routes/+page.svelte`
- Modify: `tests/seo/build-output.test.ts`

**Step 1: Append the failing navigation and conversion contract**

```ts
describe("navigation and conversion", () => {
  test("all in-page links point to rendered targets", () => {
    const ids = new Set(
      Array.from(html.matchAll(/\sid="([^"]+)"/g), (match) => match[1]),
    );
    const internalTargets = Array.from(
      html.matchAll(/href="#([^"]+)"/g),
      (match) => match[1],
    );

    for (const target of internalTargets) {
      expect(ids.has(target)).toBe(true);
    }
  });

  test("keeps the final page sequence and a two-product CTA", () => {
    const ids = [
      "problems",
      "knowledge",
      "products",
      "chat",
      "call",
      "operations",
      "support",
      "news",
      "contact",
    ];
    const positions = ids.map((id) => html.indexOf(`id="${id}"`));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    expect(html).toContain("Swarrow Chat・Swarrow Callの導入相談");
    expect(html).toContain("単独導入から併用まで");
  });
});
```

**Step 2: Run the test to verify it fails**

```bash
bun --bun run test:seo
```

Expected: FAIL because nav targets and CTA copy are not yet synchronized.

**Step 3: Replace `navItems` in `src/lib/swarrow/content.ts`**

```ts
export const navItems: NavItem[] = [
  { label: "製品", href: "#products" },
  { label: "Swarrow Chat", href: "#chat" },
  { label: "Swarrow Call", href: "#call" },
  { label: "導入支援", href: "#support" },
];
```

Keep `companyOverviewLink` for the Footer. Do not re-enable the case-study nav item.

**Step 4: Replace the final CTA copy**

```svelte
<section id="contact" class="cta" aria-labelledby="contact-title">
  <div class="cta-inner" data-reveal>
    <h2 id="contact-title" class="cta-title">
      <span>Swarrow Chat・Swarrow Callの導入相談</span>
      <span>単独導入から併用まで、ご相談ください。</span>
    </h2>
    <p class="cta-sub">
      現在の問い合わせ件数、対象部署、ホームページと電話の運用状況を伺い、始め方とデモをご案内します。
    </p>
    <button type="button" class="cta-btn" onclick={openContactModal}>
      導入相談・デモを依頼する<span class="ext">↗</span>
    </button>
  </div>
</section>
```

Keep the existing News section in its current position after Support and before Contact. Historical News titles may retain `Swarrow Call` if that was the event name; do not rewrite history without confirmation.

**Step 5: Check responsive navigation**

The desktop Header continues to render `navItems`. At `max-width: 860px` the Header nav remains hidden, so verify that the Hero secondary CTA to `#products` remains visible and keyboard reachable.

**Step 6: Run tests and checks**

```bash
bun --bun run test:seo
bun --bun run check
```

Expected: PASS.

**Step 7: Browser checkpoint M2**

Run `bun --bun run dev` and verify:

- Desktop Header anchors stop below the sticky header.
- Mobile Hero retains contact and `#products` actions even though Header nav is hidden.
- Keyboard focus and ContactModal Escape close still work.
- Chat → Call → Operations → Support is both DOM order and visual order.

**Step 8: Commit**

```bash
git add src/lib/swarrow/content.ts src/routes/+page.svelte tests/seo/build-output.test.ts
git commit -m "feat(lp): 製品導線と問い合わせ CTA を再編"
```

---

### Task 14: 2製品の SEO 情報モデルを定義

**Purpose:** 単一 canonical 上で Organization、WebSite、2つの Service を表現する source of truth を content と unit test に定義する。

**Files:**

- Modify: `src/lib/swarrow/content.ts`
- Modify: `tests/seo/content.test.ts`

**Step 1: Append the failing metadata and JSON-LD model tests**

Add these imports: `jsonLd`, `pageDescription`, and `pageTitle`.

```ts
describe("two-product search model", () => {
  test("uses one accurate title and description", () => {
    expect(pageTitle).toBe(
      "Swarrow｜自治体ホームページAI窓口・自治体AIコールセンター",
    );
    for (const phrase of [
      "Swarrow Chat",
      "Swarrow Call",
      "知識基盤",
      "ホームページ",
      "電話",
    ]) {
      expect(pageDescription).toContain(phrase);
    }
    expect(pageDescription).not.toMatch(/半減|70%削減|100%/);
  });

  test("describes the site and two visible services in one graph", () => {
    const graph = jsonLd["@graph"] as readonly Record<string, unknown>[];
    expect(
      graph.filter((item) => item["@type"] === "Organization"),
    ).toHaveLength(1);
    expect(graph.filter((item) => item["@type"] === "WebSite")).toHaveLength(
      1,
    );

    const services = graph.filter((item) => item["@type"] === "Service");
    expect(services).toHaveLength(2);
    expect(services.map((item) => item["@id"])).toEqual([
      "https://swarrow.com/#swarrow-chat",
      "https://swarrow.com/#swarrow-call",
    ]);
    expect(services.map((item) => item.name)).toEqual([
      "Swarrow Chat",
      "Swarrow Call",
    ]);
    expect(
      services.every(
        (item) =>
          (item.provider as Record<string, unknown>)["@id"] ===
          "https://swarrow.com/#organization",
      ),
    ).toBe(true);
  });
});
```

**Step 2: Run the model test to verify it fails**

```bash
bun test tests/seo/content.test.ts
```

Expected: FAIL on the old title and single-Service JSON-LD.

**Step 3: Replace metadata and JSON-LD in `content.ts`**

```ts
export const pageTitle =
  "Swarrow｜自治体ホームページAI窓口・自治体AIコールセンター";
export const pageDescription =
  "自治体ホームページAI窓口「Swarrow Chat」と自治体AIコールセンター「Swarrow Call」。FAQや手順書を1つの知識基盤で管理し、ホームページと電話の問い合わせ対応を支援します。";
```

Replace the current single Service object with:

```ts
const organizationId = `${site}/#organization`;

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "株式会社Vecta",
      url: "https://www.vecta.co.jp/",
    },
    {
      "@type": "WebSite",
      "@id": `${site}/#website`,
      url: `${site}/`,
      name: siteName,
      description: pageDescription,
      publisher: { "@id": organizationId },
    },
    ...products.map((product) => ({
      "@type": "Service",
      "@id": `${site}/#swarrow-${product.id}`,
      name: product.name,
      serviceType: product.category,
      category: product.category,
      description: product.benefit,
      url: `${site}/${product.href}`,
      provider: { "@id": organizationId },
      audience: {
        "@type": "Audience",
        audienceType: "自治体",
      },
      areaServed: "日本",
    })),
  ],
} as const;
```

**Step 4: Run and commit**

```bash
bun test tests/seo/content.test.ts
bun --bun run check
git add src/lib/swarrow/content.ts tests/seo/content.test.ts
git commit -m "feat(seo): 2製品の検索情報モデルを定義"
```

### Task 15: build HTML の最終 SEO 契約を固定

**Purpose:** 可視コンテンツ、metadata、social metadata、JSON-LD、既存 media の整合性を adapter-static の最終 HTML で検証する。

**Files:**

- Modify: `src/routes/+page.svelte`
- Modify: `tests/seo/build-output.test.ts`

**Step 1: Add the failing build-output tests**

At the top of the test, add:

```ts
import { existsSync } from "node:fs";
```

Append:

```ts
describe("final search contract", () => {
  const metaContent = (kind: "name" | "property", key: string) =>
    html.match(
      new RegExp(`<meta ${kind}="${key}" content="([^"]*)"\\s*\\/?>`),
    )?.[1];

  test("keeps visible metadata and social metadata consistent", () => {
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    const description = metaContent("name", "description");
    expect(title).toBe(
      "Swarrow｜自治体ホームページAI窓口・自治体AIコールセンター",
    );
    expect(description).toContain("Swarrow Chat");
    expect(description).toContain("Swarrow Call");
    expect(metaContent("property", "og:site_name")).toBe("Swarrow");
    expect(metaContent("property", "og:title")).toBe(title);
    expect(metaContent("name", "twitter:title")).toBe(title);
    expect(metaContent("property", "og:description")).toBe(description);
    expect(metaContent("name", "twitter:description")).toBe(description);
    expect(metaContent("property", "og:url")).toBe("https://swarrow.com/");
  });

  test("renders one H1 and both services in visible body content", () => {
    const body = html.split("<body")[1] ?? "";
    expect(countMatches(body, /<h1\b/g)).toBe(1);
    expect(body).toContain("Swarrow Chat");
    expect(body).toContain("Swarrow Call");
    expect(body).not.toMatch(/みどり野市|うみかぜ町|あさひ野市|こもれび市/);
    expect(body).not.toMatch(/問い合わせ全体を70%削減|負担を半減/);
  });

  test("publishes parseable structured data matching visible services", () => {
    const match = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    );
    expect(match).not.toBeNull();
    const data = JSON.parse(match?.[1] ?? "{}");
    const graph = data["@graph"] as Array<Record<string, unknown>>;
    const services = graph.filter((item) => item["@type"] === "Service");
    expect(graph.some((item) => item["@type"] === "WebSite")).toBe(true);
    expect(services).toHaveLength(2);
    for (const service of services) {
      expect(body).toContain(String(service.name));
      expect(body).toContain(String(service.serviceType));
    }
  });

  test("keeps every referenced Swarrow media file present", () => {
    const media = new Set(
      Array.from(
        html.matchAll(/(?:src|poster)="(\/swarrow-call\/[^"]+)"/g),
        (match) => match[1],
      ),
    );
    expect(media.size).toBeGreaterThan(0);
    for (const path of media) {
      expect(existsSync(`static${path}`)).toBe(true);
    }
  });
});
```

**Step 2: Run to verify failure**

```bash
bun --bun run test:seo
```

Expected: FAIL until root head uses the final metadata consistently.

**Step 3: Confirm the root head uses the shared exports**

The final head must be exactly:

```svelte
<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription}>
  <meta name="theme-color" content="#f4f4f6">
  <link rel="canonical" href={`${site}/`}>
  <meta name="robots" content="index,follow">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content={siteName}>
  <meta property="og:title" content={pageTitle}>
  <meta property="og:description" content={pageDescription}>
  <meta property="og:url" content={`${site}/`}>

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content={pageTitle}>
  <meta name="twitter:description" content={pageDescription}>

  {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>
```

**Step 4: Run and commit**

```bash
bun --bun run test:seo
bun --bun run check
git add src/routes/+page.svelte tests/seo/build-output.test.ts
git commit -m "test(seo): 公開 HTML の2製品検索契約を固定"
```

---

### Task 16: リポジトリ説明と Search Console 運用を同期

**Purpose:** 人向け README、AI 向け AGENTS、公開後の SEO 運用手順を2製品構成と検索検証方針へ揃える。

**Files:**

- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `docs/seo-operations.md`

**Step 1: Update the README identity and directory notes**

Replace the opening with:

```markdown
# Swarrow

自治体ホームページAI窓口「Swarrow Chat」と自治体AIコールセンター
「Swarrow Call」の統合ランディングページ。SvelteKit + Bun で管理する。

両製品は個別導入でき、併用時は同じ知識基盤をホームページと電話で共有する。
```

Update the directory list to use `src/lib/swarrow/` and describe
`src/routes/+page.svelte` as the single-page two-product site. Keep setup, run,
download API, and existing commands unchanged. Add:

```markdown
bun --bun run test:seo # metadata、canonical、robots、sitemap、JSON-LD を検証
```

**Step 2: Replace `AGENTS.md` with an English, product-accurate version**

```markdown
# Swarrow

Landing page for two municipal AI products: the website AI desk "Swarrow Chat"
and the AI call center "Swarrow Call". The site uses SvelteKit and Bun. Runtime,
formatting, TypeScript, spelling, and git-hook rules live under `.claude/rules/`.
Read the applicable rule file before editing matching files.

## Project conventions

- Keep the integrated single-page site in `src/routes/+page.svelte`.
- Present Swarrow Chat and Swarrow Call as equal, independently adoptable products.
- Explain the shared knowledge base before either product's detailed section.
- Keep shared components and utilities under `src/lib/swarrow/` and import them
  through the `$lib` alias.
- Reuse the existing media under `static/swarrow-call/`; do not rename those
  public URLs during the two-product homepage change.
- Do not publish unsupported performance claims or the fictional case-study data.
- Do not commit credentials, tokens, private keys, production-equivalent API
  endpoints, or sensitive sample payloads. Use placeholders for environment values.
- Bun is the only package manager and script runner. Do not add npm, pnpm, Yarn,
  ESLint, or Prettier configuration.
- The deployment target is static prerendering through adapter-static
  (`vite.config.ts`). Revisit the adapter design before adding SSR or server-only APIs.
- Before reporting implementation complete, run `bun --bun run test:seo`,
  `bun --bun run check`, and `bun --bun run build`.

## Download request API

The contact form, D1 persistence, and email delivery are handled by
`swarrow.com-backend` at `POST https://api.swarrow.com/download-requests`.
The frontend uses `PUBLIC_DOWNLOAD_REQUEST_API_URL` and a Cloudflare Turnstile
site key as public environment variables. See `docs/download-request-api.md` for
integration details and `docs/download-link.md` for download-link operations.

## SEO operations

Local tests validate search-facing HTML contracts, not ranking. Follow
`docs/seo-operations.md` for pre-deploy baselines, URL Inspection, sitemap checks,
and 7-day/28-day Search Console measurement. Never store Search Console OAuth
credentials or exports in the repository.

## Figma

Original design: https://www.figma.com/design/2eT31sLxtnkjkDpM1l1CMI/SwarrowCall

## Codex compatibility

`CLAUDE.md` is a symbolic link to this file. Edit `AGENTS.md` and do not replace
the symlink with a regular file.
```

**Step 3: Extend `docs/seo-operations.md` with the exact validation lifecycle**

Add `bun --bun run test:seo` to the deploy checks and add:

```markdown
## Search Console 変更前ベースライン

公開前に root URL `https://swarrow.com/` へ絞り、直近28日と前28日の
`clicks`、`impressions`、`CTR`、`average position` を記録する。
平均掲載順位は補助指標とし、impressions と clicks の傾向を優先する。

対象クエリ群:

- Brand: `Swarrow`、`Swarrow Chat`、`Swarrow Call`
- Chat: `自治体 AI チャットボット`、`自治体 ホームページ AI`、
  `自治体 AI 窓口`
- Call: `自治体 AI コールセンター`、`自治体 AI 電話対応`、
  `AI 受電 自治体`
- Integrated: `自治体 問い合わせ 自動化`、`住民問い合わせ 自動化`、
  `電話 チャット 一元化`

Performance report の Query filter と Page filter を使う。低頻度 query は
privacy 保護のため省略される場合があるので、0件を実装失敗とは扱わない。

## 公開直後

1. root、`robots.txt`、`sitemap.xml` が200系で取得できることを確認する。
2. URL Inspection の「公開 URL をテスト」で Page fetch、Crawl allowed、
   Indexing allowed を確認する。
3. user canonical が `https://swarrow.com/` であることを確認する。
4. Schema Markup Validator で `Organization`、`WebSite`、2つの `Service` を
   確認する。
5. Rich Results Test は Google 対応型だけを確認する。`Service` は rich result
   対応型ではないため、検出されないことを失敗にしない。
6. root URL の index 登録を1回だけリクエストする。繰り返し要求しない。
7. sitemap がすでに Success なら、内容が変わらない今回の変更では再送信を
   必須にしない。

## 公開7日後

- indexed version の last crawl が公開後へ更新されたか確認する。
- Google canonical と user canonical が root URL で一致するか確認する。
- Google が取得した HTML に新しい title と2製品名が反映されたか確認する。
- sitemap の Status が Success で、root URL が index 対象か確認する。

## 公開28日後

- 変更後28日と変更前28日を、同じ root URL・query 群で比較する。
- `impressions`、`clicks`、`CTR` の変化を記録する。
- `average position` は検索意図や競合で変動するため補助指標として扱う。
- impressions が増え CTR が下がった場合は title、description、H1 と query の
  一致を見直す。
- `site:swarrow.com` は補助確認に留め、Search Console を判断の正とする。

Search Console API は OAuth と外部状態を必要とし、URL Inspection API も
Google index 内の版だけを返すため、今回の CI には組み込まない。
```

Keep the existing Cloudflare/DNS and Search Console ownership steps. Add direct
links to the official Google documentation:

```markdown
## 公式リファレンス

- [URL Inspection API](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect)
- [サイトマップの作成と送信](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [再クロールを Google にリクエストする](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
- [構造化データに関する一般的なガイドライン](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Search Console Insights の検索パフォーマンス](https://support.google.com/webmasters/answer/17010961?hl=ja)
```

**Step 4: Verify documentation**

```bash
bunx cspell --no-progress README.md AGENTS.md docs/seo-operations.md
git diff --check
bun --bun run check
```

Expected: PASS. If cspell fails, fix an actual typo first. Do not disable cspell or
expand the task scope without reviewing the reported term.

**Step 5: Commit**

```bash
git add README.md AGENTS.md docs/seo-operations.md
git commit -m "docs(seo): 2製品サイトと検索検証手順を同期"
```

---

## Final Verification

Run from the repository root:

```bash
git diff --check
bun --bun run test
bun --bun run test:seo
bun --bun run check
bun --bun run build
```

Then run `bun --bun run preview` and verify desktop, 390px mobile, keyboard,
ContactModal, video fallback, and `prefers-reduced-motion: reduce`.

Final source checks:

```bash
rg -n '\$lib/swarrow-call|Swarrow Call のチャット UI|Swarrow Call 基盤|貴社' src README.md AGENTS.md
rg -n '半減|70%削減|どの自治体でも' src/routes src/lib/swarrow
git status --short
```

Expected:

- The first `rg` has no stale shared-brand or organization wording. Historical
  News text may still contain `Swarrow Call` and is not an error.
- The second `rg` has no unsupported public claim.
- Only intentional implementation, test, documentation, and approved plan files
  are changed.

Do not treat rank, immediate indexing, or rich-result display as a release-blocking
test. Record the Search Console baseline before deploy, then execute the documented
post-deploy checks at publish, 7 days, and 28 days.
