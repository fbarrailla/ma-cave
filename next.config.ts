import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tlhumuofgxhrzblbzokp.supabase.co',
      },
    ],
  },
}

export default nextConfig
