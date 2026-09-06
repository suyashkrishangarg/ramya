import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // keep the postgres driver + embedded dev postgres out of the bundle
  serverExternalPackages: ["postgres", "@electric-sql/pglite"],
};

export default nextConfig;
