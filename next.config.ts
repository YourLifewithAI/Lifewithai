import type { NextConfig } from "next";
import { archiveRedirects } from "./src/lib/archive";

const nextConfig: NextConfig = {
  // Netlify serves public files from its CDN. Keep them, the docs, the old site's
  // code and content out of the server function.
  outputFileTracingExcludes: {
    '/*': ['./docs/**/*', './public/**/*', './legacy/**/*', './content/**/*', './mcp/**/*'],
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
