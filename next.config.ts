import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Keep the original top-level tab URLs working.
    return [
      { source: "/home", destination: "/app/home", permanent: false },
      { source: "/discover", destination: "/app/discover", permanent: false },
      { source: "/matches", destination: "/app/matches", permanent: false },
    ];
  },
};

export default nextConfig;
