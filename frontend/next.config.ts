import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // Desativa o Strict Mode
  output: 'standalone',
  images: {
    domains: ['crednosso.com.br'],
  },
};

export default nextConfig;
