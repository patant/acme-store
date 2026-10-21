// content/pages/terms.mdx, rendered just far enough to read: headings and paragraphs.
// The MDX pages get a real renderer when @brink/storefront lands.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export default function TermsPage() {
  const source = readFileSync(join(process.cwd(), 'content/pages/terms.mdx'), 'utf8');
  const blocks = source.replace(/^---[\s\S]*?---\s*/, '').split(/\n\s*\n/);
  return (
    <section className="prose">
      <h1>Terms</h1>
      {blocks.map((b, i) =>
        b.startsWith('## ') ? <h2 key={i}>{b.slice(3)}</h2> : <p key={i}>{b.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')}</p>,
      )}
    </section>
  );
}
