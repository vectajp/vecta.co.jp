# デジタル庁会見ダイジェスト記事自動生成 実装計画

**Goal:** デジタル庁 YouTube チャンネルの新着記者会見動画を、ローカル起動の Claude Code スキルで用語解説付き要約記事に変換し、既存「ニュース」セクションへの追加 PR を自動作成する。

**Architecture:** 決定的処理(RSS 検知・字幕取得・整形)は Bun TypeScript スクリプト `scripts/digest/` に分離して bun test で保証し、言語生成(記事整形・用語解説)のみ Claude Code スキル `.claude/skills/digest/` が担う。記事は既存 `src/lib/articles/` registry の通常記事として追加され、本文だけ Markdown + `MarkdownBody.svelte`(marked レンダリング)で描画する。一覧・記事ページ・sitemap は registry 駆動の既存機構が自動で拾うため、サイト側の新ルートは不要。

**Tech Stack:** Bun 1.3.14 / SvelteKit 2.69 + Svelte 5.56 (runes) / adapter-static / Biome / bun:test / marked 18.0.6(新規追加)/ yt-dlp(ローカル CLI、動作確認版 2026.01.29)/ gh CLI

**Design Document:** https://github.com/vectajp/vecta.co.jp/issues/42(注: Issue 記載の「専用 /digest/ セクション」はユーザー指示により「既存ニュースへの統合」へ変更済み。Issue 本文は要更新)

**Related Issue:** https://github.com/vectajp/vecta.co.jp/issues/42

**Branch:** `feature/GH-42`

**Recommended Execution:** Loop (HITL) — 10 タスク・中程度の複雑さ。ネットワーク依存の検証(Task 7/10)で介入ポイントがあるため。

## 前提と既知の制約 (Caveats)

- ブランチ `feature/GH-42` の作成は実行ハーネス(worktree-setup / executing-plans)が Task 1 開始前に行う(タスク内にブランチ作成ステップはない)
- `marked.parse(source, { async: false })` の string 返却はレビューで型定義の実物を取得して確認済み(確信度 95%)
- `--video` モードの publishedAt は `upload_date`(日付のみ)+ `T00:00:00+09:00` 固定のため、RSS 経由の値と時刻が一致しない(既知の許容差)
- `scripts/digest/*.ts` は svelte-check の型検査対象外(`.svelte-kit/tsconfig.json` の include は src/ 系のみ)。Biome lint + bun test で担保する
- クローズ(未マージ)された PR の動画は次回実行で再生成される(既知挙動として SKILL.md に明記)
- RSS フィードは最新15件のみ保持。長期間未実行時の取りこぼしは `--video` で個別処理
- heroImage は閣僚等の肖像を含む YouTube サムネイル(i.ytimg.com)ではなく、全ダイジェスト記事共通の固定 SVG(`/article/digest-press-conference.svg`)を使う(肖像権・パブリシティ権・政治的中立性への配慮。2026-07-13 追加変更)
- 記事は「中立的な要約」から「要約 + `## Vecta の視点`(自社の事業ドメインに紐づく考察)」へ方針転換した(ユーザー指示、2026-07-13)。要約部分・用語解説・タイトルには引き続き政治的中立性のガードレール(特定政党・大臣個人への賛否を書かない)を適用し、考察は技術・社会実装の観点に限定する
- 生成 Markdown はサニタイズなしで `{@html}` 描画する。コンテンツは自己生成 + PR 人間レビュー済みのため信頼する(明示的決定)

## 制約(設計より継承)

| 区分 | 内容 |
| --- | --- |
| Never | PR 人間レビューなしの自動公開 / Anthropic API キー必須の構成 / `git add .` や `git add .claude` の実行 |
| Always | 記事に出典 + AI 生成免責セクション / `bun run check` 通過後に PR / 1実行 = 1 PR / 記者会見動画のみ対象 |

---

### Task 1: registry テストを記事増加に耐える検証へ再構成

**Files:**

- Modify: `src/lib/articles/registry.test.ts`

構造準備(Tidy First)。現行テストは slug 配列の完全一致と `heroImage` の `/^\//` を検証しており、記事が自動追加されるたびに壊れる。挙動を保ったまま「包含 + 一意性」検証へ書き換える。

**Step 1: テストを書き換える**

`src/lib/articles/registry.test.ts` 全体を以下に置き換える:

