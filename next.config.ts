import type { NextConfig } from "next"

const apiProxyTarget =
  process.env.API_PROXY_TARGET ?? "http://sera-api-5t202.eastasia.cloudapp.azure.com/api"

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiProxyTarget.replace(/\/$/, "")}/:path*`,
      },
    ]
  },
}

export default nextConfig
