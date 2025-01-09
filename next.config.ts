import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    serverActions: {}, // 空オブジェクトに修正
  },
};

export default nextConfig;

