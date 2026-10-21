'use client';
// Klarna's html_snippet carries a <script> that builds the iframe. innerHTML never
// runs scripts, so each one is swapped for a fresh element that the browser will run.
import { useEffect, useRef } from 'react';

export function KlarnaSnippet({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    el.innerHTML = html;
    for (const old of el.querySelectorAll('script')) {
      const s = document.createElement('script');
      for (const a of old.attributes) s.setAttribute(a.name, a.value);
      s.text = old.text;
      old.replaceWith(s);
    }
  }, [html]);
  return <div ref={ref} className="klarna" />;
}
