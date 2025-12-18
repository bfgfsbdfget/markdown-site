---
title: "Docs"
slug: "docs"
published: true
order: 0
---

Reference documentation for setting up, customizing, and deploying this markdown site.

**How publishing works:** Write posts in markdown, run `npm run sync` for development or `npm run sync:prod` for production, and they appear on your live site immediately. No rebuild or redeploy needed. Convex handles real-time data sync, so connected browsers update automatically.

## Quick start

```bash
git clone https://github.com/waynesutton/markdown-site.git
cd markdown-site
npm install
npx convex dev
npm run sync          # development
npm run sync:prod     # production
npm run dev
```

Open `http://localhost:5173` to view locally.

## Requirements

- Node.js 18+
- Convex account (free at convex.dev)
- Netlify account (free at netlify.com)

## Project structure

```
markdown-site/
├── content/
│   ├── blog/           # Blog posts (.md)
│   └── pages/          # Static pages (.md)
├── convex/
│   ├── schema.ts       # Database schema
│   ├── posts.ts        # Post queries/mutations
│   ├── pages.ts        # Page queries/mutations
│   ├── http.ts         # API endpoints
│   └── rss.ts          # RSS generation
├── netlify/
│   └── edge-functions/ # Netlify edge functions
│       ├── rss.ts      # RSS proxy
│       ├── sitemap.ts  # Sitemap proxy
│       ├── api.ts      # API proxy
│       └── botMeta.ts  # OG crawler detection
├── src/
│   ├── components/     # React components
│   ├── context/        # Theme context
│   ├── pages/          # Route components
│   └── styles/         # CSS
├── public/
│   ├── images/         # Static images
│   ├── robots.txt      # Crawler rules
│   └── llms.txt        # AI discovery
└── netlify.toml        # Deployment config
```

## Content

### Blog posts

Create files in `content/blog/` with frontmatter:

```markdown
---
title: "Post Title"
description: "SEO description"
date: "2025-01-15"
slug: "url-path"
published: true
tags: ["tag1", "tag2"]
readTime: "5 min read"
image: "/images/og-image.png"
---

Content here...
```

| Field           | Required | Description                           |
| --------------- | -------- | ------------------------------------- |
| `title`         | Yes      | Post title                            |
| `description`   | Yes      | SEO description                       |
| `date`          | Yes      | YYYY-MM-DD format                     |
| `slug`          | Yes      | URL path (unique)                     |
| `published`     | Yes      | `true` to show                        |
| `tags`          | Yes      | Array of strings                      |
| `readTime`      | No       | Display time estimate                 |
| `image`         | No       | Open Graph image                      |
| `excerpt`       | No       | Short text for card view              |
| `featured`      | No       | `true` to show in featured section    |
| `featuredOrder` | No       | Order in featured (lower = first)     |

### Static pages

Create files in `content/pages/` with frontmatter:

```markdown
---
title: "Page Title"
slug: "url-path"
published: true
order: 1
---

Content here...
```

| Field           | Required | Description                           |
| --------------- | -------- | ------------------------------------- |
| `title`         | Yes      | Nav link text                         |
| `slug`          | Yes      | URL path                              |
| `published`     | Yes      | `true` to show                        |
| `order`         | No       | Nav order (lower = first)             |
| `excerpt`       | No       | Short text for card view              |
| `featured`      | No       | `true` to show in featured section    |
| `featuredOrder` | No       | Order in featured (lower = first)     |

### Syncing content

```bash
# Development
npm run sync

# Production
npm run sync:prod
```

### When to sync vs deploy

| What you're changing | Command | Timing |
| --- | --- | --- |
| Blog posts in `content/blog/` | `npm run sync` | Instant (no rebuild) |
| Pages in `content/pages/` | `npm run sync` | Instant (no rebuild) |
| Featured items (via frontmatter) | `npm run sync` | Instant (no rebuild) |
| Import external URL | `npm run import` then sync | Instant (no rebuild) |
| `siteConfig` in `Home.tsx` | Redeploy | Requires rebuild |
| Logo gallery config | Redeploy | Requires rebuild |
| React components/styles | Redeploy | Requires rebuild |

