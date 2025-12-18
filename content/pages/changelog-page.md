---
title: "Changelog"
slug: "changelog"
published: true
order: 5
---

# Changelog

All notable changes to this project.

## v1.6.1

Released December 18, 2025

**Documentation updates**

- Added Firecrawl import to all "When to sync vs deploy" tables
- Clarified import workflow: creates local files only, no `import:prod` needed
- Updated docs: README, setup-guide, how-to-publish, docs page, about-this-blog
- Renamed `content/pages/changelog.md` to `changelog-page.md` to avoid confusion with root changelog

## v1.6.0

Released December 18, 2025

**Content import and LLM API enhancements**

- Firecrawl content importer for external URLs
  - `npm run import <url>` scrapes and creates local markdown drafts
  - Creates drafts in `content/blog/` with frontmatter
  - Then sync to dev (`npm run sync`) or prod (`npm run sync:prod`)
  - No separate `import:prod` command (import creates local files only)
- New `/api/export` endpoint for batch content fetching
- AI plugin discovery at `/.well-known/ai-plugin.json`
- OpenAPI 3.0 specification at `/openapi.yaml`
- Enhanced `llms.txt` with complete API documentation

New dependencies: `@mendable/firecrawl-js`

New files: `scripts/import-url.ts`, `public/.well-known/ai-plugin.json`, `public/openapi.yaml`

## v1.5.0

Released December 17, 2025

**Frontmatter-controlled featured items**

- Add `featured: true` to any post or page frontmatter
- Use `featuredOrder` to control display order (lower = first)
- Featured items sync instantly with `npm run sync` (no redeploy needed)

New Convex queries:

- `getFeaturedPosts`: returns posts with `featured: true`
- `getFeaturedPages`: returns pages with `featured: true`

Schema updates with `featured` and `featuredOrder` fields and `by_featured` index.

## v1.4.0

Released December 17, 2025

**Featured section with list/card view toggle**

- Card view displays title and excerpt in a responsive grid
- Toggle button in featured header to switch between views
- View preference saved to localStorage

**Logo gallery with continuous marquee scroll**

- Clickable logos with configurable URLs
- CSS only animation for smooth infinite scrolling
- Configurable speed, position, and title
- Grayscale logos with color on hover
- Responsive sizing across breakpoints
- 5 sample logos included

**New frontmatter field**

- `excerpt` field for posts and pages
- Used for card view descriptions
- Falls back to description field for posts

## v1.3.0

Released December 17, 2025

**Real-time search with Command+K**

- Search icon in top nav using Phosphor Icons
- Modal with keyboard navigation (arrow keys, Enter, Escape)
- Full text search across posts and pages using Convex search indexes
- Result snippets with context around search matches
- Distinguishes between posts and pages with type badges

Search uses Convex full text search with reactive queries. Results deduplicate from title and content searches. Title matches sort first.

## v1.2.0

Released December 15, 2025

**Real-time stats page at /stats**

- Active visitors count with per-page breakdown
- Total page views and unique visitors
- Views by page sorted by popularity

Page view tracking via event records pattern (no write conflicts). Active session heartbeat system with 30s interval and 2min timeout. Cron job for stale session cleanup every 5 minutes.

New Convex tables: `pageViews` and `activeSessions`.

## v1.1.0

Released December 14, 2025

**Netlify Edge Functions for dynamic Convex HTTP proxying**

- `rss.ts` proxies `/rss.xml` and `/rss-full.xml`
- `sitemap.ts` proxies `/sitemap.xml`
- `api.ts` proxies `/api/posts` and `/api/post`

Vite dev server proxy for RSS, sitemap, and API endpoints. Edge functions dynamically read `VITE_CONVEX_URL` from environment.

## v1.0.0

Released December 14, 2025

**Initial release**

- Markdown blog posts with frontmatter parsing
- Static pages support (About, Projects, Contact)
- Four theme options: Dark, Light, Tan (default), Cloud
- Syntax highlighting for code blocks
- Year-grouped post list on home page
- Individual post pages with share buttons

**SEO and discovery**

- Dynamic sitemap at `/sitemap.xml`
- JSON-LD structured data for blog posts
- RSS feeds at `/rss.xml` and `/rss-full.xml`
- AI agent discovery with `llms.txt`
- `robots.txt` with rules for AI crawlers

**API endpoints**

- `/api/posts` for JSON list of all posts
- `/api/post?slug=xxx` for single post as JSON or markdown

**Copy Page dropdown** for sharing to ChatGPT and Claude.

**Technical stack**

- React 18 with TypeScript
- Convex for real-time database
- react-markdown for rendering
- react-syntax-highlighter for code blocks
- Netlify deployment with edge functions

