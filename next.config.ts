import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.WORDPRESS_HOSTNAME || "atrpoker.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