```ts
import { describe, expect, test } from 'bun:test'
import { articleRedirects, articles, getArticleBySlug } from './registry'

describe('article registry', () => {
  test('contains the founding article slugs', () => {
    const slugs = articles.map((article) => article.slug)
    expect(slugs).toContain('about-gdrant')
    expect(slugs).toContain('vecta-launch-story')
  })

  test('keeps slugs unique', () => {
    const slugs = articles.map((article) => article.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  test('sorts articles newest first', () => {
    const timestamps = articles.map((article) => article.publishedAt.getTime())
    expect(timestamps).toEqual([...timestamps].sort((a, b) => b - a))
  })

  test('keeps required metadata available', () => {
    for (const article of articles) {
      expect(article.title.length).toBeGreaterThan(0)
      expect(article.description.length).toBeGreaterThan(0)
      expect(article.heroImage).toMatch(/^(\/|https:\/\/)/)
      expect(getArticleBySlug(article.slug)?.slug).toBe(article.slug)
    }
  })

  test('keeps merged article URLs redirected to the canonical article', () => {
    expect(articleRedirects['homepage-launch']).toBe('vecta-launch-story')
  })
})
```

**Step 2: テスト実行(挙動保存の確認)**

Run: `bun test src/lib/articles/registry.test.ts`
Expected: PASS(既存データのまま全 green。テスト再構成のため「失敗するテスト」ステップは適用外 — 挙動保存が検証条件)

**Step 3: コミット**

```bash
git add src/lib/articles/registry.test.ts
git commit -m "test(article): 記事追加に耐えるレジストリ検証へ再構成する"
```

---

### Task 2: ArticleMeta に videoId を追加

**Files:**

- Modify: `src/lib/articles/types.ts`
- Test: `src/lib/articles/registry.test.ts`

動画由来記事の重複生成防止の照合キー。オプショナル型追加のため bun test 単体では fail-first にならない(Bun は型を検査しない)。型の正しさは svelte-check(`bun run check`)で担保する — TDD 適用外の理由として明記。

**Step 1: 一意性テストを追加**

`registry.test.ts` の describe 内に追加:

```ts
  test('keeps videoId unique across video-based articles', () => {
    const videoIds = articles
      .map((article) => article.videoId)
      .filter((id): id is string => Boolean(id))
    expect(new Set(videoIds).size).toBe(videoIds.length)
  })
```

**Step 2: 型を追加**

`src/lib/articles/types.ts` の `ArticleMeta` に追加(`heroImage: string` の後):

```ts
  /** YouTube 動画由来の記事で重複生成防止の照合キーに使う動画 ID */
  videoId?: string
```

**Step 3: 検証**

Run: `bun test src/lib/articles/registry.test.ts && bun run check`
Expected: PASS(型エラーなし)

**Step 4: コミット**

```bash
git add src/lib/articles/types.ts src/lib/articles/registry.test.ts
git commit -m "feat(article): ArticleMeta に videoId を追加する"
```

---

### Task 3: marked 導入と Markdown 本文レンダラー

**Files:**

- Modify: `package.json`(marked 18.0.6 を exact で追加)
- Create: `src/lib/articles/markdown.ts`
- Create: `src/lib/articles/markdown.test.ts`
- Create: `src/lib/articles/MarkdownBody.svelte`

`MarkdownBody.svelte` の単体テストは作らない(リポジトリに Svelte コンポーネントテストの前例・DOM テスト基盤がないため)。svelte-check と Task 10 の E2E で担保する。

**Step 1: 依存追加**

Run: `bun add -d --exact marked@18.0.6`
Expected: package.json の devDependencies に `"marked": "18.0.6"`

**Step 2: 失敗するテストを書く**

`src/lib/articles/markdown.test.ts`:

```ts
import { describe, expect, test } from 'bun:test'
import { renderMarkdown } from './markdown'

describe('renderMarkdown', () => {
  test('renders headings and paragraphs', () => {
    const html = renderMarkdown('## 見出し\n\n本文です。')
    expect(html).toContain('<h2>見出し</h2>')
    expect(html).toContain('<p>本文です。</p>')
  })

  test('renders lists', () => {
    const html = renderMarkdown('- 項目1\n- 項目2')
    expect(html).toContain('<ul>')
    expect(html).toContain('<li>項目1</li>')
  })

  test('renders links', () => {
    const html = renderMarkdown('[デジタル庁](https://www.digital.go.jp/)')
    expect(html).toContain('<a href="https://www.digital.go.jp/">デジタル庁</a>')
  })
})
```

Run: `bun test src/lib/articles/markdown.test.ts`
Expected: FAIL("Cannot find module './markdown'")

**Step 3: 実装**

`src/lib/articles/markdown.ts`:

```ts
import { marked } from 'marked'

export const renderMarkdown = (source: string): string =>
  marked.parse(source, { async: false, gfm: true })
```

`src/lib/articles/MarkdownBody.svelte`:

