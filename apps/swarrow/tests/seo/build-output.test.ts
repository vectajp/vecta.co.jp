/// <reference types="bun" />
// cspell:ignore googletagmanager

import { beforeAll, describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import {
  productJsonLd,
  products,
  site,
  siteName,
  siteOgImage,
} from "../../src/lib/swarrow/content";

let html = "";
let chatHtml = "";
let callHtml = "";
let privacyHtml = "";
let robots = "";
let sitemap = "";
let modalSource = "";
let pageSource = "";
let layoutSource = "";

const countMatches = (value: string, pattern: RegExp) =>
  Array.from(value.matchAll(pattern)).length;

const headingLevels = (source: string) =>
  Array.from(source.matchAll(/<h([1-6])\b/g), (match) => Number(match[1]));

const hasNoHeadingLevelSkips = (levels: number[]) => {
  let deepestSeen = 0;
  for (const level of levels) {
    if (level > deepestSeen + 1) return false;
    deepestSeen = Math.max(deepestSeen, level);
  }
  return true;
};

const metaContentOf = (
  source: string,
  kind: "name" | "property",
  key: string,
) =>
  source.match(
    new RegExp(`<meta ${kind}="${key}" content="([^"]*)"\\s*\\/?>`),
  )?.[1];

beforeAll(async () => {
  [
    html,
    chatHtml,
    callHtml,
    privacyHtml,
    robots,
    sitemap,
    modalSource,
    pageSource,
    layoutSource,
  ] = await Promise.all([
    Bun.file("build/index.html").text(),
    Bun.file("build/chat.html").text(),
    Bun.file("build/call.html").text(),
    Bun.file("build/privacy/index.html").text(),
    Bun.file("build/robots.txt").text(),
    Bun.file("build/sitemap.xml").text(),
    Bun.file("src/lib/swarrow/ContactModal.svelte").text(),
    Bun.file("src/routes/+page.svelte").text(),
    Bun.file("src/routes/+layout.svelte").text(),
  ]);
});

describe("Swarrow and Vecta brand roles", () => {
  test("keeps the Swarrow header and uses the linked Vecta company footer", () => {
    expect(html).toContain('content="Swarrow"');
    expect(html).toContain('src="/swarrow/icon.png"');
    expect(html).toContain('class="brand-name');
    expect(html).not.toContain('src="/swarrow/logo.svg"');
    expect(html).not.toContain('src="/swarrow/footer-logo.svg"');

    const footer = html.match(/<footer[^>]*>[\s\S]*?<\/footer>/)?.[0] ?? "";
    expect(footer).toContain('src="/vecta/logo_horizontal.svg"');
    expect(footer).toContain('href="https://www.vecta.co.jp"');
    expect(footer).toContain('aria-label="Vectaのウェブサイトへ"');
    expect(footer).not.toContain("地域の知識を誰もが使える社会へ");
    expect(footer).toContain("〒150-0002");
    expect(footer).toContain("東京都渋谷区渋谷2-19-15");
    expect(footer).toContain("宮益坂ビルディング609");
    expect(footer).not.toContain("サイトマップ");
    expect(footer).not.toContain("https://www.vecta.co.jp/#concept");
    expect(footer).not.toContain("https://www.vecta.co.jp/#projects");
    expect(footer).not.toContain("https://www.vecta.co.jp/#articles");
    expect(footer).not.toContain("https://www.vecta.co.jp/#company");
    expect(footer).toMatch(/© \d{4} Vecta\. All rights reserved\./);
    expect(footer).not.toContain("Swarrow");

    // ヘッダー・フッターは +layout.svelte 由来になったが、HTML 出力自体は変わらない。
    expect(layoutSource).toContain("<header");
    expect(layoutSource).toContain("<footer");
    expect(layoutSource).not.toContain("sc-cta");
    expect(layoutSource).not.toContain("導入について相談する");
  });

  test("uses a municipal organization label without changing request fields", () => {
    expect(modalSource).toContain("自治体・団体名");
    expect(modalSource).toContain("資料ダウンロード");
    for (const field of [
      "companyName",
      "department",
      "name",
      "email",
      "inquiry",
      "turnstileToken",
    ]) {
      expect(modalSource).toContain(field);
    }
    expect(modalSource).not.toContain("nameKana");
    expect(modalSource).not.toContain("ふりがな");
    expect(modalSource).toContain("FALLBACK_DOWNLOAD_REQUEST_API_URL");
  });

  test("keeps required marks beside their field labels", () => {
    expect(countMatches(modalSource, /class="field-label"/g)).toBe(5);
    expect(
      countMatches(
        modalSource,
        /class="field-label">[\s\S]*?class="required"/g,
      ),
    ).toBe(3);
    expect(modalSource).toContain("white-space: nowrap");
  });

  test("centers compact controls with a three-line inquiry", () => {
    expect(modalSource).toContain('rows="3"');
    expect(modalSource).toContain("max-width: 440px");
    expect(modalSource).toContain("margin-inline: auto");
    expect(modalSource).toContain("box-sizing: border-box");
  });
});

describe("answer-quality Hero", () => {
  test("renders one concrete H1 without unsolicited subtitles or hero buttons", () => {
    expect(countMatches(html, /<h1\b/g)).toBe(1);
    const hero = html.match(
      /<section class="hero[^>]*>([\s\S]*?)<\/section>/,
    )?.[1];
    expect(hero).toContain("自治体のAIチャットボットとAIコールセンター");
    expect(hero).not.toMatch(/hero-sub|hero-eyebrow|<button|hero-primary/);
    expect(hero).not.toContain("フルチューニング。");
  });

  test("never skips a heading level", () => {
    expect(hasNoHeadingLevelSkips(headingLevels(html))).toBe(true);
  });

  test("omits the removed quality and municipal challenges sections", () => {
    expect(html).not.toContain('id="quality"');
    expect(html).not.toContain('id="problems"');
    expect(html).not.toContain("Answer Quality");
    expect(html).not.toContain("Municipal Inquiry Challenges");
  });

  test("omits the chat, call, and support sections from the top page", () => {
    expect(html).not.toContain('id="chat"');
    expect(html).not.toContain('id="call"');
    expect(html).not.toContain('id="support"');
  });

  test("links product cards to the dedicated pages", () => {
    expect(html).toContain('href="/chat"');
    expect(html).toContain('href="/call"');
  });
});

describe("shared knowledge", () => {
  test("presents one shared knowledge base before common operations", () => {
    expect(html).toContain('id="knowledge"');
    const knowledge = html.match(
      /<section id="knowledge"[\s\S]*?<\/section>/,
    )?.[0];
    expect(knowledge).toContain("ホームページと電話で知識を共有");
    expect(html).toContain("SwarrowChat");
    expect(html).toContain("SwarrowCall");
    expect(html).toContain("/swarrow-call/knowledge-flow-alpha.webm");
    expect(html).toContain("/swarrow-call/knowledge-flow-alpha.mp4");
    expect(html).toContain("/swarrow-call/knowledge-flow-alpha.png");
    expect(html).not.toContain("SwarrowCall 基盤");
  });

  test("uses the Call mist wave above Shared Knowledge", () => {
    const knowledge =
      html.match(/<section id="knowledge"[\s\S]*?<\/section>/)?.[0] ?? "";

    expect(knowledge).toContain("knowledge-top-curve");
    expect(knowledge).toContain("section-curve-bg--mist");
    expect(knowledge).toContain("section-curve-bg--flip");
    expect(knowledge).toContain(
      'd="M-80 330C80 128 266 88 498 136C726 184 812 188 1008 76C1214 -42 1378 24 1508 214V1600H-80Z"',
    );
    expect(knowledge.indexOf("knowledge-top-curve")).toBeLessThan(
      knowledge.indexOf("knowledge-inner"),
    );
  });
});

describe("product overview", () => {
  test("shows two equally structured product choices", () => {
    expect(html).toContain('id="products"');
    expect(countMatches(html, /class="product-card(?:\s|")/g)).toBe(2);
    expect(html).toContain("自治体ホームページ AIチャットボット");
    expect(html).toContain("自治体AIコールセンター");
    expect(html).toContain('href="/chat"');
    expect(html).toContain('href="/call"');
    expect(html).toContain("単独でも、組み合わせても導入可能");
    expect(countMatches(html, /class="product-card-watermark\b/g)).toBe(2);
    expect(countMatches(html, /class="product-name-icon\b/g)).toBe(2);
    for (const asset of ["/swarrow/icon.png", "/swarrow/icon.png"]) {
      expect(html).toContain(asset);
    }
  });

  test("places products after Hero and before Shared Knowledge", () => {
    const hero = html.indexOf('class="hero');
    const overview = html.indexOf('id="products"');
    const knowledge = html.indexOf('id="knowledge"');
    const operations = html.indexOf('id="operations"');

    expect(pageSource).toMatch(
      /<section class="hero">[\s\S]*?<\/section>\s*<section id="products"/,
    );
    expect(hero).toBeLessThan(overview);
    expect(overview).toBeLessThan(knowledge);
    expect(knowledge).toBeLessThan(operations);
  });

  test("reuses the Call background wave between Hero and Products", () => {
    const overview =
      html.match(/<section id="products"[\s\S]*?<\/section>/)?.[0] ?? "";

    expect(overview).toContain("hero-products-curve");
    expect(overview).toContain(
      'd="M-80 330C80 128 266 88 498 136C726 184 812 188 1008 76C1214 -42 1378 24 1508 214V1600H-80Z"',
    );
    expect(overview.indexOf("hero-products-curve")).toBeLessThan(
      overview.indexOf("products-inner"),
    );
  });
});

describe("SwarrowChat page", () => {
  test("renders the chat feature band and chat-specific customer success copy", () => {
    expect(chatHtml).toContain("SwarrowChat");
    expect(chatHtml).toContain("自治体ホームページ AIチャットボット");
    expect(chatHtml).toContain("/swarrow-chat/sample-chat-balanced.webp");
    expect(chatHtml).toContain(
      "https://www.vecta.co.jp/article/miyakonojo-ai-window-nhk/",
    );
    expect(chatHtml).toContain(
      "https://news.web.nhk/newsweb/na/nd-20261017de60863",
    );
    expect(chatHtml).toContain('id="support"');
    expect(chatHtml).not.toContain('id="chat"');
    expect(chatHtml).not.toContain('id="call"');
  });

  test("renders exactly one h1 heading", () => {
    expect(countMatches(chatHtml, /<h1\b/g)).toBe(1);
  });

  test("never skips a heading level", () => {
    expect(hasNoHeadingLevelSkips(headingLevels(chatHtml))).toBe(true);
  });

  test("publishes a product-specific search and social contract", () => {
    const product = products.find((item) => item.id === "chat");
    if (!product) throw new Error("chat product not found");
    const title = `SwarrowChat｜${product.category}`;
    const canonicalUrl = `${site}${product.href}`;
    const ogImageUrl = `${site}${product.ogImage.path}`;

    expect(chatHtml.match(/<title>([^<]+)<\/title>/)?.[1]).toBe(title);
    expect(title).not.toBe(
      "Swarrow｜自治体ホームページ AIチャットボット・自治体AIコールセンター",
    );
    expect(metaContentOf(chatHtml, "name", "description")).toBe(
      product.metaDescription,
    );
    expect(
      countMatches(
        chatHtml,
        new RegExp(
          `<link rel="canonical" href="${canonicalUrl.replace(/\//g, "\\/")}"\\s*\\/?>`,
          "g",
        ),
      ),
    ).toBe(1);
    expect(metaContentOf(chatHtml, "name", "robots")).toBe("index,follow");
    expect(metaContentOf(chatHtml, "property", "og:site_name")).toBe(siteName);
    expect(metaContentOf(chatHtml, "property", "og:locale")).toBe("ja_JP");
    expect(metaContentOf(chatHtml, "property", "og:title")).toBe(title);
    expect(metaContentOf(chatHtml, "property", "og:description")).toBe(
      product.metaDescription,
    );
    expect(metaContentOf(chatHtml, "property", "og:url")).toBe(canonicalUrl);
    expect(metaContentOf(chatHtml, "property", "og:image")).toBe(ogImageUrl);
    expect(metaContentOf(chatHtml, "property", "og:image:width")).toBe(
      String(product.ogImage.width),
    );
    expect(metaContentOf(chatHtml, "property", "og:image:height")).toBe(
      String(product.ogImage.height),
    );
    expect(metaContentOf(chatHtml, "name", "twitter:card")).toBe(
      "summary_large_image",
    );
    expect(metaContentOf(chatHtml, "name", "twitter:title")).toBe(title);
    expect(metaContentOf(chatHtml, "name", "twitter:description")).toBe(
      product.metaDescription,
    );
    expect(metaContentOf(chatHtml, "name", "twitter:image")).toBe(ogImageUrl);
    expect(existsSync(`static${product.ogImage.path}`)).toBe(true);
  });

  test("publishes structured data for the chat service alone", () => {
    const match = chatHtml.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    );
    expect(match).not.toBeNull();
    expect(JSON.parse(match?.[1] ?? "{}")).toEqual(productJsonLd("chat"));
  });
});

describe("SwarrowCall page", () => {
  test("renders the Call illustration, capabilities, and operational support", () => {
    expect(callHtml).toContain("SwarrowCall");
    expect(callHtml).toContain("自治体AIコールセンター");
    expect(callHtml).toContain("/swarrow-call/phone-service.webp");
    for (const capability of ["タイマー架電", "自動取次", "一括発信"]) {
      expect(callHtml).toContain(capability);
    }
    expect(callHtml).toContain('id="support"');
  });

  test("renders exactly one h1 heading", () => {
    expect(countMatches(callHtml, /<h1\b/g)).toBe(1);
  });

  test("never skips a heading level", () => {
    expect(hasNoHeadingLevelSkips(headingLevels(callHtml))).toBe(true);
  });

  test("publishes a product-specific search and social contract", () => {
    const product = products.find((item) => item.id === "call");
    if (!product) throw new Error("call product not found");
    const title = `SwarrowCall｜${product.category}`;
    const canonicalUrl = `${site}${product.href}`;
    const ogImageUrl = `${site}${product.ogImage.path}`;

    expect(callHtml.match(/<title>([^<]+)<\/title>/)?.[1]).toBe(title);
    expect(title).not.toBe(
      "Swarrow｜自治体ホームページ AIチャットボット・自治体AIコールセンター",
    );
    expect(metaContentOf(callHtml, "name", "description")).toBe(
      product.metaDescription,
    );
    expect(
      countMatches(
        callHtml,
        new RegExp(
          `<link rel="canonical" href="${canonicalUrl.replace(/\//g, "\\/")}"\\s*\\/?>`,
          "g",
        ),
      ),
    ).toBe(1);
    expect(metaContentOf(callHtml, "name", "robots")).toBe("index,follow");
    expect(metaContentOf(callHtml, "property", "og:site_name")).toBe(siteName);
    expect(metaContentOf(callHtml, "property", "og:locale")).toBe("ja_JP");
    expect(metaContentOf(callHtml, "property", "og:title")).toBe(title);
    expect(metaContentOf(callHtml, "property", "og:description")).toBe(
      product.metaDescription,
    );
    expect(metaContentOf(callHtml, "property", "og:url")).toBe(canonicalUrl);
    expect(metaContentOf(callHtml, "property", "og:image")).toBe(ogImageUrl);
    expect(metaContentOf(callHtml, "property", "og:image:width")).toBe(
      String(product.ogImage.width),
    );
    expect(metaContentOf(callHtml, "property", "og:image:height")).toBe(
      String(product.ogImage.height),
    );
    expect(metaContentOf(callHtml, "name", "twitter:card")).toBe(
      "summary_large_image",
    );
    expect(metaContentOf(callHtml, "name", "twitter:title")).toBe(title);
    expect(metaContentOf(callHtml, "name", "twitter:description")).toBe(
      product.metaDescription,
    );
    expect(metaContentOf(callHtml, "name", "twitter:image")).toBe(ogImageUrl);
    expect(existsSync(`static${product.ogImage.path}`)).toBe(true);
  });

  test("publishes structured data for the call service alone", () => {
    const match = callHtml.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    );
    expect(match).not.toBeNull();
    expect(JSON.parse(match?.[1] ?? "{}")).toEqual(productJsonLd("call"));
  });
});

describe("common operations", () => {
  test("describes one update workflow for both products", () => {
    const operations = html.match(
      /<section id="operations"[\s\S]*?<\/section>/,
    )?.[0];
    expect(operations).toContain("両製品の案内を職員が改善");
    expect(operations).toContain("SwarrowChatとSwarrowCall");
    expect(operations).toContain("一度の更新");
    expect(operations).toContain("/swarrow-call/workflow-editor-alpha.webm");
  });
});

describe("navigation and conversion", () => {
  test("all in-page links point to rendered targets", () => {
    const ids = new Set(
      Array.from(html.matchAll(/\sid="([^"]+)"/g), (match) => match[1]),
    );
    const internalTargets = Array.from(
      html.matchAll(/href="#([^"]+)"/g),
      (match) => match[1],
    );

    for (const target of internalTargets) {
      expect(ids.has(target)).toBe(true);
    }
  });

  test("keeps the final page sequence without an unsolicited download CTA", () => {
    const ids = ["products", "knowledge", "operations", "news"];
    const positions = ids.map((id) => html.indexOf(`id="${id}"`));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    expect(html).not.toContain("まずは資料でご確認ください。");
  });
});

describe("crawlability baseline", () => {
  test("publishes Japanese HTML with one canonical URL", () => {
    expect(html).toContain('<html lang="ja">');
    expect(
      countMatches(
        html,
        /<link rel="canonical" href="https:\/\/swarrow\.com\/"\s*\/?>/g,
      ),
    ).toBe(1);
    expect(html).toContain('<meta name="robots" content="index,follow"');
    expect(html).not.toMatch(/noindex/i);
  });

  test("advertises the root sitemap without blocking crawlers", () => {
    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Disallow:\n");
    expect(robots).toContain("Sitemap: https://swarrow.com/sitemap.xml");
  });

  test("lists the root, chat, and call canonical URLs in the sitemap", () => {
    const locations = Array.from(
      sitemap.matchAll(/<loc>([^<]+)<\/loc>/g),
      (match) => match[1],
    );
    expect(locations).toEqual([
      "https://swarrow.com/",
      "https://swarrow.com/chat",
      "https://swarrow.com/call",
    ]);
  });
});

describe("Google Analytics and privacy disclosure", () => {
  test("renders exactly one environment-configured Google tag", () => {
    expect(countMatches(html, /googletagmanager\.com\/gtag\/js\?id=/g)).toBe(1);
    expect(countMatches(html, /G-TEST0000000/g)).toBe(1);
  });

  test("links a noindex privacy disclosure without expanding the sitemap", () => {
    const footer = html.match(/<footer[^>]*>[\s\S]*?<\/footer>/)?.[0] ?? "";

    expect(footer).toContain('href="/privacy/"');
    expect(footer).toContain("プライバシーについて");
    expect(privacyHtml).toContain('<meta name="robots" content="noindex"');
    expect(privacyHtml).toContain("Google Analytics 4");
    expect(privacyHtml).toContain("Google Analytics Opt-out Browser Add-on");
    expect(sitemap).not.toContain("https://swarrow.com/privacy/");
  });
});

describe("final search contract", () => {
  const metaContent = (kind: "name" | "property", key: string) =>
    html.match(
      new RegExp(`<meta ${kind}="${key}" content="([^"]*)"\\s*\\/?>`),
    )?.[1];

  test("keeps visible metadata and social metadata consistent", () => {
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    const description = metaContent("name", "description");
    expect(title).toBe(
      "Swarrow｜自治体ホームページ AIチャットボット・自治体AIコールセンター",
    );
    expect(description).toContain("SwarrowChat");
    expect(description).toContain("SwarrowCall");
    expect(description).toContain("公式情報");
    expect(description).toContain("公開前");
    expect(description).toContain("参照元");
    expect(description).toContain("回答ルール");
    expect(description).toContain("回答精度");
    expect(description).toContain("継続改善");
    expect(metaContent("property", "og:site_name")).toBe("Swarrow");
    expect(metaContent("property", "og:locale")).toBe("ja_JP");
    expect(metaContent("property", "og:title")).toBe(title);
    expect(metaContent("name", "twitter:title")).toBe(title);
    expect(metaContent("property", "og:description")).toBe(description);
    expect(metaContent("name", "twitter:description")).toBe(description);
    expect(metaContent("property", "og:url")).toBe("https://swarrow.com/");

    const ogImageUrl = `${site}${siteOgImage.path}`;
    expect(metaContent("property", "og:image")).toBe(ogImageUrl);
    expect(metaContent("property", "og:image:width")).toBe(
      String(siteOgImage.width),
    );
    expect(metaContent("property", "og:image:height")).toBe(
      String(siteOgImage.height),
    );
    expect(metaContent("name", "twitter:card")).toBe("summary_large_image");
    expect(metaContent("name", "twitter:image")).toBe(ogImageUrl);
    expect(existsSync(`static${siteOgImage.path}`)).toBe(true);
  });

  test("renders one H1 and both services in visible body content", () => {
    const body = html.split("<body")[1] ?? "";
    expect(countMatches(body, /<h1\b/g)).toBe(1);
    expect(body).toContain("SwarrowChat");
    expect(body).toContain("SwarrowCall");
    expect(body).not.toMatch(/みどり野市|うみかぜ町|あさひ野市|こもれび市/);
    expect(body).not.toMatch(
      /問い合わせ全体を70%削減|負担を半減|最高精度|No\.?1|正確性を保証|回答を保証|誤回答はありません|ハルシネーションゼロ|どんな質問にも|他社より正確|100問|月次/,
    );
  });

  test("publishes parseable structured data matching visible services", () => {
    const body = html.split("<body")[1] ?? "";
    const match = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    );
    expect(match).not.toBeNull();
    const data = JSON.parse(match?.[1] ?? "{}");
    const graph = data["@graph"] as Array<Record<string, unknown>>;
    const services = graph.filter((item) => item["@type"] === "Service");
    expect(graph.some((item) => item["@type"] === "WebSite")).toBe(true);
    expect(services).toHaveLength(2);
    for (const service of services) {
      expect(body).toContain(String(service.name));
      expect(body).toContain(String(service.serviceType));
    }
  });

  test("keeps every referenced Swarrow media file present", () => {
    const media = new Set(
      Array.from(
        html.matchAll(/(?:src|poster)="(\/swarrow-call\/[^"]+)"/g),
        (match) => match[1],
      ),
    );
    expect(media.size).toBeGreaterThan(0);
    for (const path of media) {
      expect(existsSync(`static${path}`)).toBe(true);
    }
  });
});

describe("service inquiries", () => {
  test("keeps Chat and Call sources distinct without hero CTAs", () => {
    for (const [product, page] of [
      ["chat", chatHtml],
      ["call", callHtml],
    ] as const) {
      expect(page).toContain(`https://www.vecta.co.jp/contact/${product}/`);
      expect(page).toContain('id="contact"');
    }
  });
});

describe("news", () => {
  test("shows three recent items and keeps the full archive reachable", () => {
    for (const page of [html, chatHtml]) {
      const section =
        page.match(/<section id="news"[\s\S]*?<\/section>/)?.[0] ?? "";
      expect(countMatches(section, /<li\b/g)).toBe(3);
      expect(section).toContain('href="https://www.vecta.co.jp/article/"');
      expect(section).not.toContain("2026.08.03");
    }
  });
});
