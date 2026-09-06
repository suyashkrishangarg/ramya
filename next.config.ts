import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // keep the postgres driver + embedded dev postgres out of the bundle
  serverExternalPackages: ["postgres", "@electric-sql/pglite"],
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [
      {
        // brand marks are immutable — version them by filename when they change
        source: "/:logo(ramya_logo_blackbg.png|ramya_logo_whitebg.png|icon.png)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/opengraph-image",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
