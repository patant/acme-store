// Klarna's checkout for the order startCheckout created. Klarna sends the shopper
// back here with ?validation_error= when Brink refuses the order at the last step.
import { redirect } from 'next/navigation';
import { isCheckoutStale } from '@brinkcommerce/shopper-sdk';
import { cart, client } from '../../lib/shopper';
import { KlarnaSnippet } from '../klarna-snippet';

const problems: Record<string, string> = {
  out_of_stock: 'Something in your cart sold out while you paid. Check the cart and try again.',
  conflict: 'Your cart changed during checkout. Check it and try again.',
};

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ validation_error?: string }> }) {
  const { validation_error } = await searchParams;
  const c = await client();
  const s = await cart(c);
  // A checkout belongs to one cart revision; a changed cart goes back through the cart.
  const current = s && c._checkoutToken() ? await c.checkouts.get().catch(() => null) : null;
  if (!s || !current || isCheckoutStale(s, current.checkout)) redirect('/cart');

  const order = await c.kco.getOrder();
  return (
    <section className="checkout">
      <h1>Checkout</h1>
      {validation_error && (
        <p className="note problem">{problems[validation_error] ?? 'Klarna could not place the order. Try again.'}</p>
      )}
      {order.klarna?.html_snippet ? (
        <KlarnaSnippet html={order.klarna.html_snippet} />
      ) : (
        <p className="note">
          Klarna has no checkout for this cart. <a href="/cart">Back to the cart.</a>
        </p>
      )}
    </section>
  );
}
