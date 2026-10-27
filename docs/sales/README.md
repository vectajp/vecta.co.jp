# 営業資料

SwarrowChat・SwarrowCallの現在の配布版は以下の4ファイルです。2026年10月27日版r4に統一し、PDF・PowerPoint本体もGitで管理しています。

|資料|用途|最新版|
|---|---|---|
|SwarrowChat パンフレット|紹介・メール添付・印刷配布|[PDF・2ページ](materials/revisions/20261027-chat-voice-news/output/pdf/SwarrowChat_パンフレット_20261027_r4.pdf)|
|SwarrowChat パンフレット 料金別紙付き|庁内の導入・費用検討|[PDF・3ページ](materials/revisions/20261027-chat-voice-news/output/pdf/SwarrowChat_パンフレット_料金別紙付き_20261027_r4.pdf)|
|Swarrow 商談用営業資料|Chat・AI受電・AI架電の説明|[PDF・15ページ](materials/revisions/20261027-chat-voice-news/output/pdf/Swarrow_商談用営業資料_20261027_r4.pdf) / [PowerPoint・15枚](materials/revisions/20261027-chat-voice-news/output/pptx/Swarrow_商談用営業資料_20261027_r4.pptx)|

各ファイルのパス・容量・SHA-256は [materials/current.json](materials/current.json)、変更点と検証内容は [改訂記録](materials/revisions/20261027-chat-voice-news/README.md) に記録しています。PDFの文字・リンク、PowerPointの編集可能な文字・表を保持しています。

## 共通の掲載内容

- 都城市の導入事例とNHK宮崎放送局「てげビビ！サタデー」での紹介を掲載。放送画面は、テキストチャットと音声会話の両方を示すイメージイラストに差し替えています。
- 事例画像と佐藤氏のプロフィールは左右同じ幅に配置。国のアドバイザー名称は使わず、都城市の所属・役職を掲載しています。
- 人口10万人以下の自治体はChat月額5万円・初期費用10万円（税別）。音声会話は別途料金。料金別紙と営業資料は月額2.5万円の音声オプションと初年度・次年度の費用例を掲載しています。
- Web上の音声会話とSwarrowCallの電話機能を区別し、都城市の実績はSwarrowChatの導入事例として扱います。

## 更新先

- 配布資料・編集元: [materials](materials/README.md)
- SwarrowChat LP: [apps/swarrow/src/routes/chat/+page.svelte](../../apps/swarrow/src/routes/chat/+page.svelte)
- SwarrowCall LP: [apps/swarrow/src/routes/call/+page.svelte](../../apps/swarrow/src/routes/call/+page.svelte)
- 共通ニュース: [packages/site-content/news.ts](../../packages/site-content/news.ts)
- NHK紹介記事: [MiyakonojoAiWindowNhk.svelte](../../src/lib/articles/posts/MiyakonojoAiWindowNhk.svelte)

旧HTML版、2026年9月28日の13枚版、10月19日の専用4ページ版・商談用14枚版、10月20〜22日のパンフレットは検討・送付履歴です。最新版として再配布する場合は上記を使用してください。個別自治体向けの提案書・見積書は固有条件を含むため、この共通版で上書きしません。