```svelte
<script lang="ts">
  import { renderMarkdown } from './markdown'

  type Props = {
    source: string
  }

  let { source }: Props = $props()

  const html = $derived(renderMarkdown(source))
</script>

<article class="article-body">
  {@html html}
</article>
```

`class="article-body"` により `ArticleLayout.svelte` の既存 `:global(.article-body h2/h3/p/ul/ol/li/a)` タイポグラフィがそのまま適用される。

**Step 4: 検証**

Run: `bun test src/lib/articles/markdown.test.ts && bun run check`
Expected: PASS

**Step 5: コミット**

```bash
git add package.json bun.lock src/lib/articles/markdown.ts src/lib/articles/markdown.test.ts src/lib/articles/MarkdownBody.svelte
git commit -m "feat(article): Markdown 本文レンダラーを追加する"
```

---

### Task 4: RSS フィード解析と対象動画抽出

**Files:**

- Create: `scripts/digest/lib.ts`
- Create: `scripts/digest/lib.test.ts`
- Create: `scripts/digest/fixtures/feed.xml`

**Step 1: fixture と失敗するテストを書く**

`scripts/digest/fixtures/feed.xml` — 実フィード(2026-07-12 取得)の抜粋を保存する。`<feed>` ルート要素と `<entry>` 2件(videoId: `sVduWLXdk7U` / `ezYtIvXKh68`、タイトルはいずれも「松本大臣記者会見(...)」、`<published>` と `<media:description>` を含む実データ)。実装時に `curl -s "https://www.youtube.com/feeds/videos.xml?channel_id=UCKmJk25wcPwCecf7nV9HwCw"` の出力から先頭2エントリを切り出して作成する。**実データが source of truth**: 切り出した実データと下記テスト期待値(括弧の全半角・改行など)が異なる場合はテスト期待値を実データに合わせる。

`scripts/digest/lib.test.ts`:

```ts
import { describe, expect, test } from 'bun:test'
import { isPressConference, parseFeed, parseVideoId } from './lib'

const feedXml = await Bun.file(
  new URL('./fixtures/feed.xml', import.meta.url),
).text()

describe('parseFeed', () => {
  test('extracts video entries from the channel feed', () => {
    const entries = parseFeed(feedXml)
    expect(entries.length).toBe(2)
    expect(entries[0]).toEqual({
      videoId: 'sVduWLXdk7U',
      title: '松本大臣記者会見(令和8年7月10日)',
      publishedAt: '2026-07-10T02:05:39+00:00',
      description:
        '若手国家公務員のワークショップ開催/ガバメントAI 源内の国産クラウド上での国産基盤モデルの試用開始',
    })
  })
})

describe('isPressConference', () => {
  test('accepts press conference titles', () => {
    expect(isPressConference('松本大臣記者会見(令和8年7月10日)')).toBe(true)
  })

  test('rejects other videos', () => {
    expect(isPressConference('マイナポータル紹介動画')).toBe(false)
  })
})

describe('parseVideoId', () => {
  test('accepts watch URLs, short URLs, and bare ids', () => {
    expect(parseVideoId('https://www.youtube.com/watch?v=sVduWLXdk7U')).toBe(
      'sVduWLXdk7U',
    )
    expect(parseVideoId('https://youtu.be/sVduWLXdk7U')).toBe('sVduWLXdk7U')
    expect(parseVideoId('sVduWLXdk7U')).toBe('sVduWLXdk7U')
  })

  test('returns undefined for invalid input', () => {
    // 注: 11文字ちょうどの英数字はすべて有効 ID として扱われる('not-a-video' は11文字なので不正入力の例に使えない)
    expect(parseVideoId('not a video')).toBeUndefined()
    expect(parseVideoId('https://example.com/')).toBeUndefined()
  })
})
```

Run: `bun test scripts/digest/lib.test.ts`
Expected: FAIL("Cannot find module './lib'")

**Step 2: 実装**

`scripts/digest/lib.ts`:

```ts
export type VideoEntry = {
  videoId: string
  title: string
  publishedAt: string
  description: string
}

const pick = (block: string, pattern: RegExp) =>
  block.match(pattern)?.[1]?.trim() ?? ''

export const parseFeed = (xml: string): VideoEntry[] =>
  [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, block]) => ({
    videoId: pick(block, /<yt:videoId>([^<]*)<\/yt:videoId>/),
    title: pick(block, /<title>([^<]*)<\/title>/),
    publishedAt: pick(block, /<published>([^<]*)<\/published>/),
    description: pick(
      block,
      /<media:description>([\s\S]*?)<\/media:description>/,
    ),
  }))

export const isPressConference = (title: string): boolean =>
  title.includes('記者会見')

const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/

export const parseVideoId = (input: string): string | undefined => {
  if (VIDEO_ID_PATTERN.test(input)) {
    return input
  }
  let url: URL
  try {
    url = new URL(input)
  } catch {
    return undefined
  }
  const fromQuery = url.searchParams.get('v')
  if (fromQuery && VIDEO_ID_PATTERN.test(fromQuery)) {
    return fromQuery
  }
  const lastSegment = url.pathname.split('/').filter(Boolean).at(-1)
  if (lastSegment && VIDEO_ID_PATTERN.test(lastSegment)) {
    return lastSegment
  }
  return undefined
}
```

