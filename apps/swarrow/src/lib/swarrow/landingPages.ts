export const landingPages = {
  line: {
    title: "自治体LINE運用システム",
    pageTitle: "SwarrowPost｜自治体LINE運用システム | Swarrow",
    lead: "お知らせの作成・承認・配信とリッチメニューの編集をひとつの管理画面で行えます。",
    image: "/line/delivery.jpg",
    imageWidth: 1248,
    imageHeight: 720,
    heroImage: "/devices/post-desktop-phone-v4.webp",
    heroBackground: "/line/hero-neighborhood-desktop-v2.webp",
    heroBackgroundMobile: "/line/hero-neighborhood-mobile-v2.webp",
    heroImageAlt:
      "PCでお知らせを編集して配信内容を確認し、スマートフォンのLINEに表示するSwarrowPostのイメージ",
    caption: "配信管理とLINE受信のイメージ",
    featureTitle: "LINE公式アカウントの運用を管理",
    features: [
      {
        icon: "announce",
        title: "お知らせを作成・配信",
        body: "配信本文やカードを作成し、プレビューで表示を確認して住民へ案内します。",
      },
      {
        icon: "approval",
        title: "承認と配信権限を管理",
        body: "下書き・承認・配信を分け、担当職員の権限に応じて作業を進められます。",
      },
      {
        icon: "publish",
        title: "リッチメニューを編集",
        body: "画像のタップ範囲と動作を設定し、手続きやお知らせへの入り口を整理します。",
      },
    ],
    flowTitle: "配信内容を確認してから送信",
    flowBody:
      "下書きと試験配信で内容を確認し、承認を経て住民向けの配信を管理します。",
    stages: ["下書き", "試験配信", "承認", "配信"],
  },
  cms: {
    title: "自治体ホームページCMS",
    pageTitle: "SwarrowSite｜自治体ホームページCMS | Swarrow",
    lead: "部品の配置やサイズを調整し、ホームページを柔軟に構成できます。原稿の承認・公開とAI窓口への反映も管理します。",
    image: "/cms/management.jpg",
    imageWidth: 1440,
    imageHeight: 900,
    heroImage: "/devices/site-desktop-v4.webp",
    heroBackground: "/cms/hero-riverside-desktop-v2.webp",
    heroBackgroundMobile: "/cms/hero-riverside-mobile-v2.webp",
    heroImageAlt:
      "中央のホームページを確認しながらページ構成と表示設定を編集するSwarrowSiteのイメージ",
    caption: "SwarrowSiteのホームページ編集イメージ",
    featureTitle: "ホームページの更新をまとめて管理",
    features: [
      {
        icon: "layout",
        title: "部品の配置とサイズを設定",
        body: "部品を組み合わせ、列数・間隔・余白を調整します。PC・スマホそれぞれの表示も設定できます。",
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
      "担当部署で作成した原稿を承認し、公開担当者がホームページとAI窓口へ反映します。保存しただけで住民向けに公開されることはありません。",
    stages: ["下書き", "承認依頼", "承認", "公開・AI反映"],
  },
} as const;

export type LandingId = keyof typeof landingPages;
export type FeatureIcon =
  | "chat"
  | "announce"
  | "review"
  | "document"
  | "layout"
  | "approval"
  | "publish";
