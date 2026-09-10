import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Apollo Client uses rxjs which ships both CJS and ESM; let Next resolve it.
  transpilePackages: ['@devnotes/shared'],
};

export default nextConfig;