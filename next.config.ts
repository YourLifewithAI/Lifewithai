import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify serves public images from its CDN. Keep them and the archival
  // artwork/docs out of the server function; podcast files remain available
  // because the RSS route reads their sizes and metadata at runtime.
  outputFileTracingExcludes: {
    '/*': ['./docs/**/*', './public/images/**/*'],
  },
  experimental: {
    // Optional local-only mode for hosts that restrict child processes.
    ...(process.env.ARCOLOGY_LOCAL_THREADS === '1'
      ? { workerThreads: true, webpackBuildWorker: false, cpus: 2 }
      : {}),
  },
};

export default nextConfig;
