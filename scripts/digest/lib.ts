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
