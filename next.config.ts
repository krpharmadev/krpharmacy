import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  eslint: {
    // ปิด ESLint ในระหว่างการสร้าง (build)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ปิด TypeScript type checking ในระหว่างการสร้าง (build)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
