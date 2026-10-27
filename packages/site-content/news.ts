export const newsCategories = [
  '導入・採択',
  'メディア掲載',
  '機能アップデート',
  '開発レポート',
  'コラム',
  'お知らせ',
] as const

export type NewsCategory = (typeof newsCategories)[number]

export const productNews = (
  [
    {
      slug: 'miyakonojo-ai-window-launch-202610',
      image: '/assets/municipal-ai-window-editorial.webp',
      imageAlt: '自治体ホームページのAI窓口で質問する利用者のイラスト',
      imageWidth: 1672,
      imageHeight: 941,
      date: '2026-10-01',
      category: '導入・採択',
      title:
        '都城市公式ホームページでSwarrowChatを活用したAI相談窓口の運用が始まりました',
      description:
        '2026年10月1日、都城市公式ホームページでAI相談窓口の運用を開始しました。公式情報をもとに、チャットや音声で手続き・暮らしに関する質問を受け付けます。',
      products: ['chat'],
    },
    {
      slug: 'swarrowchat-voice-navigation-202610',
      image: '/assets/swarrowchat-voice.webp',
      imageAlt: 'スマートフォンに話しかけて相談する利用者のイラスト',
      imageWidth: 1983,
      imageHeight: 793,
      date: '2026-10-06',
      category: '機能アップデート',
      title: 'SwarrowChatの音声会話と参照元ページへの移動を改善しました',
      description:
        '2026年10月4日から6日の更新で、スマートフォンでの音声入力の制御と、全画面表示中に参照元ページを開く際の動作を改善しました。',
      products: ['chat'],
    },
    {
      slug: 'miyakonojo-digital-gyosei-2026',
      image: '/assets/municipal-ai-window-editorial.webp',
      imageAlt: '自治体ホームページのAI窓口で質問する利用者のイラスト',
      imageWidth: 1672,
      imageHeight: 941,
      date: '2026-10-01',
      category: 'メディア掲載',
      title: '都城市のAI窓口の取り組みが「デジタル行政」で紹介されました',
      description:
        '2026年10月1日公開の佐藤泰格氏による寄稿で、SwarrowChatを活用した都城市のAI窓口の仕組みと実証の狙いが紹介されています。',
      products: ['chat'],
    },
    {
      slug: 'swarrowchat-usage-report-202607',
      image: '/assets/swarrowchat-analytics-editorial.webp',
      imageAlt: '質問と資料を整理し、利用状況を確認する仕組みのイラスト',
      imageWidth: 1672,
      imageHeight: 941,
      date: '2026-07-27',
      category: '開発レポート',
      title: 'SwarrowChatの利用状況と回答評価を確認するレポートを開発',
      description:
        '日別・時間帯別の利用状況と回答への評価を確認する管理機能を開発。2026年7月に行った、案内内容の改善につなげる集計機能の実装を紹介します。',
      products: ['chat'],
    },
    {
      slug: 'swarrowchat-question-categories-202610',
      image: '/assets/swarrowchat-analytics-editorial.webp',
      imageAlt: '問い合わせをテーマごとに整理する仕組みのイラスト',
      imageWidth: 1672,
      imageHeight: 941,
      date: '2026-10-01',
      category: '開発レポート',
      title: 'SwarrowChatの質問を分類して問い合わせ傾向を確認する機能を開発',
      description:
        '業務に合わせた分類項目の設定、新しい質問の自動分類、カテゴリ別の集計を実装。2026年10月の開発内容を紹介します。',
      products: ['chat'],
    },
    {
      slug: 'swarrowchat-widget-layout-202609',
      image: '/assets/swarrowchat-wide.webp',
      imageAlt: 'SwarrowChatの回答と参照資料を並べて確認する画面',
      imageWidth: 980,
      imageHeight: 760,
      date: '2026-09-18',
      category: '開発レポート',
      title: 'SwarrowChatの配置・サイズ変更とスマートフォン表示を改善',
      description:
        '2026年9月の開発で、チャット画面の移動、8方向のサイズ変更、スマートフォンの表示領域に合わせたレイアウトを見直しました。',
      products: ['chat'],
    },
    {
      slug: 'swarrowchat-multilingual-guide-202610',
      image: '/assets/municipal-ai-window-editorial.webp',
      imageAlt: 'スマートフォンから自治体の情報を尋ねる利用者のイラスト',
      imageWidth: 1672,
      imageHeight: 941,
      date: '2026-07-20',
      category: '開発レポート',
      title: 'SwarrowChatの多言語自動応答を開発',
      description:
        '2026年7月20日、質問の言語に合わせて回答する設定を実装し、検証環境で動作を確認しました。自治体情報を多言語で案内するための開発を紹介します。',
      products: ['chat'],
    },
    {
      slug: 'swarrowchat-website-updates-202604',
      image: '/assets/swarrowchat-wide.webp',
      imageAlt: '自治体の公式資料を参照して案内するSwarrowChatの画面',
      imageWidth: 980,
      imageHeight: 760,
      date: '2026-04-24',
      category: '開発レポート',
      title: '自治体ホームページの新着情報を定期的に取り込む機能を開発',
      description:
        '2026年4月24日、ホームページの定期取得とスケジュール管理を実装しました。新しいページをAIの参照情報に追加するための開発を紹介します。',
      products: ['chat'],
    },
    {
      slug: 'swarrowcall-response-latency-202604',
      image: '/assets/swarrowcall-service.webp',
      imageAlt: '電話で質問する利用者とAIによる情報検索のイラスト',
      imageWidth: 1586,
      imageHeight: 992,
      date: '2026-04-30',
      category: '開発レポート',
      title: 'SwarrowCallの電話応答の待ち時間を減らす取り組み',
      description:
        '通話開始時の準備と発話中の先行検索により、回答までの待ち時間を減らす処理を開発。2026年4月に行った実装を紹介します。',
      products: ['call'],
    },
    {
      slug: 'swarrowcall-phone-transfer-202605',
      image: '/assets/swarrowcall-service.webp',
      imageAlt: 'AIが電話の問い合わせを受け付ける流れのイラスト',
      imageWidth: 1586,
      imageHeight: 992,
      date: '2026-05-30',
      category: '開発レポート',
      title: 'SwarrowCallでAIが受けた電話を担当先へ取り次ぐ機能を開発',
      description:
        'AIによる一次受付後に、担当先へ電話と用件を引き継ぐ機能を開発。2026年5月の電話転送・引継ぎ処理の実装を紹介します。',
      products: ['call'],
    },
    {
      slug: 'miyakonojo-ai-window-nhk',
      image: '/assets/municipal-ai-news-scene.webp',
      imageAlt:
        'キャスターがテキストチャットと音声会話のAI窓口を紹介するイラスト',
      imageWidth: 1860,
      imageHeight: 846,
      date: '2026-10-17',
      category: 'メディア掲載',
      title: '都城市のAI相談窓口がNHK「てげビビ！サタデー」で紹介されました',
      description:
        'SwarrowChatを活用した都城市のAI相談窓口が、2026年10月17日放送のNHK宮崎放送局「てげビビ！サタデー」で紹介されました。',
      products: ['chat'],
    },
    {
      slug: 'miyakonojo-dx-challenge-2026',
      image: '/assets/swarrowchat-wide.webp',
      imageAlt: 'SwarrowChatの回答と参照資料を確認する画面',
      imageWidth: 980,
      imageHeight: 760,
      date: '2026-08-03',
      category: '導入・採択',
      title: 'SwarrowChatが都城市DXチャレンジプロジェクトに採択されました',
      description:
        '都城市は2026年8月3日、Vectaが提案した自治体ホームページAI窓口プロジェクトを令和8年度の第1号案件として採択したことを公表しました。',
      products: ['chat'],
    },
  ] as const
).toSorted((a, b) => b.date.localeCompare(a.date))

export const articleUrl = (slug: string) =>
  `https://www.vecta.co.jp/article/${slug}/`
