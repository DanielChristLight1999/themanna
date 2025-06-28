import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["largely-decent-mite.ngrok-free.app"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "af7rxiuwmjmjjw3k.public.blob.vercel-storage.com",
        port: "",
        pathname: "/images/**",
      }
    ]
  }
};

export default nextConfig;
