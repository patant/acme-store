// A garment: the copy from content/, the price per size from Brink.
import { notFound } from 'next/navigation';
import { bySlug, localize, size } from '../../../lib/content';
import { market, money, prices } from '../../../lib/shopper';
import { addToCart } from '../../actions';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = bySlug((await params).slug);
  if (!p) notFound();
  const [m, priceOf] = await Promise.all([market(), prices(p.brink.productParentId)]);
  const priced = p.brink.variants.filter((v) => priceOf.has(v));
  const a = p.attributes;

  return (
    <article className="product">
      <h1>{localize(p.title)}</h1>
      {priced.length > 0 && <p className="price">{money(priceOf.get(priced[0])!, m)}</p>}
      <p className="blurb">{localize(p.description)}</p>

      {priced.length > 0 ? (
        <form className="buy" action={addToCart}>
          <fieldset className="sizes">
            <legend>Size</legend>
            {priced.map((v, i) => (
              <label key={v}>
                <input type="radio" name="variant" value={v} defaultChecked={i === 0} required />
                <span>{size(v)}</span>
              </label>
            ))}
          </fieldset>
          <button className="primary">Add to cart</button>
        </form>
      ) : (
        <p className="note">Not sold in {m.code} yet.</p>
      )}

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
