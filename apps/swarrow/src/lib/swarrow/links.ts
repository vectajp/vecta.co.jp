import { env } from "$env/dynamic/public";

export const vectaHref = (href: string) =>
  import.meta.env.DEV &&
  env.PUBLIC_CONTACT_FORM_BASE_URL &&
  href.startsWith("https://www.vecta.co.jp/")
    ? new URL(new URL(href).pathname, env.PUBLIC_CONTACT_FORM_BASE_URL).href
    : href;
