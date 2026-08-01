import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  async headers() {
    return [
      {
        // The worker is the one file that must never be served from cache: it is what
        // decides how everything else is cached, so a stale copy is unevictable.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
    ]
  },
}

export default nextConfig
