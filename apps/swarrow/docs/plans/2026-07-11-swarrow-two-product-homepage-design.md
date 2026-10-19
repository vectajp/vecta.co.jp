# Swarrow 2製品ホームページ再構成設計

- 作成日: 2026-07-11
- 改訂日: 2026-07-12
- ステータス: Approved（フルチューニングAIメッセージ改訂を2026-07-12承認）
- Issue: none
- 選択アプローチ: 1ページ内で2製品を並列化
- メッセージアプローチ: Promise + Proof（強い約束の直後に運用根拠を提示）
- 設計確度: 92%

## Context

初版設計に基づき、現在の `swarrow.com` は `Swarrow Chat` と
`Swarrow Call` を同格の2製品として説明し、共通知識基盤、製品比較、
個別製品の順に読める構成へ変更済みである。現在のファーストビューは
「根拠を確認できる回答だけを、住民へ。検証してから、公開する。」と
公開前の品質管理を伝えているが、次のメッセージ課題が残っている。

- 「業務負担を軽減する」という便益だけでは最大公約数的で、競合との差が
  一目で分からない。
- 自治体の意思決定者が生成 AI の導入時に抱く「誤った案内を住民へ公開しないか」
  という不安へ、ファーストビューで答えていない。
- Swarrow の強みは単なる精度主張ではなく、自治体の公式情報を参照し、
  Vecta が事前検証し、自治体が公開範囲を確認し、公開後も改善する運用全体にある。
- Vecta が知識、回答ルール、参照元を個別に調整し、公開後も回答を
  磨き続ける姿勢が、ファーストビューの中心メッセージになっていない。
- 社内比較では正当性、根拠精度、幻覚抑制の優位性を確認しているが、結果は
  特定の100問と評価条件に依存し、完全な正答を示すものではない。
- 「正確性を保証」「誤回答ゼロ」のような断定は、実態以上の契約的保証に
  受け取られるため、公開サイトの約束として使用できない。

製品構成は次の2製品を維持する。

1. 自治体ホームページAI窓口「Swarrow Chat」
2. 自治体AIコールセンター「Swarrow Call」

両製品は個別に導入でき、併用時は FAQ、手順書、業務データなどを
同じ知識基盤から利用できる。この構造は維持し、Hero の約束を
「回答精度に妥協しないフルチューニングAI」へ変更する。
補助コピーで知識、回答ルール、参照元をフルチューニングする範囲を示し、
直後にその約束を成立させる事前検証、自治体確認、継続改善を提示する。

### Evidence basis

- `docs/sales/miyagawa/accuracy-and-rag-notes.md` と
  `docs/sales/miyagawa/deck-draft.md` は、自治体資料の参照、回答ルールの調整、
  難しい質問の職員引き継ぎ、継続改善を実運用品質の担保として説明している。
  同時に `誤回答はありません` や単一精度の約束を避けるよう定めている。
- `../axisw/docs/sales/competitive/customer_evidence_20260427/00_benchmark_report.md` は、
  100問の比較で Swarrow が正当性4.45、根拠精度4.68、幻覚抑制4.84を記録して
  いるが、質問票と条件に限定された結果であることを明記している。
