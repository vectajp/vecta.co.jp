# 観光協会・ふるさと納税向け営業パンフレット

2026年11月18日。導入先に渡す営業用として、観光協会向けと自治体のふるさと納税担当課・運営事業者向けを別々に作成。各A4縦2ページ。共通配布版は更新しない。

## 配布ファイル

- [観光協会向け](output/pdf/SwarrowChat_観光協会向け_パンフレット_20261118.pdf)
- [ふるさと納税向け](output/pdf/SwarrowChat_ふるさと納税向け_パンフレット_20261118.pdf)

## 内容と根拠

- 観光は公開情報に基づく施設・交通・イベント案内、多言語、参照元の表示を中心に構成。リアルタイムの運行・在庫・予約確定・地図上の周遊ルートは個別連携として明記。
- ふるさと納税は公開情報の説明・手続き案内・担当窓口への誘導を中心に構成。本人の配送・申請状況の照会、住所変更、在庫・決済は個別連携。個人別の控除額判定を提供対象に含めない。
- SwarrowSiteはページ編集・承認・公開・AI反映の既存基盤を使う構成案。一般公開設定・運用を対象サイトに合わせて整備する旨を記載し、現在の試行基盤を完成済みの一般公開サービスと表現しない。
- 都城市の実績は自治体ホームページへのSwarrowChat導入として扱う。観光・ふるさと納税の専用構成の導入実績、佐藤氏による本構成の推薦、未測定の効果を掲載しない。
- 料金は対象業務・連携内容ごとの見積もり。自治体全体向け人口別料金や無料評価期間を各業務に流用しない。

製品・CMSの確認元はAXISWリポジトリの `frontend/swarrow-ai/src/types/workflow.ts`、`frontend/web-widget/src/web-widget.js`、`frontend/site-cms/src/PageEditor.tsx`、`backend/cloud_run/src/services/cms/publication.py`、`security.py`。2026年11月18日のmain差分も確認した。特定顧客の資料を使った回答検証は未実施。

既存の製品実画面・正式アイコン・図版・QRは [20261027共通版](../../revisions/20261027-chat-voice-news/brochure/README.md) を再利用。実画面のピクセルは変更せず「一般的な手続き案内の例」と明記する。質問例と構成図は説明用。Noto Sans JPで組版する。

## 再生成

Python 3、Node.js、Playwright、Google Chrome、Noto Sans JP Regular/Boldが必要。フォントの入力は `~/Library/Fonts/CodexNotoCJK/NotoSansJP-Regular.ttf` と `NotoSansJP-Bold.ttf`。このディレクトリで実行する。

```sh
python3 build.py
node render.cjs
```

Playwrightが通常のモジュール解決にない場合は `NODE_PATH` に既存のランタイムのnode_modulesを指定する。新しい依存はインストールしない。

HTML、確認用PNG、検証記録は `.build/` に保存しGit対象外。PDFは選択可能な文字とリンクを保持する。保存済みPDFを配布前に見直す。印刷機での色校正・スマートフォン実機での確認は別途。

## 検証結果

- `python3 build.py` と `node render.cjs` が成功。2ファイル各2ページ、画像読み込み、Noto Sans JPの2ウェイト、文字のはみ出し・ページ外要素の検査を通過。
- `pdfinfo` で両方ともA4・2ページを確認。`pdftotext` で本文とメールアドレスの抽出を確認。`pdfinfo -url` でリンクを確認。
- `pdffonts` でNoto Sans JPの埋め込みCID TrueTypeとUnicode対応を確認。Type 3フォントは使用しない。
- Popplerで最終PDFの全4ページを画像化し、見出し・本文・図版・フッター・ページ番号を目視確認。PDFは各約400KB。
- Webの実装・設定を変更していないため、サイト全体のビルド・テストは実施していない。専用AI定義の作成・公開、個別業務データでの回答試験、外部送信は行っていない。

配布ファイルの容量・SHA-256は `manifest.json` に記録する。
