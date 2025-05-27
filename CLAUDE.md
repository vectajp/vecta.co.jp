# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
bun run dev          # Start dev server at localhost:4321
bun run build        # Build for production
bun run preview      # Preview production build

# Code Quality
bun run format       # Format code with Biome
bun run check        # Lint code with Biome  
bun run check:fix    # Lint and fix code with Biome

# Project Setup (if mise is installed)
mise run bootstrap   # Initialize workspace (alias: mise bs)
mise run doctor      # Show tooling info (alias: mise dr)
```

## Architecture Overview

This is a **corporate website for Vecta** built with Astro.js. The site focuses on presenting Vecta's mission of structuring analog information into vector data blocks.

### Content Structure

- **Pages**: Located in `src/pages/`, uses file-based routing
- **Articles**: MDX/Markdown files in `src/content/article/` with Zod schema validation
- **Components**: Astro components in `src/components/` for each major section (Hero, Vision, Company, etc.)
- **Layouts**: Base layouts in `src/layouts/` 

### Key Technical Decisions

1. **Astro.js with MDX**: Static site generation with dynamic content support
2. **Bun**: Used as package manager and runtime for fast development
3. **Biome**: Single tool for both formatting and linting (replaces ESLint + Prettier)
4. **SCSS Modules**: Component-scoped styling with shared breakpoint variables
5. **Conventional Commits**: Enforced via Lefthook and commitlint

### Styling Architecture

- **Global styles**: `src/styles/global.scss`
- **Breakpoints**: Defined in `src/styles/scss/_breakpoints.scss` as Sass variables
- **Color Palette**:
  - Navy: `#0A1E3C` (main color)
  - Golden Orange: `#E69500` (CTA/emphasis)
  - Ink: `#2F2F2F` (text)

### Content Management

Articles support:
- Frontmatter with title, description, pubDate, and optional heroImage
- MDX for rich content with components
- Automatic RSS feed generation
- Dynamic routing via `[...slug].astro`

### Important Files

- `src/consts.ts`: Site-wide constants (title, description)
- `astro.config.mjs`: Astro configuration with site URL and integrations
- `biome.json`: Code formatting and linting rules
- `mise.toml`: Tool version management and custom tasks

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