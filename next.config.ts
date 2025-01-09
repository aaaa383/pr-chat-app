import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: true,
  },
  // 他に config options があればここに追記
};

export default nextConfig;
