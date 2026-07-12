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
