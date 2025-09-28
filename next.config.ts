import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "image.tmdb.org",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
