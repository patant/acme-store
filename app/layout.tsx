import type { Metadata } from 'next';
import { Fraunces, Work_Sans } from 'next/font/google';
import config from '../brink.config';
import { cart, market } from '../lib/shopper';
import { setMarket } from './actions';
import '../theme/tokens.css';
import './storefront.css';

// Fraunces for the logo, headings and product names; Work Sans for everything else.
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-display',
});

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-text',
});

export const metadata: Metadata = {
  title: `${config.name} — heavy cotton, made in Portugal`,
  description: 'A short list of things in heavy cotton. The price is the price.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [current, s] = await Promise.all([market(), cart()]);
  const count = s?.cart.items.reduce((n, i) => n + i.quantity, 0) ?? 0;
  return (
    <html lang={current.locale} className={`${fraunces.variable} ${workSans.variable}`}>
      <body>
        <div className="shell">
          <header className="masthead">
            <a className="wordmark" href="/">
              {config.name}
            </a>
            <nav className="masthead-nav">
              {/* A session belongs to one market, so switching starts a new cart. */}
              <form className="markets" action={setMarket}>
                {config.markets.map((m) => (
                  <button key={m.code} name="market" value={m.code} aria-pressed={m.code === current.code}>
                    <b>{m.code}</b> {m.currency}
                  </button>
                ))}
              </form>
              <a className="cart-link" href="/cart">
                Cart ({count})
              </a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