**Step 3: 検証**

Run: `bun test scripts/digest/lib.test.ts`
Expected: PASS

**Step 4: コミット**

```bash
git add scripts/digest/lib.ts scripts/digest/lib.test.ts scripts/digest/fixtures/feed.xml
git commit -m "feat(digest): RSS フィード解析と対象動画抽出を追加する"
```

---

### Task 5: 字幕 json3 のテキスト整形

**Files:**

- Modify: `scripts/digest/lib.ts`
- Modify: `scripts/digest/lib.test.ts`

json3 fixture はファイルではなくテスト内の TS インライン定数にする(Biome の JSON 整形対象を増やさないため)。

**Step 1: 失敗するテストを追加**

`lib.test.ts` に追加:

```ts
describe('json3ToTranscript', () => {
  test('joins segment texts and drops newline-only segments', () => {
    const captions = {
      events: [
        { segs: [{ utf8: 'はいおはようございます' }, { utf8: '\n' }] },
        {},
        { segs: [{ utf8: 'えっと一昨日の' }, { utf8: '7月8日にですね' }] },
      ],
    }
    expect(json3ToTranscript(captions)).toBe(
      'はいおはようございますえっと一昨日の7月8日にですね',
    )
  })

  test('returns empty string for empty captions', () => {
    expect(json3ToTranscript({})).toBe('')
  })
})
```

(import 行に `json3ToTranscript` を追加)

Run: `bun test scripts/digest/lib.test.ts`
Expected: FAIL(json3ToTranscript is not exported)

**Step 2: 実装**

`lib.ts` に追加:

```ts
type Json3Segment = { utf8?: string }
type Json3Event = { segs?: Json3Segment[] }
export type Json3Captions = { events?: Json3Event[] }

export const json3ToTranscript = (captions: Json3Captions): string =>
  (captions.events ?? [])
    .flatMap((event) => event.segs ?? [])
    .map((seg) => seg.utf8 ?? '')
    .filter((text) => text !== '\n')
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
```

**Step 3: 検証**

Run: `bun test scripts/digest/lib.test.ts`
Expected: PASS

**Step 4: コミット**

```bash
git add scripts/digest/lib.ts scripts/digest/lib.test.ts
git commit -m "feat(digest): 字幕 json3 をテキストへ整形する処理を追加する"
```

---

### Task 6: 処理済み動画の除外判定

**Files:**

- Modify: `scripts/digest/lib.ts`
- Modify: `scripts/digest/lib.test.ts`

**Step 1: 失敗するテストを追加**

(`lib.test.ts` の import 行に `extractVideoIdTrailers` と `selectUnprocessed` を追加すること)

```ts
describe('extractVideoIdTrailers', () => {
  test('extracts Video-ID trailer lines from PR bodies', () => {
    const body = '## 概要\n記事を追加\n\nVideo-ID: sVduWLXdk7U\nVideo-ID: ezYtIvXKh68\n'
    expect(extractVideoIdTrailers(body)).toEqual(['sVduWLXdk7U', 'ezYtIvXKh68'])
  })

  test('handles CRLF bodies edited via the GitHub web UI', () => {
    const body = 'Video-ID: sVduWLXdk7U\r\nVideo-ID: ezYtIvXKh68\r\n'
    expect(extractVideoIdTrailers(body)).toEqual(['sVduWLXdk7U', 'ezYtIvXKh68'])
  })

  test('ignores malformed lines', () => {
    expect(extractVideoIdTrailers('Video-ID: short\nVideoID: sVduWLXdk7U')).toEqual([])
  })
})

describe('selectUnprocessed', () => {
  test('filters out processed video ids', () => {
    const entries = [
      { videoId: 'aaaaaaaaaaa', title: 't1', publishedAt: '', description: '' },
      { videoId: 'bbbbbbbbbbb', title: 't2', publishedAt: '', description: '' },
    ]
    expect(selectUnprocessed(entries, ['aaaaaaaaaaa']).map((e) => e.videoId)).toEqual([
      'bbbbbbbbbbb',
    ])
  })
})
```

