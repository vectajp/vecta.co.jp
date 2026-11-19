const { chromium } = require('playwright')
const { pathToFileURL } = require('node:url')
const path = require('node:path')
const fs = require('node:fs')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')

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
      const page = await browser.newPage({ viewport: { width: 1055, height: 1491 }, deviceScaleFactor: 3 })
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
      assert.equal(await page.locator('.back .step').count(), 4)
      for (const phrase of ['初期設定は弊社が対応', '既存チャットボットからも切り替え', '無料評価から導入まで', '初期費用10万円〜']) assert.ok(report.text.includes(phrase), phrase)
      assert.ok(report.text.includes('想定問い合わせ量・対象情報・連携内容'))
      assert.ok(!report.text.includes('人口'))
      assert.equal(await page.locator('.front-scene .text-preview img').count(), 1)
      assert.equal(await page.locator('.front-scene .voice-preview img').count(), 1)
      assert.deepEqual(await page.locator('.front-scene h2').allTextContents(), ['テキスト', '音声会話'])
      assert.equal(await page.locator('.front-scene .browser-chrome,.voice-question').count(), 0)
      assert.equal(await page.locator('.capture-caption').count(), 0)
      assert.ok(!report.text.includes('音声会話は既存の製品画面です。'))
      for (const phrase of ['佐藤 泰格 氏', '2026年10月17日放送', '総合政策部 デジタル統括課 副課長']) assert.ok(report.text.includes(phrase), phrase)
      assert.ok(!report.text.includes('Swarrow Chat'))
      assert.ok(!report.text.includes('SwarrowSite'), 'Site must not appear in Chat brochures')
      for (let n = 0; n < 2; n++) {
        await page.locator('.page').nth(n).screenshot({ path: path.join(build, `${slug}-${n + 1}.png`) })
      }
      const native = path.join(build, `${slug}-native.pdf`)
      await page.pdf({ path: native, printBackground: true, preferCSSPageSize: true, scale: (210 / 25.4 * 96) / 1055, margin: { top: 0, bottom: 0, left: 0, right: 0 } })
      // Bake shadows and SVG filters into opaque artwork; keep native PDF text.
      const boxes = () => [...document.querySelectorAll('h1,h2,h3,p,strong,span,a')].map(element => element.getBoundingClientRect().toJSON())
      const before = await page.evaluate(boxes)
      await page.addStyleTag({ content: '*{-webkit-text-fill-color:transparent!important}svg,svg *{-webkit-text-fill-color:initial!important}' })
      assert.deepEqual(await page.evaluate(boxes), before, 'Hiding glyphs changed layout')
      const backgrounds = path.join(build, slug)
      fs.mkdirSync(backgrounds, { recursive: true })
      for (let n = 0; n < 2; n++) {
        await page.locator('.page').nth(n).screenshot({ path: path.join(backgrounds, `background-${n + 1}.jpg`), type: 'jpeg', quality: 95, omitBackground: false })
      }
      const file = path.join(output, `SwarrowChat_${name}_パンフレット_20261119_r9.pdf`)
      const exported = spawnSync(process.env.PDF_PYTHON || 'python3', [path.resolve(__dirname, '../..', 'export-compatible-pdf.py'), native, backgrounds, file], { encoding: 'utf8' })
      assert.equal(exported.status, 0, exported.stderr || exported.error?.message)
      reports.push({ slug, file, ...report, compatibleExport: JSON.parse(exported.stdout), backgroundTextBoxesUnchanged: true })
      await page.close()
    }
  } finally {
    await browser.close()
  }
  fs.writeFileSync(path.join(build, 'checks.json'), JSON.stringify(reports, null, 2))
  console.log(JSON.stringify(reports.map(({ slug, file, pages, fonts, overflow, outside }) => ({ slug, file, pages, fonts, overflow, outside })), null, 2))
})().catch(error => { console.error(error); process.exitCode = 1 })
