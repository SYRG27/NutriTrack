import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { typedRoutes: true },
  // /train is a static app in public/. Next strips the trailing slash, so
  // point the bare path at its index.
  async rewrites() {
    return [{ source: "/train", destination: "/train/index.html" }];
  },
  /* The /train shell names a hashed bundle that changes on every deploy, so a
     cached copy of it points at a file that no longer exists — a blank page
     with no error. The shell must always be revalidated; the hashed assets
     beside it never change, so they can be cached hard. */
  async headers() {
    const noStore = [{ key: "Cache-Control", value: "no-cache, must-revalidate" }];
    return [
      { source: "/train", headers: noStore },
      // A stale service worker outlives every other kind of stale file.
      { source: "/sw.js", headers: noStore },
      { source: "/train/index.html", headers: noStore },
      {
        source: "/train/assets/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
