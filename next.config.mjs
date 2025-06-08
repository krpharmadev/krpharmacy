/** @type {import('next').NextConfig} */
const nextConfig = {
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