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
