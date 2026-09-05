import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.jp",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
