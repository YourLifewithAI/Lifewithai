// npm run edit: the local preview with the words editor on. It starts `next dev` on this computer only (127.0.0.1)
// with WORDS_EDITOR=1, so every page gets an "Edit text" button (src/components/words-editor). Anything after the
// command goes to next dev, e.g. `npm run edit -- -p 3011` for port 3011. Stop it with Ctrl+C.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
// Next's own command-line entry: works where node_modules is a link to a folder elsewhere, too
const next = require.resolve('next/dist/bin/next');

// The editor writes files, so the preview only ever listens on this computer: another address is refused.
const args = process.argv.slice(2);
if (args.some((a) => a === '-H' || a === '--hostname' || a.startsWith('--hostname=') || /^-H./.test(a))) {
  console.error('The words editor only runs on this computer (127.0.0.1), so -H and --hostname are not allowed.');
  process.exit(1);
}

const child = spawn(process.execPath, [next, 'dev', '-H', '127.0.0.1', ...args], {
  stdio: 'inherit',
  env: { ...process.env, WORDS_EDITOR: '1' },
});

// Ctrl+C in the terminal reaches next dev as well: wait for it to stop, and exit with it. A stop sent to this script
// alone is passed on.
process.on('SIGINT', () => {});
process.on('SIGTERM', () => {
  if (child.exitCode === null) child.kill('SIGTERM');
});
child.on('error', (e) => {
  console.error(`Couldn't start the preview: ${e.message}`);
  process.exit(1);
});
child.on('exit', (code, signal) => process.exit(code ?? (signal ? 1 : 0)));