**Markdown content** syncs instantly. **Source code** requires pushing to GitHub for Netlify to rebuild.

## Configuration

### Site settings

Edit `src/pages/Home.tsx`:

```typescript
const siteConfig = {
  name: "Site Name",
  title: "Tagline",
  logo: "/images/logo.svg", // null to hide
  intro: "Introduction text...",
  bio: "Bio text...",
  
  // Featured section
  featuredViewMode: "list", // 'list' or 'cards'
  showViewToggle: true,
  featuredItems: [{ slug: "post-slug", type: "post" }],
  featuredEssays: [{ title: "Post Title", slug: "post-slug" }],
  
  // Logo gallery (with clickable links)
  logoGallery: {
    enabled: true, // false to hide
    images: [
      { src: "/images/logos/logo.svg", href: "https://example.com" },
    ],
    position: "above-footer",
    speed: 30,
    title: "Trusted by",
  },
  
  links: {
    docs: "/docs",
    convex: "https://convex.dev",
  },
};
```

### Featured items

Posts and pages appear in the featured section when marked with `featured: true` in frontmatter.

**Add to featured section:**

```yaml
# In any post or page frontmatter
featured: true
featuredOrder: 1
excerpt: "Short description for card view."
```

Then run `npm run sync`. No redeploy needed.

| Field | Description |
| --- | --- |
| `featured` | Set `true` to show in featured section |
| `featuredOrder` | Order in featured section (lower = first) |
| `excerpt` | Short text shown on card view |

**Display options (in siteConfig):**

```typescript
// In src/pages/Home.tsx
const siteConfig = {
  featuredViewMode: "list", // 'list' or 'cards'
  showViewToggle: true, // Let users switch views
};
```

### Logo gallery

The homepage includes a scrolling logo marquee with sample logos. Each logo can link to a URL.

```typescript
// In src/pages/Home.tsx
logoGallery: {
  enabled: true, // false to hide
  images: [
    { src: "/images/logos/logo1.svg", href: "https://example.com" },
    { src: "/images/logos/logo2.svg", href: "https://another.com" },
  ],
  position: "above-footer", // or 'below-featured'
  speed: 30, // Seconds for one scroll cycle
  title: "Trusted by", // undefined to hide
},
```

| Option | Description |
| --- | --- |
| `enabled` | `true` to show, `false` to hide |
| `images` | Array of `{ src, href }` objects |
| `position` | `'above-footer'` or `'below-featured'` |
| `speed` | Seconds for one scroll cycle (lower = faster) |
| `title` | Text above gallery (`undefined` to hide) |

**To add logos:**

1. Add SVG/PNG files to `public/images/logos/`
2. Update the `images` array with `src` paths and `href` URLs
3. Push to GitHub (requires rebuild)

**To disable:** Set `enabled: false`

**To remove samples:** Delete files from `public/images/logos/` or clear the images array.

### Theme

Default: `tan`. Options: `dark`, `light`, `tan`, `cloud`.

Edit `src/context/ThemeContext.tsx`:

```typescript
const DEFAULT_THEME: Theme = "tan";
```

### Font

Edit `src/styles/global.css`:

```css
body {
  /* Sans-serif */
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Serif (default) */
  font-family: "New York", ui-serif, Georgia, serif;
}
```

### Images

| Image            | Location                       | Size     |
| ---------------- | ------------------------------ | -------- |
| Favicon          | `public/favicon.svg`           | 512x512  |
| Site logo        | `public/images/logo.svg`       | 512x512  |
| Default OG image | `public/images/og-default.svg` | 1200x630 |
| Post images      | `public/images/`               | Any      |

## Search

Press `Command+K` (Mac) or `Ctrl+K` (Windows/Linux) to open the search modal. Click the search icon in the nav or use the keyboard shortcut.

**Features:**

- Real-time results as you type
- Keyboard navigation (arrow keys, Enter, Escape)
- Result snippets with context around matches
- Distinguishes between posts and pages
- Works with all four themes

