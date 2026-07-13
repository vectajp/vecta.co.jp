import { marked } from 'marked'

// 信頼済みコンテンツ専用: 出力は HTML サニタイズされない(記事は自己生成 + PR 人間レビューを経る)
export const renderMarkdown = (source: string): string =>
  marked.parse(source, { async: false, gfm: true })
