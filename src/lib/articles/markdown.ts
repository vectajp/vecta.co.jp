import { marked } from 'marked'

export const renderMarkdown = (source: string): string =>
  marked.parse(source, { async: false, gfm: true })
