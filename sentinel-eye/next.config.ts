import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/ssg/viewgrid',
  assetPrefix: '/ssg/viewgrid',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
