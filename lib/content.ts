// content/ is the only content source — R5, no CMS. Read it from disk at build time
// so a page is a pure function of what is committed. When @brink/storefront lands,
// this is the piece it replaces.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(process.cwd(), 'content');
const read = (...p: string[]) => JSON.parse(readFileSync(join(dir, ...p), 'utf8'));

export type Product = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  categories: string[];
  images: { src: string; alt: string }[];
  attributes: {
    material: string;
    weight_gsm: number;
    fit: string;
    origin: string;
    care: string[];
  };
};

export type Category = { slug: string; title: string; children?: Category[] };

export const products = (): Product[] =>
  readdirSync(join(dir, 'products'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => read('products', f))
    .sort((a, b) => b.attributes.weight_gsm - a.attributes.weight_gsm);

export const taxonomy = (): Category[] => read('taxonomy.json').categories;

/** Products carry both the parent and the leaf slug, so matching on either keeps a
 *  product visible under a category that has no children of its own. */
export const inCategory = (all: Product[], c: Category) => {
  const slugs = [c.slug, ...(c.children ?? []).map((k) => k.slug)];
  return all.filter((p) => p.categories.some((s) => slugs.includes(s)));
};
