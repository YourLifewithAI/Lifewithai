import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Optional local-only mode for hosts that restrict child processes.
    ...(process.env.ARCOLOGY_LOCAL_THREADS === '1'
      ? { workerThreads: true, webpackBuildWorker: false, cpus: 2 }
      : {}),
  },
};

export default nextConfig;
