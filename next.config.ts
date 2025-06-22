import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["mychristlightdev.loca.lt" ,"largely-decent-mite.ngrok-free.app","christlight-pc.local", "192.168.0.131.nip.io", "app.192.168.0.131.nip.io"],
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
