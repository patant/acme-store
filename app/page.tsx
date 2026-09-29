// The start page: everything on it comes from content/ and brink.config.ts. Nothing
// is fetched, because prices and stock are Brink's and this page is the editorial half.
import config from '../brink.config';
import { type Product, inCategory, products, taxonomy } from '../lib/content';

function Garment({ p }: { p: Product }) {
  const a = p.attributes;
  return (
    <article className="garment">
      <h3>{p.title}</h3>
      <p className="weight">
        <b>{a.weight_gsm}</b>
        <span>grams per m²</span>
      </p>
      <p className="blurb">{p.summary}</p>
      <dl className="spec">
        <div>
          <dt>Cloth</dt>
          <dd>{a.material}</dd>
        </div>
        <div>
          <dt>Cut</dt>
          <dd>{a.fit}</dd>
        </div>
        <div>
          <dt>Made in</dt>
          <dd>{a.origin}</dd>
        </div>
        <div>
          <dt>Care</dt>
          <dd>{a.care.join(', ')}</dd>
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
          We make a short list of things, in heavy cotton, in Portugal, and we do not change
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
          <h2>{category.title}</h2>
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
