// The start page: everything on it comes from content/ and brink.config.ts. Nothing
// is fetched, because prices and stock are Brink's and this page is the editorial half.
import config from '../brink.config';
import { type Product, inCategory, products, taxonomy } from '../lib/content';

const defaultLocale = config.markets.find((m) => m.default)?.locale ?? config.markets[0].locale;

/** Content is written as a plain string or as a locale map ({ "sv-SE": "..." }) —
 *  the mapping decides which, so a page has to accept either. */
function localize(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const byLocale = value as Record<string, string>;
    return byLocale[defaultLocale] ?? Object.values(byLocale)[0] ?? '';
  }
  return '';
}

function Garment({ p }: { p: Product }) {
  const a = p.attributes as unknown as { brand?: string; color?: string; tags?: string[] };
  return (
    <article className="garment">
      <h3>{localize(p.title)}</h3>
      <p className="blurb">{localize(p.description)}</p>
      <dl className="spec">
        <div>
          <dt>Brand</dt>
          <dd>{a.brand}</dd>
        </div>
        <div>
          <dt>Colour</dt>
          <dd>{a.color}</dd>
        </div>
        <div>
          <dt>Tags</dt>
          <dd>{a.tags?.join(', ')}</dd>
        </div>
      </dl>
    </article>
  );
}

export default function Home() {
  const all = products();
  const groups = taxonomy()
    .map((c) => ({ category: c, items: inCategory(all, c) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="shell">
      <header className="masthead">
        <h1 className="wordmark">{config.name}</h1>
        <p className="markets">
          {config.markets.map((m) => (
            <span key={m.code}>
              <b>{m.code}</b> {m.currency}
            </span>
          ))}
        </p>
      </header>

      <section className="opening">
        <p>
          We make a short list of things, in heavy cotton, in Sweden, and we do not change
          the list very often.
        </p>
        <p className="aside">
          The price is the price. We do not run a permanent sale against an invented list
          price, and we do not discount at the end of a season — we would rather make fewer
          of a thing and sell them all.
        </p>
      </section>

      {groups.map(({ category, items }) => (
        <section className="group" key={category.slug}>
          <h2>{localize(category.title)}</h2>
          {items.map((p) => (
            <Garment key={p.slug} p={p} />
          ))}
        </section>
      ))}

      <footer className="colophon">
        <p>
          Every word and number above is read from <code>content/</code> at build time.
          Prices and stock are not here — they live in Brink, and the storefront asks for
          them when there is a storefront to ask.
        </p>
      </footer>
    </div>
  );
}
