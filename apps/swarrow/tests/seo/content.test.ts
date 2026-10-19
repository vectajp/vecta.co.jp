/// <reference types="bun" />
// cspell:ignore googletagmanager

import { describe, expect, test } from "bun:test";
import {
  callCustomerSuccessIntro,
  callCustomerSuccessSteps,
  callFeatureCopy,
  chatCustomerSuccessIntro,
  chatCustomerSuccessSteps,
  chatFeatureCopy,
  chatNews,
  downloadCtaLabel,
  heroCopy,
  jsonLd,
  navItems,
  news,
  pageDescription,
  pageTitle,
  productJsonLd,
  products,
  sharedKnowledge,
  showCaseStudies,
  site,
  siteName,
  topDownloadCta,
} from "../../src/lib/swarrow/content";

describe("Swarrow product content", () => {
  test("keeps Call-only articles out of the Chat news feed", () => {
    expect(news.some((item) => item.products.includes("call"))).toBe(true);
    expect(chatNews.length).toBeGreaterThan(0);
    expect(chatNews.every((item) => item.products.includes("chat"))).toBe(true);
    expect(chatNews.length).toBeLessThan(news.length);
  });

  test("defines two equally addressable products", () => {
    expect(site).toBe("https://swarrow.com");
    expect(siteName).toBe("Swarrow");
    expect(products.map(({ id }) => id)).toEqual(["chat", "call"]);
    expect(products.map(({ name }) => name)).toEqual([
      "SwarrowChat",
      "SwarrowCall",
    ]);
    expect(products.map(({ href }) => href)).toEqual(["/chat", "/call"]);
    expect(products.every(({ benefit }) => benefit.length > 0)).toBe(true);
    expect(
      products.every(
        ({ metaDescription }) =>
          metaDescription.length >= 70 && metaDescription.length <= 120,
      ),
    ).toBe(true);
    expect(products.map(({ backgroundIcon }) => backgroundIcon)).toEqual([
      "/swarrow/icon.png",
      "/swarrow/icon.png",
    ]);
    expect(products.map(({ icon }) => icon)).toEqual([
      "/swarrow/icon.png",
      "/swarrow/icon.png",
    ]);
  });

  test("states independent adoption and the shared knowledge value", () => {
    expect(sharedKnowledge.adoption).toContain("単独");
    expect(sharedKnowledge.adoption).toContain("組み合わせ");
    expect(sharedKnowledge.description).toContain("1つの知識基盤");
    expect(sharedKnowledge.description).toContain("SwarrowChat");
    expect(sharedKnowledge.description).toContain("SwarrowCall");
  });

  test("uses a concrete homepage heading without supporting slogans", () => {
    expect(heroCopy.title).toBe("自治体のAIチャットボットとAIコールセンター");
  });

  test("avoids unsupported guarantees and case-specific conditions", () => {
    const publicCopy = JSON.stringify({
      heroCopy,
      pageDescription,
      products,
      sharedKnowledge,
      chatFeatureCopy,
      callFeatureCopy,
      chatCustomerSuccessSteps,
      callCustomerSuccessSteps,
      chatCustomerSuccessIntro,
      callCustomerSuccessIntro,
      topDownloadCta,
    });
    expect(publicCopy).not.toMatch(
      /半減|70%削減|100%|最高精度|No\.?1|どの自治体でも|正確性を保証|回答を保証|誤回答はありません|ハルシネーションゼロ|どんな質問にも|他社より正確|100問|月次|都城市/,
    );
  });

  test("keeps fictional case studies unpublished", () => {
    expect(showCaseStudies).toBe(false);
  });
});

