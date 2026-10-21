// Klarna lands the shopper here after paying. Brink places the order from Klarna's
// push, not from this page, so this only shows Klarna's thank-you and empties the cart.
import { client } from '../../lib/shopper';
import { KlarnaSnippet } from '../klarna-snippet';
import { FinishOrder } from './finish-order';

export default async function ConfirmationPage() {
  const c = await client();
  const order = c._checkoutToken() ? await c.kco.getOrder().catch(() => null) : null;
  return (
    <section className="checkout">
      <h1>Thank you</h1>
      {order?.klarna?.html_snippet ? (
        <KlarnaSnippet html={order.klarna.html_snippet} />
      ) : (
        <p className="note">Your order is placed. Klarna sends the receipt by email.</p>
      )}
      <FinishOrder />
    </section>
  );
}
