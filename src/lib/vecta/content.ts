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
  { href: '#concept', label: 'コンセプト' },
  { href: '#projects', label: '製品概要' },
  { href: '#articles', label: 'ニュース' },
  { href: '#company', label: '会社概要' },
  { href: '#contact', label: 'お問い合わせ' },
]

export const hero = {
  title: 'まちの知識を、未来につなぐ',
  subtitle:
    '紙、PDF、音声、画像、経験。地域に眠る知識をAIが扱える形に整え、誰もが必要な情報へ届く社会をつくる。それがVectaのミッションです。',
}

export const contact = {
  kicker: 'Contact',
  title: 'Vectaに相談する',
  lead: '自治体・公共領域でのAI活用、地域情報の整理、庁内ナレッジの継承など、構想段階からご相談ください。',
}

export const conceptParagraphs = [
  '公共に必要な情報ほど、紙、PDF、画像、音声、経験知としてさまざまな場所に分散しています。Vectaは、それらをベクトルデータとして整理し、AIが意味や文脈で探せる知識基盤へ変えていきます。',
  '私たちがつくりたいのは、人を置き換えるAIではありません。人の判断を支え、日々の不安を減らし、地域の知識を次の世代へつなぐ。そんな、誰もが使えるAIを育てていきます。',
]

export const companyDetails: CompanyInfoItem[] = [
  { label: '会社名', value: '株式会社Vecta' },
  { label: '代表者', value: '宮川直也' },
  { label: '設立', value: '2025年4月' },
  {
    label: '所在地',
    value: '〒150-0002 東京都渋谷区渋谷2-19-15 宮益坂ビルディング609',
  },
]
