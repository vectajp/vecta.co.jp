const { chromium } = require('playwright')
const { pathToFileURL } = require('node:url')
const path = require('node:path')
const fs = require('node:fs')

;(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  const reports = []
  try {
    for (const n of [1, 2]) {
      const page = await browser.newPage({
        viewport: { width: 1055, height: 1491 },
        deviceScaleFactor: 3,
      })
      await page.goto(
        pathToFileURL(
          path.join(__dirname, `SwarrowChat_パンフレット_${n}ページ目.html`),
        ).href,
      )
      await page.evaluate(async () => {
        await document.fonts.ready
        await Promise.all([...document.images].map((i) => i.decode()))
      })
      await page.screenshot({
        path: path.join(__dirname, 'tmp', 'pdfs', `reference-${n}.png`),
        fullPage: true,
      })
      const report = await page.evaluate(() => {
        const boxes = [
          ...document.querySelectorAll('h1,h2,h3,p,.wordmark'),
        ].map((e) => ({
          text: e.textContent,
          rect: e.getBoundingClientRect().toJSON(),
        }))
        for (const el of document.querySelectorAll('body,body *')) {
          if (el instanceof HTMLElement)
            el.style.setProperty(
              '-webkit-text-fill-color',
              'transparent',
              'important',
            )
        }
        for (const el of document.querySelectorAll('svg'))
          el.style.setProperty(
            '-webkit-text-fill-color',
            'initial',
            'important',
          )
        const after = [
          ...document.querySelectorAll('h1,h2,h3,p,.wordmark'),
        ].map((e) => e.getBoundingClientRect().toJSON())
        const textOcclusionRects = [
          ...document.querySelectorAll('.live-widget'),
        ].map((e) => e.getBoundingClientRect().toJSON())
        return {
          textBoxesUnchanged: boxes.every(
            (b, i) => JSON.stringify(b.rect) === JSON.stringify(after[i]),
          ),
          textOcclusionRects,
          text: document.body.innerText,
        }
      })
      if (!report.textBoxesUnchanged)
        throw new Error(`Page ${n}: hiding glyphs changed layout`)
      await page.screenshot({
        path: path.join(__dirname, 'tmp', 'pdfs', `background-${n}.jpg`),
        type: 'jpeg',
        quality: 94,
        omitBackground: false,
        fullPage: true,
      })
      reports.push({ page: n, ...report })
      await page.close()
    }
  } finally {
    await browser.close()
  }
  fs.writeFileSync(
    path.join(__dirname, 'background-render-checks.json'),
    JSON.stringify(reports, null, 2),
  )
  console.log(
    JSON.stringify(
      reports.map((r) => ({
        page: r.page,
        textBoxesUnchanged: r.textBoxesUnchanged,
      })),
    ),
  )
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
