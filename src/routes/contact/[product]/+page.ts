import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const entries = () => [{ product: 'chat' }, { product: 'call' }]

export const load = (({ params }): { product: 'chat' | 'call' } => {
  const product = params.product
  if (product !== 'chat' && product !== 'call') error(404, 'Not found')
  return { product }
}) satisfies PageLoad
