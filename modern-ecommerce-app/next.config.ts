import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   allowedDevOrigins: [
    "192.168.1.2",
    "192.168.1.3",
    "192.168.1.4",
    "192.168.1.7",
    "localhost",
    "0.0.0.0",
    "192.168.0.109",
    "172.20.10.7",
    "192.168.0.108",
  ],
};

export default nextConfig;
