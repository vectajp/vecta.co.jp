# パンフレットの編集元

配布版r4と同じ文字・配置・画像を再生成するためのソースです。画像生成で実画面や佐藤氏の写真を描き直さず、保存済み素材を配置しています。素材のハッシュは `asset-manifest.json` に記録しています。ニュースイラストは `../assets/news-illustration.png` を共用します。

## 必要な環境

- macOSのHiragino Sans W4/W6/W8、Google Chrome
- Python: `pypdf`、`pymupdf`
- Node.jsとPlaywright（`NODE_PATH` または通常のモジュール解決で参照可能にする）
- Popplerの `pdftotext`

## 再生成

このディレクトリで順番に実行します。

```sh
python3 build-brochure.py
node render-brochure.cjs
python3 export-native-pdf.py
node render-backgrounds.cjs
python3 export-compatible-pdf.py
```

`build-brochure.py` がHTML・CSSを生成します。`render-brochure.cjs` は画像・フォント・文字のはみ出しを検査し、元PDFとプレビューを保存します。

配布用の軽量PDFは `output/pdf/SwarrowChat_パンフレット_軽量版.pdf` です。背景を非透過画像にまとめ、元の文字と5つのリンクを保持することで、スマホのPDFビューアーで画像周辺に矩形が出る問題を避けています。変更後はApple CoreGraphicsとPopplerで表示を確認してください。

生成物は配布済みPDFを自動で上書きしません。確認したPDFを次の改訂版へ保存し、ファイルのハッシュと最新版一覧を更新してください。
