import '../theme/tokens.css';

export const metadata = { title: 'Acme' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
