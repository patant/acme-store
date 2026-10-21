'use server';
// Every cart change goes through here: the session token changes on each call, and
// only a server action may write it back to the cookie.
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isCheckoutStale } from '@brinkcommerce/shopper-sdk';
import config from '../brink.config';
import { cart, client, endSession, forget, save, session } from '../lib/shopper';

const done = () => revalidatePath('/', 'layout');

export async function addToCart(form: FormData) {
  const c = await client();
  const variant = String(form.get('variant'));
  // addItem always adds a new line, so a second of the same size goes on the first.
  const line = (await session(c)).cart.items.find((i) => i.productVariantId === variant);
  const s = line
    ? await c.sessions.updateItem(line.id, { quantity: line.quantity + 1 })
    : await c.sessions.addItem({ productVariantId: variant, quantity: 1 });
  await save(s.token);
  done();
}

export async function setQuantity(form: FormData) {
  const c = await client();
  const s = await c.sessions.updateItem(String(form.get('item')), { quantity: Number(form.get('quantity')) });
  await save(s.token);
  done();
}

export async function removeLine(form: FormData) {
  const c = await client();
  const s = await c.sessions.removeItem(String(form.get('item')));
  await save(s.token);
  done();
}

/** A session is fixed to one market, so switching drops the cart. */
export async function setMarket(form: FormData) {
  const code = String(form.get('market'));
  if (!config.markets.some((m) => m.code === code)) return;
  await forget(code);
  done();
}

/** Starts (or reuses) a Klarna checkout for the cart and opens /checkout. Brink
 *  registers Klarna's push and validation callbacks and places the order itself. */
export async function startCheckout() {
  const c = await client();
  const s = await cart(c);
  if (!s || s.cart.items.length === 0) redirect('/cart');

  const current = c._checkoutToken() ? await c.checkouts.get().catch(() => null) : null;
  if (!current || isCheckoutStale(s, current.checkout)) {
    const klarna = s.capabilities?.paymentProviders?.find((p) => p.name === 'KlarnaCheckout');
    if (!klarna) throw new Error(`Klarna is not enabled for ${s.cart.countryCode}.`);
    await c.checkouts.start({ paymentProvider: { name: klarna.name, id: klarna.id } });
    // Klarna only accepts an https confirmation URL, hence `npm run dev:https`.
    const h = await headers();
    const origin = `${h.get('x-forwarded-proto') ?? 'https'}://${h.get('host')}`;
    await c.kco.createOrder({
      klarna: {
        merchant_urls: { terms: `${origin}/terms`, checkout: `${origin}/checkout`, confirmation: `${origin}/confirmation` },
      },
    });
  }
  await save(c._sessionToken()!, c._checkoutToken());
  redirect('/checkout');
}

/** After the order, the next cart starts empty. */
export async function finishOrder() {
  await endSession();
  done();
}
