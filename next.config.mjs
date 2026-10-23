/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // NEXT_DIST_DIR lets a production build run next to a running dev server
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // NEXT_NO_CACHE=1 skips the ~150 MB webpack build cache (for machines low on disk space)
  webpack: (config) => {
    if (process.env.NEXT_NO_CACHE) config.cache = false;
    return config;
  },
};
export default nextConfig;
