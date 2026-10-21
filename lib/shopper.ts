// The cart is Brink's shopper session; this file is the only thing that talks to it.
//
// ShopperClient keeps tokens on the instance, so one is built per request from the
// cookies. Pages may read here; only server actions may call the functions that
// write cookies, because Next allows cookie writes nowhere else.
import { cookies } from 'next/headers';
import { ShopperClient } from '@brinkcommerce/shopper-sdk';
import config, { type Market } from '../brink.config';

const SESSION = 'acme_session';
const CHECKOUT = 'acme_checkout';
const MARKET = 'acme_market';

type Session = Awaited<ReturnType<ShopperClient['sessions']['get']>>;

export async function market(): Promise<Market> {
  const code = (await cookies()).get(MARKET)?.value;
  return config.markets.find((m) => m.code === code) ?? config.markets.find((m) => m.default) ?? config.markets[0];
}

export async function client() {
  const jar = await cookies();
  const c = new ShopperClient({ baseUrl: config.shopperUrl, sessionToken: jar.get(SESSION)?.value });
  const checkout = jar.get(CHECKOUT)?.value;
  if (checkout) c._setCheckoutToken(checkout);
  return c;
}

/** The current cart, or null if there is none the shopper can still change. Read-only. */
export async function cart(c?: ShopperClient): Promise<Session | null> {
  c ??= await client();
  if (!c._sessionToken()) return null;
  const s = await c.sessions.get().catch(() => null);
  return s && !s.locked ? s : null;
}

/** The current cart, or a new one in the shopper's market. Server actions only. */
export async function session(c: ShopperClient): Promise<Session> {
  const s = await cart(c);
  if (s) return s;
  const m = await market();
  const fresh = await c.sessions.start({ storeGroupId: config.storeGroupId, countryCode: m.code, languageCode: m.language });
  await save(fresh.token);
  // A checkout left over from the last cart belongs to that cart's session.
  (await cookies()).delete(CHECKOUT);
  return fresh;
}

const cookie = { httpOnly: true, sameSite: 'lax', secure: true, path: '/', maxAge: 60 * 60 * 24 * 30 } as const;

/** Every session call returns a refreshed token; keep the newest. Server actions only. */
export async function save(sessionToken: string, checkoutToken?: string) {
  const jar = await cookies();
  jar.set(SESSION, sessionToken, cookie);
  if (checkoutToken) jar.set(CHECKOUT, checkoutToken, cookie);
}

/** Forgets the cart, so the next one starts fresh. Server actions only. */
export async function forget(marketCode?: string) {
  const jar = await cookies();
  jar.delete(SESSION);
  jar.delete(CHECKOUT);
  if (marketCode) jar.set(MARKET, marketCode, { ...cookie, maxAge: 60 * 60 * 24 * 365 });
}

/** Ends the cart after an order. The checkout cookie stays, so the confirmation page
 *  can still show Klarna's thank-you; the next session drops it. Server actions only. */
export async function endSession() {
  (await cookies()).delete(SESSION);
}

/** Prices per variant id, in minor units, for the shopper's market. Needs no session. */
export async function prices(productParentId: string) {
  const m = await market();
  const r = await new ShopperClient({ baseUrl: config.shopperUrl }).products.getPrices({
    productParentId,
    storeGroupId: config.storeGroupId,
    countryCode: m.code,
  });
  return new Map((r.productParent.productVariants ?? []).map((v) => [v.id, v.salePriceAmount]));
}

/** Minor units to a price in the market's own format, without ,00 on whole amounts.
 *  The currency's fraction digits give the divisor, so SEK divides by 100. */
export function money(minor: number, m: Market) {
  const f = new Intl.NumberFormat(m.locale, { style: 'currency', currency: m.currency, trailingZeroDisplay: 'stripIfInteger' });
  return f.format(minor / 10 ** (f.resolvedOptions().maximumFractionDigits ?? 2));
}
