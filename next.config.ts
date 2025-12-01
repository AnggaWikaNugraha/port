import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ['tripjogja.co.id', 'media.licdn.com'],
  },
};

export default nextConfig;
