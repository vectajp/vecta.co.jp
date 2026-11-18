const { chromium } = require('playwright')
const { pathToFileURL } = require('node:url')
const path = require('node:path')
const fs = require('node:fs')
const assert = require('node:assert/strict')

;(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  const output = path.join(__dirname, 'output', 'pdf')
  const build = path.join(__dirname, '.build')
  fs.mkdirSync(output, { recursive: true })
  const reports = []
  try {
    for (const [slug, name] of [
      ['tourism', '観光協会向け'],
      ['donation', 'ふるさと納税向け'],
    ]) {
      const page = await browser.newPage({ viewport: { width: 1055, height: 1491 }, deviceScaleFactor: 1.5 })
      await page.goto(pathToFileURL(path.join(build, `${slug}.html`)).href)
      await page.evaluate(async () => {
        await document.fonts.ready
        await Promise.all([...document.images].map(image => image.decode()))
      })
      const report = await page.evaluate(() => ({
        pages: document.querySelectorAll('.page').length,
        fonts: [400, 700].map(weight => document.fonts.check(`${weight} 24px Noto`)),
        badImages: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src),
        overflow: [...document.querySelectorAll('h1,h2,h3,p,.question,.source-row,.step-label,.mail,.edition')]
          .filter(element => element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1)
          .map(element => ({ text: element.innerText, width: element.clientWidth, scrollWidth: element.scrollWidth })),
        outside: [...document.querySelectorAll('h1,h2,h3,p,figure,.question,.source-row,.contact,.features')]
          .filter(element => {
            const box = element.getBoundingClientRect()
            const parent = element.closest('.page').getBoundingClientRect()
            return box.left < parent.left - 1 || box.right > parent.right + 1 || box.top < parent.top - 1 || box.bottom > parent.bottom + 1
          }).map(element => element.innerText || element.className),
        links: [...document.querySelectorAll('a[href]')].map(element => element.href),
        text: document.body.innerText,
      }))
      assert.equal(report.pages, 2)
      assert.ok(report.fonts.every(Boolean), 'Noto Sans JP failed to load')
      assert.deepEqual(report.badImages, [])
      assert.deepEqual(report.overflow, [], JSON.stringify(report.overflow))
      assert.deepEqual(report.outside, [])
      assert.ok(report.text.includes('個別連携'))
      assert.ok(!report.text.includes('Swarrow Chat'))
      for (let n = 0; n < 2; n++) {
        await page.locator('.page').nth(n).screenshot({ path: path.join(build, `${slug}-${n + 1}.png`) })
      }
      const file = path.join(output, `SwarrowChat_${name}_パンフレット_20261118.pdf`)
      await page.pdf({ path: file, printBackground: true, preferCSSPageSize: true, scale: (210 / 25.4 * 96) / 1055, margin: { top: 0, bottom: 0, left: 0, right: 0 } })
      reports.push({ slug, file, ...report })
      await page.close()
    }
  } finally {
    await browser.close()
  }
  fs.writeFileSync(path.join(build, 'checks.json'), JSON.stringify(reports, null, 2))
  console.log(JSON.stringify(reports.map(({ slug, file, pages, fonts, overflow, outside }) => ({ slug, file, pages, fonts, overflow, outside })), null, 2))
})().catch(error => { console.error(error); process.exitCode = 1 })