Search uses Convex full text search indexes. No configuration needed.

## Real-time stats

The `/stats` page displays real-time analytics:

- Active visitors (with per-page breakdown)
- Total page views
- Unique visitors
- Views by page (sorted by count)

All stats update automatically via Convex subscriptions.

## API endpoints

| Endpoint                       | Description                   |
| ------------------------------ | ----------------------------- |
| `/stats`                       | Real-time analytics           |
| `/rss.xml`                     | RSS feed (descriptions)       |
| `/rss-full.xml`                | RSS feed (full content)       |
| `/sitemap.xml`                 | XML sitemap                   |
| `/api/posts`                   | JSON post list                |
| `/api/post?slug=xxx`           | Single post (JSON)            |
| `/api/post?slug=xxx&format=md` | Single post (markdown)        |
| `/api/export`                  | All posts with full content   |
| `/.well-known/ai-plugin.json`  | AI plugin manifest            |
| `/openapi.yaml`                | OpenAPI 3.0 specification     |
| `/llms.txt`                    | AI agent discovery            |

## Import external content

Use Firecrawl to import articles from external URLs:

```bash
npm run import https://example.com/article
```

Setup:

1. Get an API key from firecrawl.dev
2. Add `FIRECRAWL_API_KEY=fc-xxx` to `.env.local`

The import command creates local markdown files only. It does not interact with Convex directly.

**After importing:**

- `npm run sync` to push to development
- `npm run sync:prod` to push to production

There is no `npm run import:prod` because import creates local files and sync handles the target environment.

Imported posts are drafts (`published: false`). Review, edit, set `published: true`, then sync.

## Deployment

### Netlify setup

1. Connect GitHub repo to Netlify
2. Build command: `npm ci --include=dev && npx convex deploy --cmd 'npm run build'`
3. Publish directory: `dist`
4. Add env variables:
   - `CONVEX_DEPLOY_KEY` (from Convex Dashboard > Project Settings > Deploy Key)
   - `VITE_CONVEX_URL` (your production Convex URL, e.g., `https://your-deployment.convex.cloud`)

Both are required: deploy key for builds, URL for edge function runtime.

### Convex production

```bash
npx convex deploy
```

### Edge functions

RSS, sitemap, and API routes are handled by Netlify Edge Functions in `netlify/edge-functions/`. They dynamically read `VITE_CONVEX_URL` from the environment. No manual URL configuration needed.

## Convex schema

```typescript
// convex/schema.ts
export default defineSchema({
  posts: defineTable({
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    content: v.string(),
    date: v.string(),
    published: v.boolean(),
    tags: v.array(v.string()),
    readTime: v.optional(v.string()),
    image: v.optional(v.string()),
    excerpt: v.optional(v.string()), // For card view
    featured: v.optional(v.boolean()), // Show in featured section
    featuredOrder: v.optional(v.number()), // Order in featured (lower = first)
    lastSyncedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["published"])
    .index("by_featured", ["featured"]),

  pages: defineTable({
    slug: v.string(),
    title: v.string(),
    content: v.string(),
    published: v.boolean(),
    order: v.optional(v.number()),
    excerpt: v.optional(v.string()), // For card view
    featured: v.optional(v.boolean()), // Show in featured section
    featuredOrder: v.optional(v.number()), // Order in featured (lower = first)
    lastSyncedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["published"])
    .index("by_featured", ["featured"]),
});
```

## Troubleshooting

**Posts not appearing**

- Check `published: true` in frontmatter
- Run `npm run sync` for development
- Run `npm run sync:prod` for production
- Verify in Convex dashboard

**RSS/Sitemap errors**

- Verify `VITE_CONVEX_URL` is set in Netlify
- Test Convex HTTP URL: `https://your-deployment.convex.site/rss.xml`
- Check edge functions in `netlify/edge-functions/`

**Build failures**

- Verify `CONVEX_DEPLOY_KEY` is set in Netlify
- Ensure `@types/node` is in devDependencies
- Build command must include `--include=dev`
- Check Node.js version (18+)
