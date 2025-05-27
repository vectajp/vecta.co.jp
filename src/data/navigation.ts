export interface NavigationItem {
  href: string
  label: string
}

export const navigationItems: NavigationItem[] = [
  { href: '#articles', label: 'ニュース' },
  { href: '#company', label: '会社概要' },
  { href: '#projects', label: 'プロジェクト' },
  { href: '#contact', label: 'お問い合わせ' },
]
