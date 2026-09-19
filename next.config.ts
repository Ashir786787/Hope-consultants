import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
  },
  outputFileTracingIncludes: {
    "/*": ["./data/**"],
  },
};

export default nextConfig;