Run: `bun test scripts/digest/lib.test.ts`
Expected: FAIL

**Step 2: 実装**

`lib.ts` に追加:

```ts
// \r? は GitHub Web UI 編集で本文が CRLF 化されても照合が破れないための許容
export const extractVideoIdTrailers = (text: string): string[] =>
  [...text.matchAll(/^Video-ID:[ \t]*([A-Za-z0-9_-]{11})[ \t]*\r?$/gm)].map(
    (match) => match[1],
  )

export const selectUnprocessed = (
  entries: VideoEntry[],
  processedIds: Iterable<string>,
): VideoEntry[] => {
  const processed = new Set(processedIds)
  return entries.filter((entry) => !processed.has(entry.videoId))
}
```

**Step 3: 検証**

Run: `bun test scripts/digest/lib.test.ts`
Expected: PASS

**Step 4: コミット**

```bash
git add scripts/digest/lib.ts scripts/digest/lib.test.ts
git commit -m "feat(digest): 処理済み動画の除外判定を追加する"
```

---

### Task 7: 取得 CLI fetch-new.ts

**Files:**

- Create: `scripts/digest/fetch-new.ts`

ネットワーク・外部 CLI(yt-dlp / gh)への薄い合成層のため自動テストは作らない(ロジックは Task 4〜6 でテスト済み)。検証は実動画での smoke run。

**Step 1: 実装**

`scripts/digest/fetch-new.ts`:

```ts
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { articles } from '../../src/lib/articles/registry'
import {
  extractVideoIdTrailers,
  isPressConference,
  json3ToTranscript,
  parseFeed,
  parseVideoId,
  selectUnprocessed,
  type Json3Captions,
  type VideoEntry,
} from './lib'

const CHANNEL_ID = 'UCKmJk25wcPwCecf7nV9HwCw'
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

type DigestSource = VideoEntry & {
  videoUrl: string
  transcript: string
}

// Bun.spawnSync はコマンド不在時に throw するため、preflight で案内を出せるよう捕捉する
const run = (cmd: string[]) => {
  try {
    const result = Bun.spawnSync(cmd, { stdout: 'pipe', stderr: 'pipe' })
    return {
      ok: result.exitCode === 0,
      stdout: result.stdout.toString(),
      stderr: result.stderr.toString(),
    }
  } catch (error) {
    return { ok: false, stdout: '', stderr: String(error) }
  }
}

function fail(message: string): never {
  console.error(`[NG] ${message}`)
  process.exit(1)
}

const preflight = () => {
  if (!run(['yt-dlp', '--version']).ok) {
    fail('yt-dlp が見つかりません。`brew install yt-dlp` を実行してください。')
  }
  if (!run(['gh', 'auth', 'status']).ok) {
    fail('gh が未認証です。`gh auth login` を実行してください。')
  }
}

const collectProcessedIds = (): Set<string> => {
  const ids = new Set(
    articles.flatMap((article) => (article.videoId ? [article.videoId] : [])),
  )
  const prs = run([
    'gh',
    'pr',
    'list',
    '--state',
    'open',
    '--limit',
    '100',
    '--json',
    'body',
  ])
  if (!prs.ok) {
    fail(`gh pr list に失敗しました: ${prs.stderr}`)
  }
  const bodies = JSON.parse(prs.stdout) as Array<{ body: string | null }>
  for (const pr of bodies) {
    for (const id of extractVideoIdTrailers(pr.body ?? '')) {
      ids.add(id)
    }
  }
  return ids
}

// 字幕未生成(null)でスキップした動画は registry にも PR にも載らないため、次回実行で自動的に再対象になる
const fetchTranscript = async (videoId: string): Promise<string | null> => {
  const dir = await mkdtemp(join(tmpdir(), 'digest-'))
  try {
    const result = run([
      'yt-dlp',
      '--no-update',
      '--skip-download',
      '--write-auto-subs',
      '--sub-langs',
      'ja-orig',
      '--sub-format',
      'json3',
      '-o',
      join(dir, '%(id)s'),
      `https://www.youtube.com/watch?v=${videoId}`,
    ])
    if (!result.ok) {
      fail(`字幕取得に失敗しました (${videoId}): ${result.stderr}`)
    }
    const captionsFile = Bun.file(join(dir, `${videoId}.ja-orig.json3`))
    if (!(await captionsFile.exists())) {
      return null
    }
    const captions = (await captionsFile.json()) as Json3Captions
    return json3ToTranscript(captions)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

