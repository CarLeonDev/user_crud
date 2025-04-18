import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
    optimizePackageImports: ["@chakra-ui/react"],
  },
  async redirects() {
    return [
      { source: "/", destination: "/users", permanent: false },
    ];
  },
};

export default nextConfig;
