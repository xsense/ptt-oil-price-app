import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Optional: Add basePath if deploying to a subdirectory
  // basePath: '/ptt-oil-price-app',
};
export default nextConfig;
