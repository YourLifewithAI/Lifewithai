import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="sheet">
      <div className="sheet-body page-head stack">
        <h1>Nothing here</h1>
        <p className="copy">
          This address has no page. Try the <Link href="/">front page</Link> or the{' '}
          <Link href="/about">about page</Link>.
        </p>
      </div>
    </div>
  );
}
