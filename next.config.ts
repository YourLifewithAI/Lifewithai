import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";
import { archiveRedirects } from "./src/lib/archive";

// Turbopack's root (Next uses it as the file tracing root too) is this folder, so Next doesn't guess one from a
// lockfile higher up the disk. Not where node_modules is a link to a folder outside this one, as in the laptop's build
// workspace: Turbopack won't follow a link out of its root (the build stops), and a root above both breaks the CSS. There
// Next goes on guessing, as before. On Netlify, where node_modules is a real folder, the root is this folder.
const here = path.resolve(__dirname);
function selfContained(): boolean {
  try {
    const rel = path.relative(here, fs.realpathSync(path.join(here, "node_modules")));
    return !rel.startsWith("..") && !path.isAbsolute(rel);
  } catch {
    return true; // no node_modules yet
  }
}

const nextConfig: NextConfig = {
  ...(selfContained() ? { turbopack: { root: here } } : {}),
  // Netlify serves public files from its CDN. Keep them, the docs, the old site's
  // code and content out of the server function.
  outputFileTracingExcludes: {
    '/*': ['./docs/**/*', './public/**/*', './legacy/**/*', './content/**/*'],
  },
  // Old addresses answer with a 301 to the same path on the archive host (src/lib/archive.ts).
  async redirects() {
    return archiveRedirects();
  },
  experimental: {
    // Optional local-only mode for hosts that restrict child processes.
    ...(process.env.ARCOLOGY_LOCAL_THREADS === '1'
      ? { workerThreads: true, webpackBuildWorker: false, cpus: 2 }
      : {}),
  },
};

export default nextConfig;
