// content/ is the only content source — R5, no CMS. Read it from disk at build time
// so a page is a pure function of what is committed. When @brink/storefront lands,
// this is the piece it replaces.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import config from '../brink.config';

const dir = join(process.cwd(), 'content');
const read = (...p: string[]) => JSON.parse(readFileSync(join(dir, ...p), 'utf8'));

/** Copy is written as a plain string or as a locale map ({ "sv-SE": "..." }) — the
 *  import mapping decides which, so readers have to accept either. */
export type Localized = string | Record<string, string>;

export type Product = {
  slug: string;
  title: Localized;
  description: Localized;
  categories: string[];
  images: { src: string; alt?: string }[];
  attributes: { brand?: string; color?: string; tags?: string[] };
  /** The Brink ids. Variant ids end in the size: ACME-TSHIRT-SVA-M. */
  brink: { productParentId: string; variants: string[] };
};

export type Category = { slug: string; title: Localized; children?: Category[] };

export const products = (): Product[] =>
  readdirSync(join(dir, 'products'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => read('products', f))
    .sort((a, b) => a.slug.localeCompare(b.slug));

export const bySlug = (slug: string): Product | undefined => products().find((p) => p.slug === slug);

/** The size a variant id ends in, after its last dash. */
export const size = (variantId: string) => variantId.slice(variantId.lastIndexOf('-') + 1);

const defaultLocale = config.markets.find((m) => m.default)?.locale ?? config.markets[0].locale;

export function localize(value: Localized | undefined): string {
  if (typeof value === 'string') return value;
  return value?.[defaultLocale] ?? Object.values(value ?? {})[0] ?? '';
}

export const taxonomy = (): Category[] => read('taxonomy.json').categories;

/** Products carry both the parent and the leaf slug, so matching on either keeps a
 *  product visible under a category that has no children of its own. */
export const inCategory = (all: Product[], c: Category) => {
  const slugs = [c.slug, ...(c.children ?? []).map((k) => k.slug)];
  return all.filter((p) => p.categories.some((s) => slugs.includes(s)));
};