const fetchVideoMetadata = (videoId: string): VideoEntry => {
  const result = run([
    'yt-dlp',
    '--no-update',
    '--skip-download',
    '-J',
    `https://www.youtube.com/watch?v=${videoId}`,
  ])
  if (!result.ok) {
    fail(`動画メタデータの取得に失敗しました (${videoId}): ${result.stderr}`)
  }
  const meta = JSON.parse(result.stdout) as {
    title: string
    upload_date: string
    description: string
  }
  const date = meta.upload_date
  return {
    videoId,
    title: meta.title,
    publishedAt: `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T00:00:00+09:00`,
    description: meta.description,
  }
}

const collectTargets = async (): Promise<VideoEntry[]> => {
  const videoArgIndex = process.argv.indexOf('--video')
  if (videoArgIndex !== -1) {
    const input = process.argv[videoArgIndex + 1]
    if (!input) {
      fail('--video には動画 URL または動画 ID を指定してください。')
    }
    const videoId = parseVideoId(input)
    if (!videoId) {
      fail(`動画 ID を解釈できません: ${input}`)
    }
    if (collectProcessedIds().has(videoId)) {
      fail(
        `処理済みの動画です (${videoId})。再生成する場合は registry の該当エントリを先に削除してください。`,
      )
    }
    const entry = fetchVideoMetadata(videoId)
    if (!isPressConference(entry.title)) {
      console.error(`[WARNING] 記者会見以外の動画です: ${entry.title}`)
    }
    return [entry]
  }

  const response = await fetch(FEED_URL)
  if (!response.ok) {
    fail(`RSS フィードの取得に失敗しました: HTTP ${response.status}`)
  }
  const feed = parseFeed(await response.text())
  const conferences = feed.filter((entry) => isPressConference(entry.title))
  return selectUnprocessed(conferences, collectProcessedIds())
}

const main = async () => {
  preflight()
  const targets = await collectTargets()
  const sources: DigestSource[] = []
  for (const entry of targets) {
    console.error(`[OK] 字幕取得中: ${entry.title} (${entry.videoId})`)
    const transcript = await fetchTranscript(entry.videoId)
    if (transcript === null) {
      console.error(
        `[WARNING] 日本語自動字幕が未生成のためスキップします: ${entry.title} (${entry.videoId})`,
      )
      continue
    }
    sources.push({
      ...entry,
      videoUrl: `https://www.youtube.com/watch?v=${entry.videoId}`,
      transcript,
    })
  }
  console.log(JSON.stringify(sources, null, 2))
}

