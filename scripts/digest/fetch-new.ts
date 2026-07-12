import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { articles } from '../../src/lib/articles/registry'
import {
  extractVideoIdTrailers,
  isPressConference,
  type Json3Captions,
  json3ToTranscript,
  parseFeed,
  parseVideoId,
  selectUnprocessed,
  type VideoEntry,
} from './lib'

const CHANNEL_ID = 'UCKmJk25wcPwCecf7nV9HwCw'
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

type DigestSource = VideoEntry & {
  videoUrl: string
  thumbnailUrl: string
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

const fail = (message: string): never => {
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

const fetchTranscript = async (videoId: string): Promise<string> => {
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
      fail(`日本語自動字幕 (ja-orig) が見つかりません (${videoId})`)
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
    sources.push({
      ...entry,
      videoUrl: `https://www.youtube.com/watch?v=${entry.videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${entry.videoId}/hqdefault.jpg`,
      transcript: await fetchTranscript(entry.videoId),
    })
  }
  console.log(JSON.stringify(sources, null, 2))
}

await main()
