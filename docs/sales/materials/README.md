# 共通営業資料の編集元

配布ファイルは [営業資料一覧](../README.md)、最新版のパス・ハッシュは [current.json](current.json) を参照してください。現在の版は [20261027-chat-voice-news](revisions/20261027-chat-voice-news/README.md) です。

## 保存するファイル

- 配布するPDF・PowerPoint本体を改訂ディレクトリの `output/pdf/` と `output/pptx/` に保存し、Gitへコミットします。
- パンフレットの組版ソース・実画面・写真・図版は同ディレクトリの [brochure](revisions/20261027-chat-voice-news/brochure/README.md) に保存しています。
- 商談用資料の編集元は配布用PowerPointです。文字・表を編集できます。既存の改訂スクリプトは改訂時の記録として保持しています。
- 確認用PNG、一時PDF、作業ログ、実行環境はGit管理外です。

## 改訂時の手順

1. 最新版を基に別の改訂ディレクトリを作り、必要な内容を更新します。
2. PDF全ページとPowerPointの変更箇所を確認し、料金・注釈・文字・リンク・画像の縦横比を検証します。
3. 配布ファイルを保存し、改訂ディレクトリの `.gitignore` に対象PDF・PowerPointの許可を追加します。
4. `manifest.json`、`current.json`、[営業資料一覧](../README.md)を同じ版に揃え、ファイル本体と編集元をコミットします。

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
