export const inquiryProducts = {
  chat: 'SwarrowChat',
  call: 'SwarrowCall',
  line: 'SwarrowPost',
  cms: 'SwarrowSite',
} as const

export type InquiryProduct = keyof typeof inquiryProducts
