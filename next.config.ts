import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "image.tmdb.org",
    pathname: "/t/p/**",
  },
  {
    protocol: "https",
    hostname: "images.unsplash.com",
  },
  {
    protocol: "https",
    hostname: "i.ytimg.com",
  },
];

const imageBase = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

if (imageBase) {
  try {
    const url = new URL(imageBase);
    if (!remotePatterns.some((pattern) => pattern.hostname === url.hostname)) {
      remotePatterns.push({
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
      });
    }
  } catch {
    // Invalid NEXT_PUBLIC_IMAGE_BASE_URL — add a valid URL in .env.local
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
  async redirects() {
    return [
      { source: "/dining", destination: "/", permanent: false },
      { source: "/dining/:path*", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
