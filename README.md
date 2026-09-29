# ecom-harness-template

Template for a Brink-backed storefront. A merchant's store repo is made from this one, and after
that it is theirs: they own it, the agent works in it, and `git` history is the audit log.

The repo is deliberately thin. Framework code lives in `@brink/storefront`, so a fix reaches every
merchant with a version bump and the repo stays small enough for an agent to hold in context.

## What lives where

This repo is the master for **editorial**. Brink is the master for **commerce**. Nothing owns both.

| This repo | Brink |
|---|---|
| `content/products/*.json` — copy, imagery, attributes | variants, tax groups, weight |
| `content/taxonomy.json` — the category tree | prices per market |
| `content/pages/*.mdx` — pages, no CMS | stock per inventory |
| `theme/tokens.css` — how it looks | orders |

`bin/catalog-sync.ts` reads the left column, fetches the right, and indexes both into OpenSearch.
That index is derived and disposable — never author it directly.

## Layout

```
brink.config.ts          markets, currencies, store ids
content/products/*.json  canonical core + an open attributes bag
content/pages/*.mdx      R5: no CMS, this is the content
content/taxonomy.json    category tree -> menu
content/nav.json         header and footer
theme/tokens.css         the whole visual identity
lib/content.ts           reads content/ at build time — placeholder
app/                     start page — placeholder
```

No skills and no MCP config live here. Those belong to the harness, not to the merchant's repo —
a file in this repo that an agent would read as instructions is a file anyone with commit access
can use to redirect it.

## Running it

```sh
npm install
npm run dev        # http://localhost:3000
```

The start page reads `brink.config.ts`, `content/taxonomy.json` and `content/products/*.json` from
disk at build time and renders them. No network, no database — change a JSON file, reload, see it.

## Status

`@brink/storefront` is not published yet, so `app/` and `lib/content.ts` render the page themselves
for now. They are placeholders, not the design: when the package lands it takes over rendering and
both shrink back to a few lines. The parts that are real and stay are `brink.config.ts`, everything
under `content/`, and `theme/tokens.css`.

Deliberately not built yet: page routes for `content/pages/*.mdx`, and the links in `content/nav.json`
(the start page groups products by `taxonomy.json` instead, so nothing on the page is a dead link).
Prices and stock are absent by design — they are Brink's, not this repo's.
