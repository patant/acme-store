// The start page: the copy comes from content/, and only the prices from Brink.
import { type Product, inCategory, localize, products, taxonomy } from '../lib/content';
import { market, money, prices } from '../lib/shopper';

function Garment({ p, price }: { p: Product; price?: string }) {
  const a = p.attributes;
  return (
    <article className="garment">
      <h3>
        <a href={`/p/${p.slug}`}>{localize(p.title)}</a>
      </h3>
      {price && <p className="price">{price}</p>}
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

export default async function Home() {
  const all = products();
  const m = await market();
  // Every size of a garment costs the same, so the first variant's price stands for it.
  const priceOf = new Map(
    await Promise.all(
      all.map(async (p) => {
        const amount = (await prices(p.brink.productParentId).catch(() => null))?.get(p.brink.variants[0]);
        return [p.slug, amount === undefined ? undefined : money(amount, m)] as const;
      }),
    ),
  );
  const groups = taxonomy()
    .map((c) => ({ category: c, items: inCategory(all, c) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
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
            <Garment key={p.slug} p={p} price={priceOf.get(p.slug)} />
          ))}
        </section>
      ))}

      <footer className="colophon">
        <p>
          Every word above is read from <code>content/</code>. The prices are not — they
          live in Brink, per market, and the storefront asks for them on each visit.
        </p>
      </footer>
    </>
  );
}
