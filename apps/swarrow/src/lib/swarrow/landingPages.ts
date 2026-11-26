export const landingPages = {
  line: {
    title: "LINEで相談と案内",
    pageTitle: "LINE連携｜自治体のLINE公式アカウントとAI窓口を連携 | Swarrow",
    lead: "自治体のLINE公式アカウントで、質問への回答と必要な情報の案内を支援します。",
    image: "/line/hero.webp",
    imageWidth: 1536,
    imageHeight: 1024,
    imageAlt: "LINEで手続きを質問する住民と案内する職員のイラスト",
    caption: "LINE連携の利用イメージ",
    featureTitle: "LINEでできること",
    features: [
      {
        icon: "chat",
        title: "質問に答える",
        body: "ホームページやFAQなど、自治体の公式情報をもとに回答します。",
      },
      {
        icon: "announce",
        title: "情報を届ける",
        body: "LINE公式アカウントから、必要な案内や連絡事項を送信します。",
      },
      {
        icon: "review",
        title: "記録を見直す",
        body: "質問と回答の記録を確認し、参照情報や応答ルールの改善に活かします。",
      },
    ],
    flowTitle: "既存のLINE公式アカウントと連携",
    flowBody:
      "LINE公式アカウントの設定と案内する情報を確認し、自治体の運用に合わせて個別に連携します。",
    stages: ["対象を確認", "情報と応答を設定", "検証して運用"],
  },
  cms: {
    title: "自治体ホームページCMS",
    pageTitle: "SwarrowSite｜自治体ホームページCMS | Swarrow",
    lead: "原稿の作成・承認・公開をひとつの画面で管理し、ホームページとAI窓口へ反映します。",
    image: "/cms/management.jpg",
    imageWidth: 1440,
    imageHeight: 900,
    imageAlt:
      "原稿のタイトル・担当部署・承認状態を一覧で確認できるSwarrowSiteの管理画面",
    caption: "SwarrowSiteの原稿管理画面",
    featureTitle: "ホームページの更新をまとめて管理",
    features: [
      {
        icon: "document",
        title: "原稿・画像・PDFを編集",
        body: "見出し、表、リンク、画像やPDFを使って、職員が原稿を作成・更新します。",
      },
      {
        icon: "approval",
        title: "承認してから公開",
        body: "下書き・承認依頼・承認・公開を分け、部署や職員ごとに操作権限を設定できます。",
      },
      {
        icon: "publish",
        title: "ホームページとAI窓口へ反映",
        body: "承認した情報をホームページに公開し、AI窓口の参照情報にも反映します。",
      },
    ],
    flowTitle: "職員の確認を挟んで公開",
    flowBody:
      "AIに構成・文言・配置を相談し、提案を確認して下書きへ適用できます。保存と公開は職員が操作します。",
    stages: ["下書き", "承認依頼", "承認", "公開・AI反映"],
  },
} as const;

export type LandingId = keyof typeof landingPages;
export type FeatureIcon =
  (typeof landingPages)[LandingId]["features"][number]["icon"];
