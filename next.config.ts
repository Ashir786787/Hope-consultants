import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
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
  async headers() {
    return [
      {
        source: "/hero/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
