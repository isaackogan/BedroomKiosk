import type { NextConfig } from "next";

import "./env.mjs";

const nextConfig: NextConfig = {
  reactStrictMode: process.env.NODE_ENV === 'production',
};

export default nextConfig;
