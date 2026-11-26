export const inquiryProducts = {
  chat: 'SwarrowChat',
  call: 'SwarrowCall',
  line: 'LINE連携',
  cms: 'SwarrowSite',
} as const

export type InquiryProduct = keyof typeof inquiryProducts
