# Adam | Backend Engineer | Blogs

Personal blog and devlog site for [Adam Durwaish](https://adamhq.site) — notes on git internals, MCP servers, security, search and systems engineering. Live at [blogs.adamhq.site](https://blogs.adamhq.site).

## Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite 8](https://vite.dev) for tooling
- [Tailwind CSS v4](https://tailwindcss.com)
- [lucide-react](https://lucide.dev) for icons
- Custom, dependency-free Markdown renderer (no `react-markdown`)

## Getting started

```bash
# install dependencies
npm install

# start the dev server
npm run dev

# type-check + production build
npm run build

# preview the production build
npm run preview

# lint
npm run lint
```

## Adding a post

Posts are plain Markdown files in `src/content/`. Drop a new `*.md` file there — it is picked up automatically via `import.meta.glob` (see `src/Blogs/Blogs.ts`).

Each file must start with YAML frontmatter:

```markdown
---
title: "My post title"
slug: "my-post-title"
createdAt: "2026-07-01"
updatedAt: "2026-07-15"
---

Your post content in Markdown...
```

| Field       | Required | Notes                                              |
| ----------- | -------- | -------------------------------------------------- |
| `title`     | yes      | Shown in the sidebar and article header             |
| `slug`      | no       | URL fragment (`#/my-post-title`); falls back to a slugified title |
| `createdAt` | yes      | ISO date (`YYYY-MM-DD`); used for sorting, newest first |
| `updatedAt` | yes      | ISO date, shown under the title                     |

### Supported Markdown

The custom renderer (`src/Blogs/Markdown.tsx`) supports:

- Paragraphs
- `#`–`######` headings (rendered as `h3`)
- Fenced code blocks (```` ``` ````)
- Unordered lists (`- ` / `* `) and ordered lists (`1. `)
- Inline `code` and `**bold**`

## Features

- **Hash-based routing** — each post lives at `#/slug`, with back/forward navigation support. The homepage shows the full archive.
- **Collapsible sidebar** — on desktop the post list is an in-layout sidebar open by default; on mobile it becomes a slide-in overlay. Both can be closed with the × button and reopened with the hamburger menu.
- **Archive view** — a scroll-faded list of every post with created/updated dates.
- **Fade-on-scroll lists** — `ScrollFade` adds top/bottom gradient masks to scrollable areas.
- **SEO & social meta** — Open Graph, Twitter Card, canonical URL and description tags in `index.html`.

## Project structure

```
src/
├── App.tsx                  # root component
├── Blog.tsx                 # main layout: header, archive, article, sidebar
├── Blogs/
│   ├── Blogs.ts             # frontmatter parsing + post loading/sorting
│   └── Markdown.tsx         # custom markdown renderer
├── content/                 # blog posts (Markdown with frontmatter)
├── main.tsx                 # entry point
└── index.css                # Tailwind + global styles
```

## Deployment

Build with `npm run build` and serve the generated `dist/` from any static host (the site is currently deployed at [blogs.adamhq.site](https://blogs.adamhq.site)).
