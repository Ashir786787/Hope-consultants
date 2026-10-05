import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.hopeconsultants.pk",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "hopeconsultants.pk",
        pathname: "/**",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/*": ["./data/**"],
  },
};

export default nextConfig;
