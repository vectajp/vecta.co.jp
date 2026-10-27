import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { FileBlob, PresentationFile } from '@oai/artifact-tool'

const root = path.dirname(fileURLToPath(import.meta.url))
const source = path.resolve(
  root,
  '../20261027-nhk-illustration/output/pptx/Swarrow_商談用営業資料_20261027_r3.pptx',
)
const build = path.join(root, '.build')
await fs.mkdir(build, { recursive: true })
await fs.mkdir(path.join(root, 'output/pptx'), { recursive: true })
const skill =
  '/Users/naoya/Library/Application Support/orca/codex-accounts/74564959-be7e-4c3d-82ad-1b33f02afbb6/home/plugins/cache/openai-primary-runtime/presentations/26.1020.11618/skills/presentations'
const python =
  '/Users/naoya/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3'
process.env.RUNTIME_NODE_MODULES ??=
  '/Users/naoya/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'
const p = await PresentationFile.importPptx(await FileBlob.load(source))
assert.equal(p.slides.items.length, 15)
const fields = [
  'id',
  'index',
  'elements.id',
  'elements.kind',
  'elements.text',
  'elements.position',
  'notes.text',
]
const before = await p.inspect({ select: '$.slides[*]', include: fields })
await fs.writeFile(path.join(build, 'before.ndjson'), before.ndjson)
const record = before.records[6]
assert(record.elements.some((e) => e.text === 'SwarrowChatの導入事例'))
const slide = p.resolve(record.id)
const visual = record.elements.find(
  (e) => e.kind === 'image' && e.position.left < 400,
)
assert(visual)
const picture = p.resolve(visual.id)
const frame = {
  ...picture.frame,
  left: 60,
  top: 234.23,
  width: 550,
  height: (550 * 846) / 1860,
}
picture.replace({
  blob: new Uint8Array(
    await fs.readFile(path.join(root, 'assets/news-illustration.png')),
  ),
  contentType: 'image/png',
  alt: 'キャスターがテキストチャットと音声会話のAI窓口を紹介するイラスト',
  fit: 'contain',
})
picture.frame = frame
const captionRecord = record.elements.find((e) =>
  e.text?.startsWith('NHK宮崎放送局「てげビビ！サタデー」で紹介'),
)
assert(captionRecord)
const caption = p.resolve(captionRecord.id)
caption.text =
  'NHK宮崎放送局「てげビビ！サタデー」で紹介\n2026年10月17日放送（画像はイメージ）'
caption.position = { left: 60, top: 501, width: 550, height: 52 }
caption.text.style = {
  typeface: 'Hiragino Sans',
  fontSize: 19,
  color: '#626B79',
  alignment: 'left',
  verticalAlignment: 'top',
  autoFit: 'none',
  wrap: 'square',
  insets: 0,
}
slide.speakerNotes.text =
  '佐藤泰格氏の写真・所属・紹介文、運用開始日は前版から保持。放送はNHK宮崎放送局「てげビビ！サタデー」、2026年10月17日。根拠は都城市秘書広報課からの2026年10月16日の放送案内と、10月18日の掲載記事共有。番組名の表記は放送局提供の番組情報 https://bangumi.org/tv_events/AmF-wAuhcAM?overwrite_area=59 で照合。掲載記事 https://news.web.nhk/newsweb/na/nd-20261017de60863 は2026年10月27日時点で404。図版は利用者承認済みのテキストチャット・音声会話を示す独自イラストで、実際の放送画面ではない。SwarrowChatの事例でありSwarrowCallの導入実績ではない。'
// Give the illustration and the profile equal 550px-wide areas.
const photoRecord = record.elements.find(
  (e) => e.kind === 'image' && e.position.left > 700,
)
assert(photoRecord)
const photo = p.resolve(photoRecord.id)
photo.frame = { ...photo.frame, left: 670 }
for (const element of record.elements) {
  if (element.kind !== 'textbox') continue
  if (['都城市', '総合政策部\nデジタル統括課 副課長'].includes(element.text)) {
    p.resolve(element.id).position = {
      ...element.position,
      left: 841,
      width: 379,
    }
  } else if (
    element.text === '佐藤 泰格 氏' ||
    element.text?.startsWith('都城市のDXを推進し')
  ) {
    p.resolve(element.id).position = {
      ...element.position,
      left: 670,
      width: 550,
    }
  } else if (
    element.text === '宮崎県都城市' ||
    element.text?.startsWith('2026年10月1日')
  ) {
    p.resolve(element.id).position = { ...element.position, width: 550 }
  }
}
const after = await p.inspect({ select: '$.slides[*]', include: fields })
for (let i = 0; i < 15; i++) {
  if (i !== 6)
    assert.deepEqual(
      after.records[i],
      before.records[i],
      `Unexpected change on slide ${i + 1}`,
    )
}
await fs.writeFile(path.join(build, 'after.ndjson'), after.ndjson)
const preview = await slide.export({ format: 'png', scale: 1 })
await fs.writeFile(
  path.join(build, 'case-preview.png'),
  new Uint8Array(await preview.arrayBuffer()),
)
const candidate = path.join(build, 'candidate.pptx')
await (await PresentationFile.exportPptx(p)).save(candidate)
execFileSync(python, [path.join(root, 'normalize-table-borders.py'), candidate])
const { finalizePresentation } = await import(
  pathToFileURL(path.join(skill, 'container_tools/artifact_tool_utils.mjs'))
)
const final = path.join(
  root,
  'output/pptx/Swarrow_商談用営業資料_20261027_r4.pptx',
)
await finalizePresentation({
  workspaceDir: root,
  candidatePath: candidate,
  finalPath: final,
  pythonExecutable: python,
  integrityValidatorPath: path.join(
    skill,
    'container_tools/inspect_presentation_package_integrity.py',
  ),
  layoutValidatorPath: path.join(
    skill,
    'container_tools/inspect_presentation_layout_geometry.py',
  ),
  layoutArgs: [
    '--expected-slide-size-emu',
    '12192000,6858000',
    '--validate-heading-fit',
    ...[6, 9, 11, 14].flatMap((n) => [
      '--require-native-table-slide',
      String(n),
    ]),
  ],
  explicitTotalSlideCount: 15,
  requiredNativeTableOwnerSlides: [6, 9, 11, 14],
  fontPolicy: {
    basis: 'reference',
    families: ['Hiragino Sans'],
    referencePath: source,
    referenceSha256: createHash('sha256')
      .update(await fs.readFile(source))
      .digest('hex'),
  },
  verifyArtifactToolImport: true,
  receiptPath: path.join(build, 'validation.json'),
})
console.log(JSON.stringify({ slides: 15, pptx: final }))
