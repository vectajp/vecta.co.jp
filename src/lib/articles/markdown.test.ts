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
    expect(html).toContain(
      '<a href="https://www.digital.go.jp/">デジタル庁</a>',
    )
  })
})
