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
theme/tokens.css
app/                     thin; re-exports the package
```

No skills and no MCP config live here. Those belong to the harness, not to the merchant's repo —
a file in this repo that an agent would read as instructions is a file anyone with commit access
can use to redirect it.

## Status

`@brink/storefront` is not published yet, so `npm install` will not resolve. The dependency is
recorded because it is the contract the template is built against, not because it works today.
