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
npm run dev        # https://localhost:3000
```

The pages read `brink.config.ts`, `content/taxonomy.json` and `content/products/*.json` from disk, and
ask Brink's Shopper API for prices and the cart. `BRINK_SHOPPER_URL` picks the Brink account; it
defaults to dev. Dev runs on https because Klarna refuses a plain-http confirmation URL.

## Cart and checkout

The cart is a Brink shopper session (`lib/shopper.ts`), kept in an httpOnly cookie and changed only
through the server actions in `app/actions.ts`. Checkout is Klarna Checkout: `/checkout` shows
Klarna's iframe, and Brink places the order from Klarna's push, so no code here creates orders.
Switching market drops the cart, because a session belongs to one market.

## Status

`@brink/storefront` is not published yet, so `app/` and `lib/content.ts` render the page themselves
for now. They are placeholders, not the design: when the package lands it takes over rendering and
both shrink back to a few lines. The parts that are real and stay are `brink.config.ts`, everything
under `content/`, and `theme/tokens.css`.

Deliberately not built yet: page routes for `content/pages/*.mdx` (only `/terms`, which Klarna needs),
and the links in `content/nav.json`. Prices and stock are never committed here — they are Brink's.
