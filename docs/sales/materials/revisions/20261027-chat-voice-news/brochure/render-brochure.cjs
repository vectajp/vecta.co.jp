const { chromium } = require('playwright')
const { pathToFileURL } = require('node:url')
const path = require('node:path')
const fs = require('node:fs')

;(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  const reports = []
  const tmp = path.join(__dirname, 'tmp', 'pdfs')
  fs.mkdirSync(tmp, { recursive: true })
  try {
    for (const n of [1, 2]) {
      const page = await browser.newPage({
        viewport: { width: 1055, height: 1491 },
        deviceScaleFactor: 2,
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
      const report = await page.evaluate(() => {
        const nodes = [
          ...document.querySelectorAll(
            'h1,h2,h3,p,.wordmark,.affiliation,.person-name,.offer-note span',
          ),
        ]
        return {
          fontChecks: [400, 600, 800].map((w) => ({
            weight: w,
            loaded: document.fonts.check(`${w} 24px BrochureSans`),
          })),
          badImages: [...document.images]
            .filter((i) => !i.complete || i.naturalWidth === 0)
            .map((i) => i.src),
          overflows: nodes
            .filter((e) => e.scrollWidth > e.clientWidth + 1)
            .map((e) => ({
              text: e.innerText,
              width: e.clientWidth,
              scrollWidth: e.scrollWidth,
              class: e.className,
            })),
          outOfPage: nodes
            .filter((e) => {
              const b = e.getBoundingClientRect()
              return b.x < -1 || b.right > 1056 || b.y < -1 || b.bottom > 1492
            })
            .map((e) => ({
              text: e.innerText,
              box: e.getBoundingClientRect().toJSON(),
            })),
          links: [...document.querySelectorAll('a[href]')].map((a) => ({
            href: a.href,
            box: a.getBoundingClientRect().toJSON(),
          })),
          text: document.body.innerText,
        }
      })
      const cdp = await page.context().newCDPSession(page)
      await cdp.send('DOM.enable')
      await cdp.send('CSS.enable')
      const { root } = await cdp.send('DOM.getDocument')
      const selectors =
        n === 1
          ? ['.cover-category', '.feature p', '.person-name']
          : [
              '.install-title',
              '.support-card p',
              '.pricing-card .offer-number',
              '.initial-fee',
              '.offer-note',
            ]
      report.platformFonts = []
      for (const selector of selectors) {
        const { nodeId } = await cdp.send('DOM.querySelector', {
          nodeId: root.nodeId,
          selector,
        })
        const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', {
          nodeId,
        })
        report.platformFonts.push({ selector, fonts })
      }
      await page.screenshot({
        path: path.join(__dirname, `SwarrowChat_パンフレット_${n}ページ目.png`),
        fullPage: true,
      })
      await page.pdf({
        path: path.join(tmp, `native-${n}.pdf`),
        printBackground: true,
        preferCSSPageSize: true,
        scale: ((210 / 25.4) * 96) / 1055,
        displayHeaderFooter: false,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      })
      reports.push({ page: n, ...report })
      await page.close()
    }
  } finally {
    await browser.close()
  }
  fs.writeFileSync(
    path.join(__dirname, 'render-checks.json'),
    JSON.stringify(reports, null, 2),
  )
  console.log(
    JSON.stringify(
      reports.map(
        ({
          page,
          fontChecks,
          badImages,
          overflows,
          outOfPage,
          platformFonts,
        }) => ({
          page,
          fontChecks,
          badImages,
          overflows,
          outOfPage,
          platformFonts,
        }),
      ),
    ),
  )
  if (
    reports.some(
      (r) =>
        r.badImages.length ||
        r.overflows.length ||
        r.outOfPage.length ||
        r.fontChecks.some((f) => !f.loaded),
    )
  )
    process.exitCode = 1
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
