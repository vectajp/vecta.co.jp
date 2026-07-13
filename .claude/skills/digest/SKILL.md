---
name: digest
description: デジタル庁 YouTube チャンネルの新着記者会見動画を要約記事化し、ニュースへの追加 PR を作成する。Trigger: "digest", "会見ダイジェスト", "新着会見をチェック", "デジタル庁の動画を記事化".
---

# digest — デジタル庁会見ダイジェスト記事の生成

新着の記者会見動画(タイトルに「記者会見」を含む動画)を検知し、日本語自動字幕を基に用語解説と Vecta の考察を添えた記事を生成して 1 実行 = 1 PR で提出する。公開は必ず PR の人間レビューを経る。

## 前提

- `yt-dlp`(動作確認版: 2026.01.29 以降)と `gh`(認証済み)が必要。不足時は fetch スクリプトが preflight で失敗する
- 作業ツリーが clean で、main が最新であること: `git status --porcelain` が空 → `git switch main && git pull --ff-only origin main`

## 手順

1. **取得**: `bun scripts/digest/fetch-new.ts` を実行し、出力 JSON をスクラッチパッドに保存する。特定動画を処理する場合は `--video <URL|動画ID>` を付ける(RSS は最新15件のみのため、古い動画はこのモードで遡及処理する)。**stderr に `[WARNING] 記者会見以外の動画です` が出た場合は処理を中断し、対象に含めてよいかユーザーに確認する(Ask First: 記者会見以外は対象範囲の拡大に当たる)**
2. **0件なら終了**: JSON が `[]` なら「新着なし」と報告して終了する。空の PR を作らない
3. **記事生成**(動画ごと):
   - slug: 動画公開日を Asia/Tokyo の `YYYY-MM-DD` にして `digital-jpn-press-conference-{YYYY-MM-DD}`。既存 slug と衝突する場合は `-{videoId の下6文字}` を付与
   - `src/lib/articles/posts/{slug}.md` を作成。**です・ます体、1,500〜2,300字**。transcript は句読点のない自動字幕なので、逐語ではなく整文した要約にする。フィラー(「えー」「まあ」等)は除去し、発言の趣旨を変えない。構成:
     - リード(見出しなし、2〜3文で会見の要点)
     - `## 主なトピック`(箇条書き 3〜6点)
     - `## 詳細`(トピックごとに `### 見出し` + 本文)
     - `## 用語解説`(3〜6語。`### 用語名` + 2〜4文の解説。**不確かな用語は Web 検索で裏取りし、確認できないものは載せない**)
     - `## Vecta の視点`(3〜5文。会見内容が Vecta の事業ドメイン(ベクトルデータ・公共 AI・GovTech)にとって何を意味するかの考察。**特定の政党・大臣個人への賛否や政治的評価は書かず、技術・社会実装の観点からの示唆に絞る**)
     - `## 出典`: 動画タイトル・動画 URL(fetch 出力 JSON の `videoUrl` を使う)・[デジタル庁 YouTube チャンネル](https://www.youtube.com/@digital_jpn) へのリンクを記載する(公共データ利用規約 v1.0 に基づく帰属表示)
   - ラッパー `src/lib/articles/posts/{slug を PascalCase 化}.svelte` を固定テンプレートで作成:

     ```svelte
     <script lang="ts">
       import MarkdownBody from '../MarkdownBody.svelte'
       import source from './{slug}.md?raw'
     </script>

     <MarkdownBody {source} />
     ```

   - `src/lib/articles/registry.ts` の `articles` 配列にエントリを追加:
     - `title`: その回の会見で最も考察に値するトピックを軸に、示唆・問いかけのニュアンスを持たせた見出しにする(単なる要約ではなく「〇〇は△△か」のような考察調)。**特定の政党・大臣個人への賛否や政治的評価を示す表現は避ける**(用語解説と同じガードレール)。末尾に「(YYYY年M月D日)」を付ける
       - 例: 純国産AIは行政の信頼を築けるか——ガバメントAI「源内」考察(2026年7月10日)
     - `description`: リード文を基に 60〜90 字
     - `publishedAt`: 動画公開日時(`new Date('YYYY-MM-DDTHH:mm:ss+09:00')` 形式 — registry の型は `Date`)
     - `heroImage`: `/article/digest-press-conference.svg`(全ダイジェスト記事共通の固定サムネイル。閣僚等の肖像を含む YouTube サムネイルは肖像権・パブリシティ権・政治的中立性の観点から使用しない)
     - `videoId`: 動画 ID(重複生成防止の照合キー。削除禁止)
     - `component`: ラッパー Svelte の動的 import
4. **品質ゲート**: `bun run format` → `bun run check`。全て pass するまで修正する
5. **ブランチとコミット**: main から `digest/{YYYYMMDD-HHmm}` を作成。`git add` は生成・変更したファイルを**明示パスで指定**する(`git add .` / `git add .claude` は禁止)。コミット: `feat(article): デジタル庁会見ダイジェスト記事を追加する(YYYY-MM-DD)`
6. **PR 作成**(1実行 = 1 PR): 本文に各動画のタイトル・URL・生成記事 slug、レビュー観点(用語解説の正確性・要約の妥当性)を記載し、**末尾に動画ごとの `Video-ID: {videoId}` 行**を置く(重複生成防止の照合キー。削除禁止)

## 既知の挙動

- クローズ(未マージ)された PR の動画は次回実行で再生成される。恒久的に除外したい動画は記事化せず Issue で管理する
- 日本語自動字幕が未生成の動画はスキップされ、次回実行で自動的に再対象になる
- ダイジェスト記事はホームページのトップ(ニュースの注目3件)には表示されず、`/article/` 一覧のみに掲載される(`registry.ts` の `featuredArticles` が `videoId` 付き記事を除外するため)
