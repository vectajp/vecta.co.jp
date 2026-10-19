export type NavItem = {
  href: string
  label: string
}

export type SiteContent = {
  title: string
  description: string
  url: string
  keywords: string
  ogImage: string
}

export type CompanyInfoItem = {
  label: string
  value: string
}

export type SectionHeading = {
  kicker: string
  title: string
}

export const site: SiteContent = {
  title: 'Vecta',
  description:
    'Vectaは、まちにある多様な知識をAIが扱える形へ整理し、公共性のあるテクノロジーで地域の未来を支えるGovTechスタートアップです。',
  url: 'https://www.vecta.co.jp',
  keywords:
    'Vecta,GovTech,自治体DX,公共AI,地域知識,ベクトル検索,ベクトルDB,RAG,AI',
  ogImage: '/ogp.png',
}

export const navItems: NavItem[] = [
  { href: 'https://swarrow.com/chat', label: 'SwarrowChat' },
  { href: 'https://swarrow.com/call', label: 'SwarrowCall' },
  { href: '/article/', label: 'ニュース' },
  { href: '/company/', label: '会社情報' },
]

export const hero = {
  title: '地域の知識を誰もが使える社会へ',
}

export const sectionHeadings: Record<
  'concept' | 'projects' | 'articles' | 'company' | 'contact',
  SectionHeading
> = {
  concept: { kicker: 'Concept', title: 'コンセプト' },
  projects: { kicker: 'Product', title: '製品概要' },
  articles: { kicker: 'News', title: 'ニュース' },
  company: { kicker: 'Company', title: '会社情報' },
  contact: { kicker: 'Contact', title: 'Vectaに相談する' },
}

export const contactLead =
  '自治体・公共領域でのAI活用、地域情報の整理、庁内ナレッジの継承など、構想段階からご相談ください。'

export const conceptParagraphs = [
  '私たちは、地域に眠るさまざまな知識を整理し、AIの力で誰もが使える形にすることで、よりよい行政サービスと暮らしの実現を支援します。',
  '自治体の現場に寄り添い、実用的なAIの社会実装に取り組み、持続可能な地域社会の発展に貢献します。',
]

export const companyDetails: CompanyInfoItem[] = [
  { label: '会社名', value: '株式会社Vecta' },
  { label: '代表者', value: '宮川直也' },
  { label: '設立', value: '2025年4月' },
  {
    label: '所在地',
    value: '〒150-0002 東京都渋谷区渋谷2-19-15 宮益坂ビルディング609',
  },
  {
    label: '事業内容',
    value: '自治体・公共領域向けAIサービスの企画・開発・運用支援',
  },
]

export const representativeProfile = {
  name: '宮川直也',
  role: '株式会社Vecta 代表',
  photo: '/assets/naoya-miyagawa.jpg',
  paragraphs: [
    '官公庁・医療機関・法人向けの営業職を経て、ソフトウェアエンジニアへ転向。独立後は地方公共団体向けシステムを継続的に開発し、モバイル・Web・IoT・ヘルスケア領域で企画から開発、運用までを手がける。個人開発したモバイルアプリは累計20万ダウンロード以上。',
    '現在はSwarrowChat、SwarrowCallなどのAI製品の企画・設計・開発を主導。RAGやリアルタイム音声、外部システムとの連携、回答品質の評価、権限制御や承認を含む運用設計までを扱う。',
    '企業・自治体向けのAI研修、導入支援、技術顧問にも取り組む。既存システムの改修やAIを使用しない業務改善も含めて選択肢を比較し、導入後の定着・評価まで支援している。',
  ],
  activities: [
    '官公庁・地方公共団体向けシステムの開発',
    'SwarrowChat・SwarrowCallの企画・開発',
    'RAG・リアルタイム音声AI・業務AI基盤の開発',
    '法人・自治体向けAI研修、導入支援、技術顧問',
  ],
}
