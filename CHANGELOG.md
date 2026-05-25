# Changelog

## [1.1.0] - 2026-05-25

### SEO & Favicon improvements

- **favicon.svg** — replaced inline `data:` URI favicon with a hosted `/public/favicon.svg` (bonfire icon: gilt flame, ink-void background, ember-blood logs + sparks). Google cannot index `data:` URIs; a fetchable URL is required for search result display.
- **apple-touch-icon** — added `<link rel="apple-touch-icon">` pointing to `/favicon.svg` for iOS home-screen bookmarks.
- **meta title** — added job title keyword: `Maximilian Wikström — AI & Automation Specialist | Portfolio`. Directly boosts relevance for name + role searches.
- **JSON-LD Person schema** — enriched with `jobTitle`, `description`, `image`, and LinkedIn added to `sameAs`. Richer entity signals for Google Knowledge Graph.
- **JSON-LD WebSite schema** — added alongside Person schema to explicitly associate the domain with the person entity.
- **OG + Twitter titles** — updated to match new meta title (role keyword included).