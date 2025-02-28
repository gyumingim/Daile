import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack5: true, webpack: (config, options) => { config.cache = false; return config; },
  darkMode: 'class',
};

export default nextConfig;
