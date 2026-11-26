# 営業資料

営業資料と概算見積書ひな形は [materials/files](materials/files/) にまとめています。ファイル名は `YYYYMMDD_内容_v番号.拡張子` に統一し、同じ資料の更新では日付が変わっても版番号を引き継ぎます。

## 最新の共通資料

| 資料 | 更新日・版 | ファイル |
| --- | --- | --- |
| Swarrowサービス紹介 | 2026年11月25日 v5 | [PDF・24ページ](materials/files/20261125_Swarrowサービス紹介_v5.pdf) |
| Swarrow概算見積書ひな形 | 2026年11月25日 v13 | [Excel・4シート](materials/files/20261125_Swarrow概算見積書ひな形_v13.xlsx) |

サービス紹介v5は、これまでGitで管理していた商談用営業資料v4の後継です。制作時のファイル名に付いていた「メール添付用」は保存名に付けていません。見積ひな形はChat単体・CMS単体・LINE単体・セット版を収録し、v12からv13への連番を維持しています。

ファイルの容量・ページ数・SHA-256は [materials/current.json](materials/current.json)、新しい資料の元ファイルと引継ぎ関係は [11月25日版の記録](materials/revisions/20261125-service-overview/README.md) に記録しています。

## 用途別の営業パンフレット

2026年11月18日作成・19日改訂のv10です。共通のサービス紹介とは別の資料として版を管理します。

- [観光協会向け・2ページ](materials/files/20261119_SwarrowChat観光協会向けパンフレット_v10.pdf)
- [ふるさと納税担当課・運営事業者向け・2ページ](materials/files/20261119_SwarrowChatふるさと納税向けパンフレット_v10.pdf)
- [内容・編集元・検証](materials/verticals/20261118/README.md)

## 旧版

配布済みの内容を保持し、保存場所とファイル名を整理しています。PDFとPowerPointで同じ内容のものは同じ版番号です。

| 資料 | 更新日・版 | ファイル |
| --- | --- | --- |
| Swarrowサービス紹介 | 2026年10月27日 v4 | [PDF・15ページ](materials/files/20261027_Swarrowサービス紹介_v4.pdf) / [PowerPoint・15枚](materials/files/20261027_Swarrowサービス紹介_v4.pptx) |
| SwarrowChatパンフレット | 2026年10月27日 v4 | [PDF・2ページ](materials/files/20261027_SwarrowChatパンフレット_v4.pdf) |
| SwarrowChatパンフレット料金別紙付き | 2026年10月27日 v4 | [PDF・3ページ](materials/files/20261027_SwarrowChatパンフレット料金別紙付き_v4.pdf) |
| Swarrow概算見積書ひな形 | 2026年11月24日 v12 | [Excel](materials/files/20261124_Swarrow概算見積書ひな形_v12.xlsx) / [PDF・4ページ](materials/files/20261124_Swarrow概算見積書ひな形_v12.pdf) |

新しいサービス紹介v5はPDFです。PowerPointは旧版v4の編集元として保持しています。用途別パンフレットのv1〜v9も [同じ配布フォルダ](materials/files/) に保存しています。

個別自治体向けの提案書・見積書は固有条件を含むため、共通ひな形で上書きしません。

## 更新先

- 配布ファイル・編集元: [materials](materials/README.md)
- SwarrowChat LP: [apps/swarrow/src/routes/chat/+page.svelte](../../apps/swarrow/src/routes/chat/+page.svelte)
- SwarrowCall LP: [apps/swarrow/src/routes/call/+page.svelte](../../apps/swarrow/src/routes/call/+page.svelte)
- 共通ニュース: [packages/site-content/news.ts](../../packages/site-content/news.ts)
- NHK紹介記事: [MiyakonojoAiWindowNhk.svelte](../../src/lib/articles/posts/MiyakonojoAiWindowNhk.svelte)
