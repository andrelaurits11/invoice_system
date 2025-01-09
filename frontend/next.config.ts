import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['tailwindui.com'], // Lisatud hostname, kust pildid võivad laadida
  },
};

export default nextConfig;