describe("two-product search model", () => {
  test("uses one accurate title and description", () => {
    expect(pageTitle).toBe(
      "Swarrow｜自治体ホームページ AIチャットボット・自治体AIコールセンター",
    );
    for (const phrase of [
      "SwarrowChat",
      "SwarrowCall",
      "公式情報",
      "公開前",
      "参照元",
      "回答ルール",
      "回答精度",
      "継続改善",
      "ホームページ",
      "電話",
    ]) {
      expect(pageDescription).toContain(phrase);
    }
    expect(pageDescription).not.toMatch(/半減|70%削減|100%/);
  });

  test("describes the site and two visible services in one graph", () => {
    const graph = jsonLd["@graph"] as readonly Record<string, unknown>[];
    expect(
      graph.filter((item) => item["@type"] === "Organization"),
    ).toHaveLength(1);
    expect(graph.filter((item) => item["@type"] === "WebSite")).toHaveLength(1);

    const services = graph.filter((item) => item["@type"] === "Service");
    expect(services).toHaveLength(2);
    expect(services.map((item) => item["@id"])).toEqual([
      "https://swarrow.com/#swarrow-chat",
      "https://swarrow.com/#swarrow-call",
    ]);
    expect(services.map((item) => item.name)).toEqual([
      "SwarrowChat",
      "SwarrowCall",
    ]);
    expect(services.map((item) => item.url)).toEqual([
      "https://swarrow.com/chat",
      "https://swarrow.com/call",
    ]);
    expect(
      services.every(
        (item) =>
          (item.provider as Record<string, unknown>)["@id"] ===
          "https://swarrow.com/#organization",
      ),
    ).toBe(true);
  });

  test("provides a single-service graph per product page", () => {
    for (const productId of ["chat", "call"] as const) {
      const graph = productJsonLd(productId)["@graph"] as readonly Record<
        string,
        unknown
      >[];
      expect(
        graph.filter((item) => item["@type"] === "Organization"),
      ).toHaveLength(1);
      expect(graph.filter((item) => item["@type"] === "WebSite")).toHaveLength(
        0,
      );

      const services = graph.filter((item) => item["@type"] === "Service");
      expect(services).toHaveLength(1);
      expect(services[0]?.["@id"]).toBe(
        `https://swarrow.com/#swarrow-${productId}`,
      );
      expect((services[0]?.provider as Record<string, unknown>)["@id"]).toBe(
        "https://swarrow.com/#organization",
      );
    }
  });

  test("links global nav directly to product pages without a support anchor", () => {
    expect(navItems.map(({ href }) => href)).toEqual([
      "/chat",
      "/call",
      "/#news",
      "https://www.vecta.co.jp/company/",
    ]);
    expect(navItems.some(({ label }) => label === "導入支援")).toBe(false);
    expect(navItems.some(({ label }) => label === "製品")).toBe(false);
  });

  test("provides per-product feature copy and customer success steps", () => {
    expect(chatFeatureCopy.titleLabel).toBe(
      "自治体ホームページ AIチャットボット",
    );
    expect(callFeatureCopy.titleLabel).toBe("自治体AIコールセンター");
    expect(chatCustomerSuccessSteps).toHaveLength(3);
    expect(callCustomerSuccessSteps).toHaveLength(3);
    expect(chatCustomerSuccessSteps[0]?.body).toContain("SwarrowChat");
    expect(callCustomerSuccessSteps[0]?.body).toContain("SwarrowCall");
  });

  test("provides a shared download CTA label and copy used on every page", () => {
    expect(downloadCtaLabel.length).toBeGreaterThan(0);
    expect(topDownloadCta.heading.length).toBeGreaterThan(0);
    expect(topDownloadCta.sub.length).toBeGreaterThan(0);
  });

  test("provides per-product customer success intro copy", () => {
    expect(chatCustomerSuccessIntro.lead.length).toBeGreaterThan(0);
    expect(chatCustomerSuccessIntro.body).toContain("SwarrowChat");
    expect(callCustomerSuccessIntro.body).toContain("SwarrowCall");
  });
});

describe("Google Analytics app shell", () => {
  test("initializes one tag only for a valid public Measurement ID", async () => {
    const appHtml = await Bun.file("src/app.html").text();

    expect(appHtml).toContain(
      'data-ga-measurement-id="%sveltekit.env.PUBLIC_GA_MEASUREMENT_ID%"',
    );
    expect(appHtml).toContain("document.currentScript?.getAttribute(");
    expect(appHtml).toContain("/^G-[A-Z0-9]+$/.test(measurementId)");
    expect(appHtml).toMatch(/gtag\((["'])config\1, measurementId\)/);
    expect(
      appHtml.match(/googletagmanager\.com\/gtag\/js\?id=/g) ?? [],
    ).toHaveLength(1);
  });
});