- 消費者庁の
  [比較広告に関する景品表示法上の考え方](https://www.caa.go.jp/policies/policy/representation/fair_labeling/representation_regulation/comparative_advertising/)
  は、比較内容の客観的な実証、正確な引用、公正な比較を求めている。

このため、一般サイトは競合スコアそのものではなく、回答品質を作る運用の
違いを差別化要因として示す。比較数値は条件と許諾がそろった個別資料に限る。

## Target Users and User Needs

### Primary user

自治体全体の DX、情報政策、業務改革、窓口改善を担当する企画部門。

### Primary user need

> 全庁に分散する問い合わせ対応を整理し、限られた職員数でも住民への案内を
> 継続しながら、根拠を確認できない回答を住民へ公開しない導入方法を、
> 短時間で理解したい。

### Secondary users

- 市民課、税務、子育て、ごみ、福祉など、問い合わせが集中する現場部署
- 導入可否、予算、効果検証方法を判断する管理職・決裁者
- AI の回答根拠、公開判断、改善責任を確認する情報セキュリティ・法務担当者

ファーストビューは Primary user の最も大きい導入不安へ先に答える。
業務負担の痛みと2製品の統合価値は、その約束を理解した後に補強する。

## Boundaries

### Always

- `Swarrow Chat` と `Swarrow Call` を同格の独立製品として表示する。
- 両製品が個別導入可能であることと、併用時に知識基盤を共有できることを
  明記する。
- ファーストビューでは、自治体の公式情報をもとにした回答を事前評価し、
  確認できた範囲から公開する約束を先に伝える。
- ファーストビューでは `回答精度に妥協しない。` と宣言し、知識、
  回答ルール、参照元の個別調整から公開後改善までを品質への約束として伝える。
- H1 の `フルチューニングAI` は AI モデルの再学習ではなく、回答品質に
  関わる工程全体を個別に調整するサービスの位置付けとして使用する。
- Vecta が構築・事前検証・運用・改善を担当し、自治体が回答内容と公開範囲を
  確認する責任分担を明記する。
- 回答方針、参照元、不足情報を公開前に調整し、根拠が確認できない質問には
  無理に答えず、職員対応へ切り替えることを示す。
- 公開後も利用状況、参照元、低評価質問、改善対象を定期的に確認することを
  示す。
- 共通知識基盤と2製品の関係を、各製品の詳細説明より前に表示する。
- 現在の画像、WebP、PNG、MP4、WebM と poster fallback を再利用する。
- `prefers-reduced-motion`、動画 fallback、既存の reveal 処理を維持する。
- PC とモバイルの両方で、2製品の優先度を同等に見せる。

### Never

- `Swarrow Chat` を `Swarrow Call` の付属機能として表現しない。
- 競合の公開事例や提案用レンジを Swarrow の実績値として掲載しない。
- 「負担を半減」「問い合わせを70%削減」など、未検証の効果を断定しない。
- 「正確性を保証する」「回答を保証する」「誤回答はありません」
  「ハルシネーションゼロ」「どんな質問にも答える」など、全回答の正しさを
  無条件に保証する表現を使用しない。
- 一般サイトでは、個別案件の条件である `100問`、`月次`、`都城市` を
  Swarrow 全体に共通する提供条件として表示しない。
- 評価条件と公開許諾を示さずに、競合名、比較スコア、
  「他社より正確」といった優位性を掲載しない。
- 架空の自治体名・架空の導入事例を公開しない。
- 今回の変更で製品別ルート、問い合わせ API、課金、認証、データ保存形式を
  変更しない。
- 新しいイラスト、写真、動画を制作しない。

### Ask First

- Swarrow 固有の数値実績を新たに掲載する場合は、対象業務、測定期間、
  指標、出典、公開許諾を確認する。
- 競合比較を掲載する場合は、比較対象、質問票、評価方法、評価時点、
  サンプル数、結果の適用範囲、相手方を特定する表現の可否を確認する。
- `100問`、`月次`、自治体名など案件固有の運用条件を公開する場合は、
  当該自治体と Vecta の公開許諾を確認する。
- `保証` を契約、SLA、損害責任の意味で使用する場合は、提供条件と法務確認を
  別途設計する。
- 問い合わせフォームへ製品選択フィールドを追加する場合は、
  `swarrow.com-backend` の API 契約変更を別途設計する。
- 既存マークを変更するブランドリニューアルや、新しいロゴ制作は別途承認を
  受ける。
- 現在確認できない製品機能を訴求へ追加する場合は、実装または提供条件を
  製品担当者に確認する。

## Architecture

### Information architecture principles

1. **Promise then proof**: 強い品質約束の直後に、誰が何を確認するかを示す。
2. **Risk before outcome**: 誤案内への不安を解消してから業務便益を示す。
3. **Integrated before divided**: Chat と Call を説明する前に共通知識基盤を示す。
4. **Compare before detail**: 2製品を横並びで比較してから詳細へ進む。
5. **One message per section**: 同じ知識基盤や伴走支援の説明を重複させない。
6. **One conversion path**: ページ内の CTA は既存のお問い合わせモーダルへ
   集約する。

### Page structure

| 順序 | ID | セクション | 役割・主要メッセージ | 再利用素材 |
| ---: | --- | --- | --- | --- |
| 0 | - | Header | 製品中立の `Swarrow` ブランド、製品・共通基盤・導入支援へのアンカー、問い合わせ CTA | `/swarrow/icon.png` |
| 1 | `top` | Hero | 回答精度に妥協しないフルチューニングAIという位置付けを提示 | `hero-city.webm`、MP4、poster |
| 2 | `quality` | Quality Assurance | Vecta の事前検証、自治体との公開判断、公開後の改善を3項目で証明 | 追加素材なし |
| 3 | `problems` | Pain strip | 問い合わせ集中、知識の分散、繁忙時・時間外の取りこぼしを短い3項目で提示 | 追加素材なし |
| 4 | `knowledge` | Shared Knowledge | FAQ 等を一度整えれば、Chat と Call の双方で利用できる統合価値を図解 | `knowledge-flow-alpha.webm`、PNG |
| 5 | `products` | Product Overview | 2製品を同格のカードで比較し、個別導入と併用の両方を説明 | 追加素材なし |
| 6 | `chat` | Swarrow Chat | Web・LINE 等で自己解決を促し、電話前の定型問い合わせを受ける製品として説明 | `chat-ui.webm`、WebP |
| 7 | `call` | Swarrow Call | AI 受電、案内、取次、タイマー架電、一括発信を電話業務の変化と結び付けて説明 | `operator-call.*`、`call-timer.*`、`call-handoff.*`、`call-bulk.*` |
| 8 | `operations` | Common Operations | 知識と会話フローを職員が更新し、両チャネルの案内を継続改善できることを説明 | `workflow-editor-alpha.webm`、PNG |
| 9 | `support` | Customer Success | 導入準備、初期構築、運用改善の伴走支援を共通サービスとして説明 | `customer-success-*.webm`、poster |
| 10 | `news` | News | お知らせをファーストビューから分離し、製品理解後に配置 | 追加素材なし |
| 11 | `contact` | CTA | Chat、Call、併用の導入相談・デモを既存フォームで受け付ける | 追加素材なし |
| 12 | `footer` | Footer | 製品中立のブランド、会社・ポリシー導線 | `/swarrow/icon.png` |

### Hero message direction

コピーの構造は次で固定する。最終文言は実装時のコンテンツレビューで
読みやすさを調整するが、順序と意味は変えない。

- Eyebrow: `知識・回答ルール・参照元まで、フルチューニング。`
- H1 1行目: `回答精度に妥協しない。`
- H1 2行目: `フルチューニングAI。`
- Support copy:
  `Swarrow ChatとSwarrow Callは、自治体の公式情報と業務に合わせ、
  知識・回答ルール・参照元・職員への引き継ぎまで個別に設計。公開前に
  回答を検証し、自治体と確認した範囲から公開します。公開後も利用状況や
  低評価質問をもとに、回答品質を継続的に改善します。`
- Primary CTA: `導入相談・デモを依頼する`
- Secondary CTA: `回答品質の仕組みを見る` → `#quality`

ニュースカードは Hero から外し、品質の約束、製品名、CTA、既存 Hero 動画だけに
焦点を絞る。`フルチューニング` は AI モデルの自治体別再学習を意味せず、
知識、回答ルール、参照元、職員への引き継ぎ、事前検証、公開後改善という
回答品質に関わる工程全体を個別に調整する運用上の約束を示す。

### Answer quality assurance model

`#quality` は Hero の約束を、次の見出しと3項目で直ちに裏付ける。

- Kicker: `Answer Quality`
- H2: `公開前に検証し、公開後も改善する。`
- Lead:
  `Vectaが回答を検証し、自治体と公開範囲を確認。公開後の利用状況まで見て、
  回答品質を継続的に改善します。`

| Proof | 見出し | 説明 |
| --- | --- | --- |
| 1 | Vecta による公開前検証 | 評価質問を使い、回答方針・参照元・不足情報を調整 |
| 2 | 自治体との公開判断 | 根拠と回答内容を確認できた範囲から公開 |
| 3 | 継続的な品質改善 | 利用状況・参照元・低評価質問・改善対象を定期的に確認 |

3項目の直後に、`根拠が確認できない質問には無理に答えず、職員対応へ
切り替えます。` と表示する。一般サイトでは検証件数と確認頻度を固定せず、
案件に応じた評価質問と定期確認という共通プロセスだけを約束する。

責任分担は次のとおりとする。

| 主体 | 責任 |
| --- | --- |
| Vecta | 知識の構築、回答方針と参照元の事前検証、公開後の監視・改善提案を担当する |
| 自治体 | 公式情報、回答内容、公開対象を確認し、公開範囲と変更内容を判断する |
| Swarrow Chat／Call | 確認済みの知識をもとに回答し、参照元を運用上確認できる状態にして、根拠がない場合は職員対応へ切り替える |

したがって、ホームページで全面に出す「保証」は、正答率100%や損害責任を
意味する契約保証ではない。公開前検証、根拠確認、公開範囲の合意、公開後改善を
継続するプロセス保証として表現する。

### Product overview

`#products` では、次の2カードを同じ面積・見出し階層で配置する。

#### Swarrow Chat

- 製品表記: `自治体ホームページAI窓口 Swarrow Chat`
- 便益: ホームページや LINE で住民の自己解決を促し、電話へ集中する前に
  定型的な質問へ回答する。
- 主な利用場面: 手続き案内、必要書類、施設案内、予約・申請への誘導。
- 詳細導線: `Swarrow Chat を見る` → `#chat`

#### Swarrow Call

- 製品表記: `自治体AIコールセンター Swarrow Call`
- 便益: AI が電話の一次受付、案内、取次、発信を担い、職員の電話対応を
  必要な案件へ絞る。
- 主な利用場面: 代表電話、時間外受付、担当課取次、リマインド、一括周知。
- 詳細導線: `Swarrow Call を見る` → `#call`

カードの直後に `単独でも、組み合わせても導入可能` と表示し、
併用時は同じ知識基盤を共有することを再確認できるようにする。

### Existing media allocation

| 現在の素材 | 新しい役割 | 方針 |
| --- | --- | --- |
| `hero-city.*` | Hero | 現状どおり WebM、MP4、poster を使う |
| `knowledge-flow-alpha.*` | 共通知識基盤 | Chat／Call の統合図解として最優先で再利用する |
| `chat-ui.*` | Swarrow Chat | 製品名と alt を `Swarrow Chat` に変更する |
| `operator-call.*` | Swarrow Call の AI 受電 | 現在の動画・fallback を維持する |
| `call-timer.*` | タイマー架電 | Swarrow Call 固有機能として維持する |
| `call-handoff.*` | 自動取次 | Swarrow Call 固有機能として維持する |
| `call-bulk.*` | 一括発信 | Swarrow Call 固有機能として維持する |
| `workflow-editor-alpha.*` | 両製品共通の運用改善 | Chat セクションから独立させ共通機能として配置する |
| `customer-success-*` | 共通の導入・運用支援 | 現在の順序と fallback を維持する |
| `case-*.jpg` | 使用しない | `showCaseStudies = false` を維持する |

`static/swarrow-call/` 配下の公開 URL は今回は変更しない。ファイル移動は
表示価値を生まず、参照漏れやキャッシュ切れのリスクだけを増やすためである。

### Brand treatment

現在の `logo.svg` と `footer-logo.svg` は `Swarrow Call` の文字を含むため、
統合ブランドの表示には使用しない。既存の `/swarrow/icon.png` と live text の
`Swarrow` を組み合わせ、製品中立のヘッダー／フッターを構成する。

- マーク自体は変更しない。
- 新しいロゴ画像は作らない。
- `Swarrow Chat`、`Swarrow Call` は画像ではなく live text で表示する。
- 既存 SVG は削除せず保持する。

### SEO and structured data

単一 URL 方針のため canonical と sitemap は `https://swarrow.com/` のまま
維持する。ページ全体の metadata を2製品に合わせて変更する。

- title 候補:
  `Swarrow｜自治体ホームページAI窓口・自治体AIコールセンター`
- description 候補:
  `自治体ホームページAI窓口「Swarrow Chat」と自治体AIコールセンター
  「Swarrow Call」。自治体の公式情報をもとにした回答を公開前に検証し、
  参照元の確認と公開後の継続改善で問い合わせ対応を支えます。`
- `og:site_name`: `Swarrow`
- OGP／Twitter title・description: 通常 metadata と同じメッセージへ統一する。
- JSON-LD: `@graph` で `Organization`、`WebSite`、2つの `Service` を表現する。
- 2つの `Service` は画面上に表示される製品説明と一致させ、
  `#swarrow-chat` と `#swarrow-call` の `@id` で区別する。
- `static/sitemap.xml` は root URL のみのため内容を変更せず、build 後に確認する。

構造化データは検索結果表示を保証するものではない。可視コンテンツと一致する
情報だけを記述し、build HTML と Schema Markup Validator で妥当性を確認する。

検索検証は、再現可能なローカル／CI 契約と、公開後にしか観測できない結果を
分離する。

- `bun:test` で content と build 後 HTML を検査し、title、description、
  canonical、robots、sitemap、可視見出し、品質プロセス、2製品の JSON-LD を
  固定する。
- 公開前に Search Console で root URL の直近28日を記録し、公開7日後に
  crawl／index、公開28日後に impressions、clicks、CTR を同じ条件で比較する。
- `Swarrow`／製品名、Chat、Call、統合問い合わせ対応、回答品質の5クエリ群を
  観測する。回答品質群は `自治体 AI 回答精度`、`自治体 AI 参照元`、
  `自治体 AI 誤回答対策` を起点とし、実際に impression が出た語へ更新する。
- average position は補助指標とし、検索順位、即時 index、rich result 表示を
  CI やリリースの合否条件にはしない。
- Search Console の OAuth credential と export はリポジトリへ保存しない。

### Interaction and accessibility

- H1 は Hero の1個だけとし、主要セクションは H2、機能項目は H3/H4 を使う。
- Header の製品リンクは `#chat` と `#call` へ移動する。
- モバイルでは Product Overview を Chat → Call の順に縦積みするが、
  面積、見出しレベル、CTA の強さは同等にする。
- 既存のキーボード操作、focus-visible、ContactModal の Escape 閉じを維持する。
- `prefers-reduced-motion: reduce` では動画を自動再生せず poster を表示する。
- すべての情報を動画だけに依存させず、同じ意味を見出し・本文・alt で提供する。

### Concrete file-change list

| ファイル | 変更内容 |
| --- | --- |
| `src/lib/swarrow/content.ts` | Hero、Quality Assurance の3項目、責任分担、metadata を同じ source of truth から提供する |
| `src/routes/+page.svelte` | Hero を新コピーへ変更し、直後に `#quality` を追加する。既存素材、2製品以下の構成、CTA は維持する |
| `tests/seo/content.test.ts` | 新コピー、品質プロセス、責任主体、禁止表現、案件固有語の不在を検証する |
| `tests/seo/build-output.test.ts` | build HTML の `Hero → quality → problems → knowledge` 順、3つの Proof、可視文言、metadata を検証する |
| `docs/seo-operations.md` | 回答品質クエリ群と、Hero 改訂前後を同条件で比較する Search Console 手順を追加する |
| `app-words.txt` | cspell が製品名を未知語として検出した場合のみ、必要な語を追加する |

変更しない対象:

- `static/swarrow-call/*` のファイル名と内容
- `static/sitemap.xml` の URL 構成
- `swarrow.com-backend`
- 資料請求 API の request／response schema
- `showCaseStudies = false`
- Swarrow Chat／Call の回答生成、参照元表示、職員切り替え機能そのもの

## Staged Change Plan

初版の2製品化を前提に、回答品質メッセージ改訂を次の小さい単位で進める。
各段階で契約テストを先に更新し、Hero の強い約束と裏付けが分離しないことを
確認してから次へ進む。

1. **回答品質コンテンツ契約を固定する**
   - `content.test.ts` へ Hero、3つの Proof、責任主体、禁止表現を追加する。
   - `content.ts` に品質メッセージの source of truth を追加する。
2. **Promise + Proof を実装する**
   - Hero を回答品質中心へ変更する。
   - Hero 直後に `#quality` を置き、事前検証、自治体確認、継続改善、
     職員対応への切り替えを表示する。
3. **検索シグナルと契約テストを同期する**
   - description、OGP、Twitter description を新しい可視メッセージへ合わせる。
   - build HTML のセクション順、H1、禁止表現、案件固有語を検証する。
4. **表示・検索運用を検証する**
   - PC／モバイルで Hero と Proof が1つの意味単位として読めるか確認する。
   - Search Console の改訂前 baseline と回答品質クエリ群を記録し、
     公開7日後・28日後に同条件で比較する。

## Acceptance Criteria

### AC1: ファーストビューで回答品質の約束が分かる

- **Given** 自治体の DX・情報政策担当者が root ページを開く
- **When** 最初の画面を確認する
- **Then** 回答精度に妥協せず、知識、回答ルール、参照元を個別に調整する
  `フルチューニングAI` だと理解できる
- **And** `Swarrow Chat` と `Swarrow Call` の両方の名前を確認できる

### AC2: 共通知識基盤が製品詳細より先に伝わる

- **Given** 訪問者が Hero から下へ読み進める
- **When** 個別製品の詳細へ到達する前
- **Then** FAQ、手順書、業務データを1つの知識基盤で管理できることが表示される
- **And** 同じ知識を Chat と Call の両方が利用する図と説明が表示される

### AC3: 2製品が同格に見える

- **Given** Product Overview を表示する
- **When** PC またはモバイルで2カードを比較する
- **Then** 両製品の見出し階層、説明量、CTA の強さが同等である
- **And** 個別導入と併用の両方が可能だと分かる

### AC4: Swarrow Chat の独自便益が分かる

- **Given** `#chat` セクションを表示する
- **When** 見出し、本文、既存 Chat UI 動画を確認する
- **Then** ホームページや LINE で住民の自己解決を促す製品だと理解できる
- **And** `Swarrow Call` の一機能として表現されていない

### AC5: Swarrow Call の独自便益が分かる

- **Given** `#call` セクションを表示する
- **When** 見出し、本文、既存の電話関連動画を確認する
- **Then** AI 受電、案内、取次、架電、一括発信の利用場面が理解できる
- **And** 機能名だけでなく職員の電話業務がどう変わるか説明されている

### AC6: 未検証の実績・精度保証を掲載しない

- **Given** 公開ページの全文を確認する
- **When** 削減率、導入事例、精度、保証、競合比較の表現を検索する
- **Then** Swarrow 固有の根拠がない数値効果が存在しない
- **And** 全回答の正しさを保証する表現や、条件を示さない競合優位表現がない
- **And** 架空のケーススタディが表示されない

### AC7: 既存素材を再利用する

- **Given** ページ内の画像と動画を確認する
- **When** 各 `src`、`poster`、fallback を比較する
- **Then** 既存の `static/swarrow-call/*` 素材が再利用されている
- **And** 新しいイラスト、写真、動画が追加されていない

### AC8: アクセシビリティと motion 設定を維持する

- **Given** キーボード操作または reduced-motion 環境でページを利用する
- **When** アンカー、CTA、ContactModal、動画を操作する
- **Then** focus が確認でき、Escape でモーダルを閉じられる
- **And** reduced-motion では動画が自動再生されず poster が表示される

### AC9: SEO 表現が2製品と一致する

- **Given** build 後の root HTML を確認する
- **When** title、description、OGP、canonical、JSON-LD を検査する
- **Then** サイト名が `Swarrow` で、両製品が可視コンテンツと一致して記述される
- **And** canonical と sitemap は `https://swarrow.com/` を維持する

### AC10: 問い合わせ API を壊さない

- **Given** ContactModal からフォームを送信する
- **When** 既存 API へ request を送る
- **Then** request field と endpoint は変更前と同じである
- **And** 完了、通信エラー、Turnstile の表示動作が維持される

### AC11: リポジトリの検証を通過する

- **Given** 実装が完了している
- **When** `bun --bun run check` と `bun --bun run build` を実行する
- **Then** 両方が成功する
- **And** build 後の root HTML と静的素材参照に欠落がない

### AC12: 公開後の検索結果を同じ条件で観測できる

- **Given** 変更前の Search Console baseline を root URL とクエリ群別に記録している
- **When** 公開直後、7日後、28日後に同じ手順で確認する
- **Then** crawl／index 状態と impressions、clicks、CTR の変化を比較できる
- **And** 順位や即時 index をリリース失敗とは判定しない

### AC13: 強い約束の直後に3つの根拠が見える

- **Given** 訪問者が Hero から下へ読み進める
- **When** `#quality` を確認する
- **Then** `Vecta による公開前検証`、`自治体との公開判断`、
  `継続的な品質改善` の3項目が表示される
- **And** DOM 順が `Hero → quality → problems → knowledge` である

### AC14: 回答品質の責任分担と例外処理が分かる

- **Given** 訪問者が回答品質の説明を読む
- **When** 事前検証から公開後改善までを確認する
- **Then** Vecta が構築・検証・運用改善を担当し、自治体が回答内容と公開範囲を
  確認することが分かる
- **And** 根拠が確認できない質問には無理に答えず、職員対応へ切り替えることが
  分かる

### AC15: 共通プロセスと案件固有条件を混同しない

- **Given** 一般公開する root ページと metadata を確認する
- **When** 品質プロセスの説明を検索する
- **Then** 事前評価、自治体確認、定期的な改善という共通プロセスが表示される
- **And** `100問`、`月次`、`都城市` が Swarrow 共通の提供条件として
  表示されない

## Requirement Traceability

| 要求 | 設計要素 | 受入条件 |
| --- | --- | --- |
| 回答品質をファーストビューの差別化要因にする | Hero message、Quality Assurance | AC1、AC13 |
| 回答品質に関わる工程全体を個別に調整する位置付けを示す | Hero message、Support copy | AC1、AC13、AC14 |
| 強い約束を運用根拠で直ちに裏付ける | Promise then proof、3つの Proof | AC13 |
| Vecta と自治体の責任分担を示す | Answer quality assurance model | AC14 |
| 根拠がない質問には無理に答えない | Quality Assurance の例外処理 | AC14 |
| 共通プロセスと案件固有条件を分離する | Never／Ask First、品質コンテンツ契約 | AC6、AC15 |
| 買い手の業務便益を品質約束の後に伝える | Pain strip、Shared Knowledge | AC2、AC13 |
| Chat と Call を独立した同格製品として扱う | Product Overview、各製品セクション | AC3、AC4、AC5 |
| 併用時の共通知識基盤を差別化要因として示す | Shared Knowledge、Product Overview 後の併用説明 | AC2、AC3 |
| 未検証の数値や架空実績を掲載しない | Never 境界、ケーススタディ非表示 | AC6 |
| 既存の画像・動画を再利用する | Existing media allocation | AC7 |
| motion、fallback、キーボード操作を維持する | Interaction and accessibility | AC8 |
| 1ページ内で2製品を正しく表現する | Page structure、SEO and structured data | AC1、AC3、AC9 |
| 問い合わせ API を変更しない | One conversion path、既存 ContactModal | AC10 |
| コード・文書・公開 HTML の整合性を確認する | Concrete file-change list、Verification Plan | AC11 |
| 検索ヒットへの影響を同条件で観測する | SEO and structured data、Search Console 運用 | AC12 |

## Decisions Made

| 決定 | 確度 | 理由 |
| --- | ---: | --- |
| 1ページ構成を維持する | 100% | ユーザーがアプローチ2を選択した |
| 2製品を個別導入可能な同格製品として扱う | 100% | ユーザーが製品関係 A を選択した |
| DX・情報政策／企画部門を主対象にする | 100% | ユーザーが対象者 A を選択した |
| 未検証の数値効果を掲載しない | 100% | ユーザーが数値表現 A を選択した |
| 統合価値を個別製品より前に置く | 92% | 指摘された根本原因を1ページ構成で解消するために必須 |
| Hero を回答品質の約束へ変更する | 100% | ユーザーが回答保証を差別化の中心に選択した |
| Hero で `回答精度に妥協しない。` と宣言する | 100% | ユーザーが精度への姿勢を最優先に選択した |
| `フルチューニングAI。` と表現する | 100% | ユーザーが品質工程全体の個別調整を製品の位置付けとして選択した |
| `フルチューニング` を知識、回答ルール、参照元から継続改善までの個別調整と定義する | 100% | モデル再学習ではなく回答品質に関わる工程全体を強みとして示すため |
| Promise + Proof の2層構成にする | 100% | ユーザーがアプローチ3を選択した |
| 公式情報に基づき、根拠がない場合は答えず職員へ切り替える | 100% | ユーザーが保証方針 A を選択した |
| `保証` は全回答の正確性ではなく品質管理プロセスとして表現する | 95% | 社内資料も単一精度の約束を避け、根拠・引き継ぎ・継続改善を品質担保としている |
| 一般サイトでは件数・頻度・自治体名を固定しない | 100% | ユーザーが適用範囲 C を選択した |
| `100問`、`月次`、`都城市` は案件固有の証拠として分離する | 100% | 一般化による誤認を避けつつ、個別提案で具体性を保つため |
| 既存 icon と live text で製品中立ブランドを作る | 90% | 新規ロゴ制作なしで Call 偏重を解消できる |
| 既存メディア URL を維持する | 95% | 素材再利用を満たし、移動による参照漏れを避けられる |
| root に複数 Service の JSON-LD を置く | 85% | 単一ページの可視コンテンツと2製品を一致させられる |
| 問い合わせ API を変更しない | 95% | ホームページ再構成の範囲に限定し、cross-repo 変更を避ける |

## Risks and Mitigations

| リスク | 重要度 | 対策 |
| --- | --- | --- |
| H1 が「全回答の正確性を保証する」と解釈される | P1 | 直後に事前検証、自治体確認、無理に答えない例外処理を表示し、単独の `回答を保証` 表現を禁止する |
| `フルチューニング` が AI モデルの自治体別再学習だと誤解される | P1 | 補助コピーで知識、回答ルール、参照元を列挙し、Support copy と Quality Assurance で個別調整の範囲を説明する |
| Vecta と自治体の責任境界が曖昧になり、責任転嫁に見える | P1 | Vecta の構築・検証・改善責任と、自治体の公式情報・公開範囲確認を同じセクションで示す |
| 案件固有の100問・月次確認を全導入先への約束と誤認される | P1 | 一般サイトは `評価質問` と `定期的` に抽象化し、固有条件を禁止語テストで除外する |
| Chat と Call が詳細セクションで再び分断される | P1 | Shared Knowledge と Product Overview を詳細より前に固定する |
| Call 単一ブランドの残存箇所が誤認を生む | P1 | Header、Footer、metadata、alt、本文、README、AGENTS を横断検索する |
| 1ページが長く、途中離脱される | P2 | アンカーナビ、短い Pain strip、重複説明の集約、製品比較を先に配置する |
| Chat と Call の説明量に差が出る | P2 | Product Overview の構造を揃え、PC／モバイルで比較確認する |
| 動画の再配置で読み込みや motion 動作が壊れる | P2 | 現在の selector、IntersectionObserver、poster fallback を維持して検証する |
| 2製品を1ページで扱うため製品別 SEO が弱い | P2 | metadata と可視見出しを明確化し、将来必要になった時だけ製品別 route を再検討する |
| 回答品質クエリの検索量が少なく、28日で傾向が出ない | P2 | impression 0件を失敗にせず、実際に表示された query と既存の製品クエリを併記する |

未解決の P0／P1 リスクはない。

## Design Review

| 観点 | 指摘 | 重要度 | 解決 |
| --- | --- | --- | --- |
| Correctness | 強い H1 が全回答の正確性保証に見える | P1 | Proof、例外処理、禁止表現を Hero 直後と AC6／AC13／AC14 に固定した |
| Completeness | Vecta、自治体、製品の責任分担が不足する | P1 | 責任表と3段階の運用モデルを追加し、AC14 へ対応付けた |
| Scope discipline | 100問、月次、都城市を一般条件へ誤って広げる | P1 | Never／Ask First、AC15、build HTML の禁止語検査で分離した |
| Traceability | 新しい品質要件と受入条件の対応が見えない | P2 | AC13〜AC15 と Requirement Traceability を追加した |
| 実装可能性 | コピーだけ決まり、DOM 順と変更ファイルが不明確になる | P2 | exact copy、`#quality`、4段階の変更計画、5ファイルの変更内容を固定した |
| Search verification | 検索ヒットをローカルテストで保証できない | P2 | build 契約と Search Console の7日後／28日後観測を分離した |

レビュー結果は `PASS`。未解決の P0／P1 はなく、実装開始前に必要な判断は
本設計内で確定している。

## Open Questions

次の項目は実装を妨げないため、コンテンツレビューまたは公開前確認で扱う。

- H1 の2文をどの幅で改行するかは、desktop／mobile の表示確認で最終調整する。
- News の日付と内容が公開時点で最新か、公開前に担当者が確認する。
- 将来、競合比較スコアを公開する場合は、評価条件と公開許諾を得たうえで
  別タスクとして設計する。
- 将来 Swarrow 固有の導入実績が公開可能になった場合、ケーススタディ再開を
  別タスクで検討する。
- 将来、製品別検索流入や営業導線の必要性が高まった場合、`/chat` と `/call`
  の分割を別設計として再検討する。

## Non-Goals

- 製品機能そのものの追加・変更
- 正答率100%、誤回答ゼロ、ハルシネーションゼロを実現または保証する機能開発
- 契約、SLA、損害責任としての回答保証
- 競合名、比較スコア、ベンチマーク質問票の一般サイトへの公開
- `100問`、`月次`、`都城市` を全導入先共通の提供条件にすること
- Swarrow Chat／Call の管理画面変更
- バックエンド API、D1、メール配信、Turnstile の仕様変更
- 製品別 URL や新しいサイトの追加
- 価格表、契約プラン、PoC 条件の策定
- 新規の導入事例、数値実績、第三者評価の作成
- 新しい画像、動画、ロゴ、ブランドガイドラインの制作
- 現在未実装の情報セキュリティ方針、個人情報保護方針、利用規約ページの作成

## Verification Plan

1. `git diff --check`
2. `bun --bun run check`
3. `bun --bun run test:seo`
4. `bun --bun run build`
5. build 後の root HTML で次を確認する。
   - H1 が1個
   - Hero に `知識・回答ルール・参照元まで、フルチューニング。`、
     `回答精度に妥協しない。`、`フルチューニングAI。` が表示される
   - `Swarrow Chat` と `Swarrow Call` の表示
   - `Hero → quality → problems → knowledge` の順序
   - Quality Assurance に3つの Proof、Vecta、自治体、参照元、
     職員対応への切り替えが表示される
   - `100%`、`誤回答はありません`、`ハルシネーションゼロ`、
     `どんな質問にも`、`他社より正確` が存在しない
   - `100問`、`月次`、`都城市` が存在しない
   - canonical、title、description、OGP
   - JSON-LD の `WebSite` と2つの `Service`
   - `showCaseStudies = false` により架空事例が非表示
6. desktop と mobile viewport で次を確認する。
   - Hero の品質約束と2製品名が最初の画面で理解できる
   - Hero と Quality Assurance が視覚的に分断されず、約束と根拠の順に読める
   - Product Overview の同格性
   - Header anchor と CTA
   - ContactModal の開閉・エラー・送信完了
7. reduced-motion を有効にして poster fallback を確認する。
8. 既存の画像・動画 URL がすべて成功応答することを確認する。
9. Schema Markup Validator または Rich Results Test で JSON-LD を確認する。
10. 公開前に Search Console の直近28日 baseline を保存する。
11. 公開直後に live URL、robots、sitemap、canonical を確認する。
12. 公開7日後に crawl／index、28日後に検索パフォーマンスを比較する。
13. Brand、Chat、Call、統合問い合わせ対応、回答品質の5クエリ群を
    root URL へ絞り、同じ期間条件で比較する。
