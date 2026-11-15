// Words from a project's words file, as inline Markdown with its quotes marked. Server components only: the Markdown
// is read on the server (src/lib/words.ts) and arrives in the browser as plain elements.
// **bold**, *italic*, [a link](https://...) and `code` work. A quote is written {{Who: words}} and renders as
// <q data-by="Who">words</q>, so the quotes on a page can be counted and checked. Words that don't read as one plain
// sentence (a line starting "1. " or "# ", say) show exactly as typed.
import { Fragment, type ReactNode } from 'react';
import { inlineMarkdown, type InlineNode } from '@/lib/words';

const QUOTE = /\{\{([^:}]+):\s*([^}]+)\}\}/g;
// stands in for a quote while the Markdown is read: private-use characters that Markdown leaves alone
const MARK = /(\d+)/g;

type Quote = { by: string; words: string };

function render(nodes: InlineNode[], quotes: Quote[], key: string): ReactNode[] {
  return nodes.flatMap((n, i): ReactNode[] => {
    const k = `${key}.${i}`;
    if (typeof n === 'string') return withQuotes(n, quotes, k);
    const kids = render(n.kids, quotes, k);
    if (n.tag === 'br') return [<br key={k} />];
    if (n.tag === 'a')
      return [
        <a key={k} href={n.href} title={n.title}>
          {kids}
        </a>,
      ];
    const Tag = n.tag;
    return [<Tag key={k}>{kids}</Tag>];
  });
}

// plain text with the quotes' stand-ins put back as <q> elements
function withQuotes(text: string, quotes: Quote[], key: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(MARK)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const q = quotes[Number(m[1])];
    out.push(
      <q key={`${key}q${at}`} data-by={q.by}>
        {markdown(q.words, [], `${key}q${at}`)}
      </q>,
    );
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function markdown(text: string, quotes: Quote[], key: string): ReactNode[] {
  const tree = inlineMarkdown(text);
  return tree ? render(tree, quotes, key) : withQuotes(text, quotes, key);
}

export function Rich({ text }: { text: string }) {
  const quotes: Quote[] = [];
  const marked = text.replace(QUOTE, (_m, by: string, words: string) => {
    quotes.push({ by: by.trim(), words: words.trim() });
    return `${quotes.length - 1}`;
  });
  return <Fragment>{markdown(marked, quotes, 'r')}</Fragment>;
}

export function Paras({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <>
      {items.map((t, i) => (
        <p key={i} className={className}>
          <Rich text={t} />
        </p>
      ))}
    </>
  );
}