await main()
```

進捗メッセージは stderr、成果 JSON は stdout に分離する(パイプ処理のため)。

**Step 2: 検証(実ネットワーク smoke run)**

Run: `bun scripts/digest/fetch-new.ts --video sVduWLXdk7U > <scratchpad>/digest-smoke.json && head -c 400 <scratchpad>/digest-smoke.json`
Expected: `transcript` に日本語テキスト(2,000文字超)を含む JSON 配列が出力される(`<scratchpad>` はセッションのスクラッチパッドディレクトリ)

Run: `bun scripts/digest/fetch-new.ts | head -c 200`
Expected: 未処理の新着があればその JSON、なければ `[]`

**Step 3: コミット**

```bash
git add scripts/digest/fetch-new.ts
git commit -m "feat(digest): 新着記者会見の取得 CLI を追加する"
```

---

### Task 8: .gitignore 整備と記事生成スキル SKILL.md

**Files:**

- Modify: `.gitignore`
- Create: `.claude/skills/digest/SKILL.md`

`.claude/` 配下には非管理ファイル(agent-memory / settings.local.json / worktrees)が存在するため、skills のみ追跡対象にする。

**Step 1: .gitignore に追記**

既存 `.gitignore` の末尾に追加:

```gitignore
# Claude Code ローカルファイル(skills のみ追跡)
.claude/*
!.claude/skills/
```

Run: `git check-ignore -v .claude/settings.local.json; git check-ignore .claude/skills/digest/SKILL.md || echo "tracked"`
Expected: settings.local.json は ignore され、skills 配下は "tracked"

**Step 2: SKILL.md を作成**

`.claude/skills/digest/SKILL.md`:

````markdown
---
name: digest
description: デジタル庁 YouTube チャンネルの新着記者会見動画を要約記事化し、ニュースへの追加 PR を作成する。Trigger: "digest", "会見ダイジェスト", "新着会見をチェック", "デジタル庁の動画を記事化".
---

# digest — デジタル庁会見ダイジェスト記事の生成

新着の「大臣記者会見」動画を検知し、日本語自動字幕を基に用語解説付きの要約記事を生成して 1 実行 = 1 PR で提出する。公開は必ず PR の人間レビューを経る。

## 前提

- `yt-dlp`(動作確認版: 2026.01.29 以降)と `gh`(認証済み)が必要。不足時は fetch スクリプトが preflight で失敗する
- 作業ツリーが clean で、main が最新であること: `git status --porcelain` が空 → `git switch main && git pull --ff-only origin main`

## 手順

1. **取得**: `bun scripts/digest/fetch-new.ts` を実行し、出力 JSON をスクラッチパッドに保存する。特定動画を処理する場合は `--video <URL|動画ID>` を付ける(RSS は最新15件のみのため、古い動画はこのモードで遡及処理する)。**stderr に `[WARNING] 記者会見以外の動画です` が出た場合は処理を中断し、対象に含めてよいかユーザーに確認する(Ask First: 記者会見以外は対象範囲の拡大に当たる)**
2. **0件なら終了**: JSON が `[]` なら「新着なし」と報告して終了する。空の PR を作らない
3. **記事生成**(動画ごと):
   - slug: 動画公開日を Asia/Tokyo の `YYYY-MM-DD` にして `digital-jpn-press-conference-{YYYY-MM-DD}`。既存 slug と衝突する場合は `-{videoId の下6文字}` を付与
   - `src/lib/articles/posts/{slug}.md` を作成。**です・ます体、1,500〜2,300字**。transcript は句読点のない自動字幕なので、逐語ではなく整文した要約にする。フィラー(「えー」「まあ」等)は除去し、発言の趣旨を変えない。構成:
     - リード(見出しなし、2〜3文で会見の要点)
     - `## 主なトピック`(箇条書き 3〜6点)
     - `## 詳細`(トピックごとに `### 見出し` + 本文)
     - `## 用語解説`(3〜6語。`### 用語名` + 2〜4文の解説。**不確かな用語は Web 検索で裏取りし、確認できないものは載せない**)
     - `## Vecta の視点`(3〜5文。会見内容が Vecta の事業ドメイン(ベクトルデータ・公共 AI・GovTech)にとって何を意味するかの考察。**特定の政党・大臣個人への賛否や政治的評価は書かず、技術・社会実装の観点からの示唆に絞る**)
     - `## 出典`: 動画タイトル・動画 URL・[デジタル庁 YouTube チャンネル](https://www.youtube.com/@digital_jpn) へのリンクを記載する(公共データ利用規約 v1.0 に基づく帰属表示)
   - ラッパー `src/lib/articles/posts/{slug を PascalCase 化}.svelte` を固定テンプレートで作成:

     ```svelte
     <script lang="ts">
       import MarkdownBody from '../MarkdownBody.svelte'
       import source from './{slug}.md?raw'
     </script>

     <MarkdownBody {source} />
     ```

   - `src/lib/articles/registry.ts` の `articles` 配列にエントリを追加:
     - `title`: その回の会見で最も考察に値するトピックを軸に、示唆・問いかけのニュアンスを持たせた見出しにする(単なる要約ではなく「〇〇は△△か」のような考察調)。**特定の政党・大臣個人への賛否や政治的評価を示す表現は避ける**(用語解説と同じガードレール)。末尾に「(YYYY年M月D日)」を付ける
       - 例: 純国産AIは行政の信頼を築けるか——ガバメントAI「源内」考察(2026年7月10日)
     - `description`: リード文を基に 60〜90 字
     - `publishedAt`: 動画公開日時(`+09:00` 付き ISO)
     - `heroImage`: `/article/digest-press-conference.svg`(全ダイジェスト記事共通の固定サムネイル。閣僚等の肖像を含む YouTube サムネイルは肖像権・パブリシティ権・政治的中立性の観点から使用しない)
     - `videoId`: 動画 ID(重複生成防止の照合キー。削除禁止)
     - `component`: ラッパー Svelte の動的 import
4. **品質ゲート**: `bun run format` → `bun run check`。全て pass するまで修正する
5. **ブランチとコミット**: main から `digest/{YYYYMMDD-HHmm}` を作成。`git add` は生成・変更したファイルを**明示パスで指定**する(`git add .` / `git add .claude` は禁止)。コミット: `feat(article): デジタル庁会見ダイジェスト記事を追加する(YYYY-MM-DD)`
6. **PR 作成**(1実行 = 1 PR): 本文に各動画のタイトル・URL・生成記事 slug、レビュー観点(用語解説の正確性・要約の妥当性)を記載し、**末尾に動画ごとの `Video-ID: {videoId}` 行**を置く(重複生成防止の照合キー。削除禁止)

## 既知の挙動

- クローズ(未マージ)された PR の動画は次回実行で再生成される。恒久的に除外したい動画は記事化せず Issue で管理する
- 日本語自動字幕が未生成の動画はスキップされ、次回実行で自動的に再対象になる
- ダイジェスト記事はホームページのトップ(ニュースの注目3件)には表示されず、`/article/` 一覧のみに掲載される(`registry.ts` の `featuredArticles` が `videoId` 付き記事を除外するため)
````

**Step 3: 検証**

Run: `bun run check && git status --porcelain`
Expected: check PASS。git status に `.claude/skills/` 以外の .claude ファイルが現れない

**Step 4: コミット**

```bash
git add .gitignore .claude/skills/digest/SKILL.md
git commit -m "feat(digest): 会見ダイジェスト記事生成スキルを追加する"
```

---

### Task 9: CLAUDE.md へのアーキテクチャ追記

**Files:**

- Modify: `CLAUDE.md`

**Step 1: Content Structure に追記**

`## Architecture Overview` の Content Structure リストに追加:

```markdown
- **Digest articles**: デジタル庁会見ダイジェスト記事は Markdown 本文(`src/lib/articles/posts/*.md`)+ 固定テンプレートの Svelte ラッパーで構成され、`MarkdownBody.svelte` が描画する。生成は `.claude/skills/digest/`(スキル)と `scripts/digest/`(取得 CLI)が担う。
```

**Step 2: 検証**

Run: `bun run check`
Expected: PASS(ドキュメントのみの変更)

**Step 3: コミット**

```bash
git add CLAUDE.md
git commit -m "docs: CLAUDE.md にダイジェスト記事機構を追記する"
```

---

### Task 10: E2E 検証 — スキル手順の部分実行で初回記事を生成

**Files:**

- Create: `src/lib/articles/posts/digital-jpn-press-conference-{日付}.md`(生成物)
- Create: `src/lib/articles/posts/DigitalJpnPressConference{日付}.svelte`(生成物)
- Modify: `src/lib/articles/registry.ts`

SKILL.md 手順のうち **git 系ステップをスキップした部分実行**を feature/GH-42 ブランチ上で行う(preflight のブランチ確認・`digest/` ブランチ作成・PR 作成は実行しない)。生成した初回記事はこのブランチにコミットし、実装 PR で一緒にレビューする。**SKILL.md の git/PR ワークフロー部分(手順5〜6)は本タスクでは E2E 未検証で残る**ことを PR 説明に明記する。

**Step 1: スキル手順 1〜4 を実行**

1. `bun scripts/digest/fetch-new.ts --video sVduWLXdk7U > <scratchpad>/digest-e2e.json`
2. SKILL.md 手順 3 に従い記事 md・ラッパー・registry エントリを作成(用語解説の裏取りを含む)
3. `bun run format && bun run check`

Expected: check PASS

**Step 2: ビルドと表示確認**

Run: `bun run build && bun run preview`
Expected: `http://localhost:4173/article/` の一覧に新記事が表示され、記事ページで見出し・リスト・用語解説・出典が既存記事と同じタイポグラフィで描画される。`dist/sitemap-index.xml`(または該当 sitemap 出力)に新記事 URL が含まれる

**Step 3: 受け入れ基準の突合**

- 新着処理で記事が生成される → 本タスクで確認
- 重複生成の防止 → `bun scripts/digest/fetch-new.ts` を再実行し、**出力 JSON に `sVduWLXdk7U` が含まれない**ことを確認(registry に videoId が入ったため除外される)。注: RSS 上の他の未処理会見動画は引き続き出力されるため、`[]` になるとは限らない。また `--video sVduWLXdk7U` の再実行が「処理済みの動画です」で fail することも確認
- 記者会見以外のスキップ → fixture テスト(Task 4)+ `--video` 警告 + SKILL.md の Ask First 中断で担保

**Step 4: コミット**

```bash
git add src/lib/articles/posts/ src/lib/articles/registry.ts
git commit -m "feat(article): デジタル庁会見ダイジェストの初回記事を追加する"
```

---

## タスク依存関係

```
T1 → T2 ─────────────┐
T3 ──────────────────┤
T4 → T5 → T6 → T7 ───┼→ T8 → T9
                     └────→ T10(T8 完了後)
```

## レビュー履歴

- design-reviewer(タスク分解、2026-07-13): スコア 6/8 → P2 2件(T10 手順矛盾、.claude コミット汚染)と P3 7件を本計画に反映済み
- design-reviewer(計画書、2026-07-13): スコア 5/8 → P1 1件(parseVideoId テスト矛盾)・P2 4件(spawnSync throw、再実行期待値、CRLF regex、--video の Ask First 欠落)・P3 8件を全て反映済み。前回 P2 2件の解消は実証確認済み。marked v18 の string 返却・gitignore パターン・?raw import は実物検証で確定(確信度 95/95/85%)。修正が局所的なため diminishing returns ガードにより第3ラウンドは実施せず
