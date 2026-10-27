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

Webの変更はルートの [DESIGN.md](../../../DESIGN.md) と [公開手順](../../site-workspace.md)に従います。
