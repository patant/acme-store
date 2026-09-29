import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import config from '../brink.config';
import '../theme/tokens.css';
import './storefront.css';

// One family doing both jobs: the width axis separates display from text, which keeps
// the page in a single voice where a second typeface would add another.
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-archivo',
});

export const metadata: Metadata = {
  title: `${config.name} — heavy cotton, made in Portugal`,
  description: 'A short list of things in heavy cotton. The price is the price.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (config.markets.find((m) => m.default) ?? config.markets[0]).locale;
  return (
    <html lang={locale} className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
