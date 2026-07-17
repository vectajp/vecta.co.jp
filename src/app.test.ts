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
