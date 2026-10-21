import { cart, market, money } from '../../lib/shopper';
import { removeLine, setQuantity, startCheckout } from '../actions';

export default async function CartPage() {
  const [s, m] = await Promise.all([cart(), market()]);
  const items = s?.cart.items ?? [];

  if (items.length === 0) {
    return (
      <section className="cart">
        <h1>Cart</h1>
        <p className="note">
          Your cart is empty. <a href="/">Back to the garments.</a>
        </p>
      </section>
    );
  }

  return (
    <section className="cart">
      <h1>Cart</h1>
      <ul className="lines">
        {items.map((i) => (
          <li key={i.id} className="line">
            <span className="line-name">{i.displayName}</span>
            <form className="qty" action={setQuantity}>
              <input type="hidden" name="item" value={i.id} />
              <button name="quantity" value={i.quantity - 1} disabled={i.quantity <= 1} aria-label="One fewer">
                −
              </button>
              <output aria-label="Quantity">{i.quantity}</output>
              <button name="quantity" value={i.quantity + 1} aria-label="One more">
                +
              </button>
            </form>
            <span className="line-sum">
              {i.quantity} × {money(i.salePriceAmount, m)} = {money(i.totalPriceAmount, m)}
            </span>
            <form action={removeLine}>
              <input type="hidden" name="item" value={i.id} />
              <button className="link">Remove</button>
            </form>
          </li>
        ))}
      </ul>
      <dl className="totals">
        <div>
          <dt>Total</dt>
          <dd>{money(s!.cart.totals.grandTotal, m)}</dd>
        </div>
        <div>
          <dt>of which VAT</dt>
          <dd>{money(s!.cart.totals.taxTotal, m)}</dd>
        </div>
      </dl>
      <form action={startCheckout}>
        <button className="primary">Go to checkout</button>
      </form>
    </section>
  );
}
