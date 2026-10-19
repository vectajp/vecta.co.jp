import { env } from '$env/dynamic/public'

export const siteHref = (href: string) => {
  if (import.meta.env.DEV && href.startsWith('https://swarrow.com/')) {
    return new URL(
      new URL(href).pathname,
      env.PUBLIC_SWARROW_SITE_BASE_URL || 'http://127.0.0.1:4326',
    ).href
  }
  return href.startsWith('#') ? `/${href}` : href
}
