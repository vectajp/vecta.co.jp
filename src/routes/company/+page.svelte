<script lang="ts">
  import {
    companyDetails,
    representativeProfile,
    site,
  } from '$lib/vecta/content'
  import Footer from '$lib/vecta/Footer.svelte'
  import Header from '$lib/vecta/Header.svelte'
  import {
    buildBreadcrumbJsonLd,
    buildOrganizationJsonLd,
    buildPageSeo,
  } from '$lib/vecta/seo'

  const seo = buildPageSeo({
    title: '会社情報',
    description: '株式会社Vectaの会社情報と代表 宮川直也のプロフィール。',
    path: '/company/',
  })
  const jsonLd = [
    buildOrganizationJsonLd(),
    buildBreadcrumbJsonLd([
      { name: 'ホーム', path: '/' },
      { name: '会社情報', path: '/company/' },
    ]),
  ]
</script>

<svelte:head>
  <title>{seo.title}</title>
  <meta name="description" content={seo.description}>
  <meta name="keywords" content={site.keywords}>
  <link rel="canonical" href={seo.canonical}>
  <meta name="robots" content="index,follow">
  <meta property="og:type" content={seo.type}>
  <meta property="og:site_name" content={site.title}>
  <meta property="og:title" content={seo.title}>
  <meta property="og:description" content={seo.description}>
  <meta property="og:url" content={seo.canonical}>
  <meta property="og:image" content={seo.image}>
  <meta property="og:locale" content="ja_JP">
  <meta name="twitter:card" content="summary_large_image">
  {#each jsonLd as schema}
    {@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
  {/each}
</svelte:head>

<Header />
<main class="company-page">
  <div class="container company-content">
    <h1>会社情報</h1>
    <dl class="company-details">
      {#each companyDetails as item (item.label)}
        <div>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      {/each}
    </dl>

    <section class="representative" aria-labelledby="representative-title">
      <h2 id="representative-title">代表プロフィール</h2>
      <div class="representative-identity">
        <img
          class="representative-photo"
          src={representativeProfile.photo}
          alt={representativeProfile.name}
          width="400"
          height="400"
          loading="lazy"
        >
        <div>
          <h3>{representativeProfile.name}</h3>
          <p class="representative-role">{representativeProfile.role}</p>
        </div>
      </div>
      <div class="representative-copy">
        {#each representativeProfile.paragraphs as paragraph}
          <p>{paragraph}</p>
        {/each}
        <h4>活動・実績</h4>
        <ul>
          {#each representativeProfile.activities as activity}
            <li>{activity}</li>
          {/each}
        </ul>
      </div>
    </section>
  </div>
</main>
<Footer />

<style>
  .company-page {
    padding: 64px 0 96px;
  }
  .company-content {
    max-width: 1000px;
    color: var(--color-indigo);
  }
  h1 {
    font-size: clamp(30px, 4vw, 42px);
    line-height: 1.5;
    margin-bottom: 40px;
  }
  .company-details {
    margin: 0;
    border-top: 1px solid var(--color-line);
  }
  .company-details > div {
    display: grid;
    grid-template-columns: 150px minmax(0, 1fr);
    gap: 32px;
    padding: 24px 0;
    border-bottom: 1px solid var(--color-line);
    line-height: 1.9;
  }
  dt {
    font-weight: 700;
  }
  dd {
    margin: 0;
  }
  .representative {
    margin-top: 72px;
    padding: 0;
  }
  h2 {
    font-size: clamp(26px, 3vw, 32px);
    line-height: 1.5;
    margin-bottom: 32px;
  }
  .representative-identity {
    display: flex;
    gap: 32px;
    align-items: center;
    margin-bottom: 32px;
  }
  .representative-photo {
    display: block;
    width: 168px;
    height: 168px;
    flex: none;
    object-fit: cover;
    border-radius: 50%;
  }
  h3 {
    font-size: 30px;
    line-height: 1.5;
    margin: 0 0 8px;
  }
  .representative-role {
    color: var(--color-medium-text);
    margin: 0;
  }
  .representative-copy p,
  li {
    line-height: 1.95;
  }
  .representative-copy p {
    margin-bottom: 20px;
  }
  h4 {
    font-size: 18px;
    line-height: 1.6;
    margin: 32px 0 12px;
  }
  ul {
    margin: 0;
    padding-left: 1.25em;
  }
  li + li {
    margin-top: 8px;
  }
  @media (max-width: 700px) {
    .company-page {
      padding: 40px 0 64px;
    }
    h1 {
      margin-bottom: 28px;
    }
    .company-details > div {
      grid-template-columns: 80px minmax(0, 1fr);
      gap: 16px;
      padding: 20px 0;
      font-size: 15px;
    }
    .representative {
      margin-top: 48px;
    }
    .representative-identity {
      gap: 20px;
      margin-bottom: 28px;
    }
    .representative-photo {
      width: 112px;
      height: 112px;
    }
    h3 {
      font-size: 25px;
    }
    .representative-role {
      font-size: 13px;
    }
  }
</style>
