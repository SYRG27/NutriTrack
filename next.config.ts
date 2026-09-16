import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { typedRoutes: true },
  // /train is a static app in public/. Next strips the trailing slash, so
  // point the bare path at its index.
  async rewrites() {
    return [{ source: "/train", destination: "/train/index.html" }];
  },
};

export default nextConfig;
