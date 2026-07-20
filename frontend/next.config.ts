import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Forces Next.js to ignore slow Google Font downloads that cause AbortErrors
  optimizeFonts: false,

  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;