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
    const immutable = [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ];
    return [
      {
        source: "/hero/:path*",
        headers: immutable,
      },
      {
        source: "/university-images/:path*",
        headers: immutable,
      },
      {
        source: "/brand/:path*",
        headers: immutable,
      },
      {
        source: "/countries/:path*",
        headers: immutable,
      },
      {
        source: "/scholarships/:path*",
        headers: immutable,
      },
      {
        source: "/services/:path*",
        headers: immutable,
      },
      {
        source: "/team/:path*",
        headers: immutable,
      },
      {
        source: "/parents/:path*",
        headers: immutable,
      },
    ];
  },
};

export default nextConfig;
