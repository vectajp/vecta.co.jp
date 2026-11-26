import { error } from '@sveltejs/kit'
import {
  type InquiryProduct,
  inquiryProducts,
} from '@vecta/site-content/inquiries'
import type { PageLoad } from './$types'

export const entries = () =>
  Object.keys(inquiryProducts).map((product) => ({ product }))

export const load = (({ params }): { product: InquiryProduct } => {
  if (!Object.hasOwn(inquiryProducts, params.product)) error(404, 'Not found')
  return { product: params.product as InquiryProduct }
}) satisfies PageLoad
