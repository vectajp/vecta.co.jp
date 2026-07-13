# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
bun run dev          # Start dev server at localhost:4321
bun run build        # Build the static site into dist/
bun run preview      # Preview the production build

# Code Quality
bun run format       # Format code with Biome
bun run check        # Biome + Svelte type check + Bun tests
bun run check:fix    # Lint and fix with Biome

# Project Setup (if mise is installed)
mise run bootstrap   # Initialize workspace (alias: mise bs)
mise run doctor      # Show tooling info (alias: mise dr)
```

## Architecture Overview

This is a corporate website for Vecta built with SvelteKit, Svelte 5, Bun, and `@sveltejs/adapter-static`. It is a prerendered static site deployed from the `dist/` output directory.

### Content Structure

- **Routes**: SvelteKit routes in `src/routes/`.
- **Home page**: `src/routes/+page.svelte` renders the corporate landing page.
- **Articles**: metadata lives in `src/lib/articles/registry.ts`; article bodies are Svelte components under `src/lib/articles/posts/`.
- **Digest articles**: Digital Agency press-conference digest articles are Markdown bodies in `src/lib/articles/posts/*.md` rendered through `MarkdownBody.svelte` via fixed-template Svelte wrappers. Generation is handled by the `digest` skill (`.claude/skills/digest/`) and the fetch CLI (`scripts/digest/`).
- **Vecta content**: company, navigation, project, and hero copy lives in `src/lib/vecta/content.ts`.
- **SEO**: title, canonical URL, OGP, JSON-LD, and sitemap helpers live in `src/lib/vecta/seo.ts`.
- **Static assets**: stored in `public/`, configured as the SvelteKit assets directory in `vite.config.ts`.

### Key Technical Decisions

1. **SvelteKit static output**: `adapter-static` writes both pages and assets to `dist/`.
2. **Svelte article bodies**: each article body is a `.svelte` component (digest articles wrap Markdown via `MarkdownBody.svelte`).
3. **Typed registries**: route-facing content is centralized in typed registries under `src/lib/`.
4. **Trailing slash URLs**: `src/routes/+layout.ts` exports `trailingSlash = 'always'` to preserve `/article/{slug}/` URLs.
5. **Contact form**: validation and payload shaping are pure helpers in `src/lib/vecta/contact.ts`; UI state lives in `ContactForm.svelte`.
6. **Biome + svelte-check + Bun test**: `bun run check` is the main local quality gate.
7. **Conventional Commits**: enforced via Lefthook and commitlint. Commit messages are written in Japanese.

### Styling Architecture

- **Global styles**: `src/styles/global.css`
- **Component styles**: colocated `<style>` blocks in Svelte components
- **Color Palette**:
  - Navy: `#0A1E3C`
  - Golden Orange: `#E69500`
  - Ink: `#2F2F2F`
  - Vector Blue: `#2F6FED`

### Important Files

- `vite.config.ts`: SvelteKit plugin, static adapter, port, and `public/` asset directory configuration
- `src/routes/+layout.ts`: prerender and trailing slash policy
- `src/lib/vecta/content.ts`: site-wide Vecta content
- `src/lib/articles/registry.ts`: article metadata and component loader registry
- `src/lib/vecta/seo.ts`: SEO metadata, structured data, and sitemap XML generation
- `biome.json`: formatting and linting rules
- `mise.toml`: local tool version management and custom tasks

## Git Commit Convention

Use these prefixes from `.gitmessage.txt` for commit messages. **Write commit messages in Japanese.**

- **feat**: 新機能
- **fix**: バグ修正
- **docs**: ドキュメントのみの変更
- **style**: コードの意味に影響しない変更（空白、書式、セミコロンの欠落など）
- **refactor**: バグの修正でも機能の追加でもないコード変更
- **perf**: パフォーマンスを向上させるコード変更
- **test**: 不足しているテストの追加や既存のテストの修正
- **build**: ビルドシステムや外部の依存関係に影響する変更
- **ci**: CI の設定ファイルやスクリプトの変更
- **chore**: src やテストファイルを変更しないその他の変更
- **revert**: 以前のコミットを取り消す
