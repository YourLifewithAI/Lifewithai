// The words editor's API, for the in-page editor (src/components/words-editor). The file ends in .dev.ts, so it is a
// route only in `npm run edit` (next.config.ts): a production build leaves it out altogether. Even there, every request gets
// a 404 unless the editor is on (`next dev` with WORDS_EDITOR=1, which `npm run edit` sets), and a 403 unless it was
// made to this computer by name (localhost, 127.0.0.1 or [::1]). A change (POST) also needs an Origin header for the
// same address and the header "x-words-editor: 1": a page elsewhere can't send that header without asking first, and
// nothing here answers that question, so only the preview's own pages can save.
//
//   GET                    every words file and its slots
//   GET ?log=1             the newest changes, newest first
//   POST {action: 'edit', name, i, before, after, undo?}   replace one slot's words
//   POST {action: 'pass', name, value}                     set "ben_pass: yes" or "no"
// Errors come back as {error} with the status.
import { NextResponse, type NextRequest } from 'next/server';
import { WordsEditError, applyEdit, editorOn, readLog, setPass, wordsIndex } from '@/lib/words-edit';

export const dynamic = 'force-dynamic';

const LOCAL = new Set(['localhost', '127.0.0.1', '[::1]']);

const fail = (status: number, error: string) => NextResponse.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } });

// the host name in a Host header, without its port: "localhost:3011" -> "localhost", "[::1]:3011" -> "[::1]"
function hostName(host: string): string {
  const m = /^(\[[^\]]*\]|[^:]*)(?::\d+)?$/.exec(host.trim().toLowerCase());
  return m ? m[1] : '';
}

function gate(req: NextRequest, change: boolean): NextResponse | null {
  if (!editorOn()) return fail(404, 'Not found.');
  const host = (req.headers.get('host') ?? '').trim().toLowerCase();
  if (!LOCAL.has(hostName(host))) return fail(403, 'The words editor only works on this computer, at localhost or 127.0.0.1.');
  if (change) {
    let origin = '';
    try {
      origin = new URL(req.headers.get('origin') ?? '').host.toLowerCase();
    } catch {
      origin = '';
    }
    if (!origin || origin !== host) return fail(403, 'That change came from another page, so it was refused.');
    if (req.headers.get('x-words-editor') !== '1') return fail(403, 'That change came without the editor’s mark, so it was refused.');
  }
  return null;
}

export async function GET(req: NextRequest) {
  const no = gate(req, false);
  if (no) return no;
  const headers = { 'Cache-Control': 'no-store' };
  if (req.nextUrl.searchParams.get('log') === '1') return NextResponse.json({ log: readLog(50) }, { headers });
  return NextResponse.json({ files: wordsIndex() }, { headers });
}

export async function POST(req: NextRequest) {
  const no = gate(req, true);
  if (no) return no;
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await req.json();
    if (!parsed || typeof parsed !== 'object') throw new Error('not an object');
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(400, 'The change couldn’t be read. Refresh the page and try again.');
  }
  try {
    if (body.action === 'edit') {
      const done = applyEdit({ name: body.name, i: body.i, before: body.before, after: body.after, undo: body.undo === true });
      return NextResponse.json({ ok: true, ...done }, { headers: { 'Cache-Control': 'no-store' } });
    }
    if (body.action === 'pass') {
      const done = setPass({ name: body.name, value: body.value });
      return NextResponse.json({ ok: true, ...done }, { headers: { 'Cache-Control': 'no-store' } });
    }
    return fail(400, 'The editor asked for something it can’t do. Refresh the page and try again.');
  } catch (e) {
    if (e instanceof WordsEditError) return fail(e.status, e.message);
    return fail(500, `Something went wrong, and nothing was saved: ${(e as Error).message.split('\n')[0]}`);
  }
}
