import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   allowedDevOrigins: [
    "192.168.1.2",
    "192.168.1.3",
    "localhost",
    "0.0.0.0",
    "192.168.0.109",
  ],
};

export default nextConfig;
