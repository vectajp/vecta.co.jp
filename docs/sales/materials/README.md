# 共通営業資料の編集元

配布ファイルは [files](files/) にまとめ、[営業資料一覧](../README.md) と [current.json](current.json) から最新版を確認できます。現在の共通営業資料は [11月25日版v5](revisions/20261125-service-overview/README.md)、概算見積書ひな形は同日版v13です。

## ファイル名と版番号

- 配布ファイル名は `YYYYMMDD_内容_v番号.拡張子` とします。例: `20261125_Swarrowサービス紹介_v5.pdf`。
- 日付は資料の作成・改訂日です。保存・コミットした日付へ付け替えません。
- 同じ資料は日付をまたいで版番号を引き継ぎます。サービス紹介はv4→v5、見積ひな形はv12→v13です。
- 用途別パンフレットは資料ごとに連番を管理します。従来の`r番号`は`v番号`へ揃え、番号なしの初版をv1としています。
- 同内容のPDFとPowerPointは同じ日付・内容・版番号にし、拡張子で区別します。
- 「メール添付用」など配布方法による呼び名を付けず、旧版も同じフォルダに保持します。

## 保存するファイル

- 配布するPDF・PowerPoint・Excel本体を `files/` に保存し、Gitへコミットします。
- パンフレットの組版ソース・実画面・写真・図版は改訂ディレクトリの [brochure](revisions/20261027-chat-voice-news/brochure/README.md) に保存しています。
- 旧版v4の編集元はPowerPointです。新しいサービス紹介v5は受領したPDFを保存しています。見積ひな形はExcelの数式・書式を保持します。
- 確認用PNG、一時PDF、作業ログ、実行環境はGit管理外です。

## 改訂時の手順

1. 最新版を基に必要な内容を更新し、改訂記録用のディレクトリを作ります。
2. PDF全ページとPowerPointの変更箇所を確認し、料金・注釈・文字・リンク・画像の縦横比を検証します。
3. 確認した配布ファイルを `files/` に日付・内容・版番号で保存します。既存資料を内容変更なしで整理する場合は、変更前後のSHA-256一致を確認します。
4. 改訂ディレクトリの `manifest.json`、`current.json`、[営業資料一覧](../README.md)を同じ版に揃え、ファイル本体と編集元をコミットします。

10月27日版の再生成スクリプトは `.build/` に出力します。配布済みのファイルは直接上書きせず、確認後に次の版番号で `files/` へ保存します。

## PDFの表示互換性

Chromeの直接出力に半透明の影やSVGフィルターが残ると、AppleのPDF描画で画像の周囲に四角い背景が出ることがあります。配布版は共通パンフレットで採用済みの非透過背景と元の文字・リンクを組み合わせる方式に揃えます。

`export-compatible-pdf.py` はA4・1055×1491pxのパンフレット用です。Chromeの元PDFと、本文の字形だけを隠して同じ位置・倍率で撮影した各ページの非透過JPEG（`background-1.jpg` から連番）を渡します。影・写真・製品実画面・図版はブラウザーで合成し、本文は画像に焼き込みません。文字が画像に覆われる構成や透明文字には使用しません。旧版の編集・配布済みPDFは変更しません。

```sh
python3 export-compatible-pdf.py native.pdf background-directory compatible.pdf
swift render-coregraphics.swift compatible.pdf tmp/quartz
pdftoppm -scale-to 1250 -png compatible.pdf tmp/poppler
```

Pythonの既存PDF工程と同じ `pymupdf`・`pypdf`、macOSのSwift、Popplerが必要です。書き出し時に本文と字形の座標・色、リンクとその座標、透明マスク・透明グループがゼロであることを検査します。失敗した出力は配布先に保存しません。CoreGraphicsとPoppler双方で全ページを目視し、`pdftotext`・`pdffonts`・`pdfinfo -url` も確認します。

Webの変更はルートの [DESIGN.md](../../../DESIGN.md) と [公開手順](../../site-workspace.md)に従います。
